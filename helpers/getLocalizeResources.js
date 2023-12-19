import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

const CacheName = 'd2l-oslo';
const ContentTypeHeader = 'Content-Type';
const ContentTypeJson = 'application/json';
const DebounceTime = 150;
const ETagHeader = 'ETag';
const StateFetching = 2;
const StateIdle = 1;

const BatchFailedReason = new Error('Failed to fetch batch overrides.');
const SingleFailedReason = new Error('Failed to fetch overrides.');

const blobs = new Map();

let cache = undefined;
let cachePromise = undefined;
let documentLocaleSettings = undefined;
let queue = [];
let state = StateIdle;
let timer = 0;
let debug = false;

async function publish(request, response) {

	if (response.ok) {
		const overridesJson = await response.json();
		request.resolve(overridesJson);
	} else {
		request.reject(SingleFailedReason);
	}
}

async function flushQueue() {

	timer = 0;
	state = StateFetching;

	if (queue.length <= 0) {
		state = StateIdle;
		return;
	}

	const requests = queue;

	queue = [];

	const resources = requests.map(item => item.resource);
	const bodyObject = { resources };
	const bodyText = JSON.stringify(bodyObject);

	const res = await fetch(documentLocaleSettings.oslo.batch, {
		method: 'POST',
		body: bodyText,
		headers: { [ContentTypeHeader]: ContentTypeJson }
	});

	if (res.ok) {

		const responses = (await res.json()).resources;

		const tasks = [];

		for (let i = 0; i < responses.length; ++i) {

			const response = responses[i];
			const request = requests[i];

			const responseValue = new Response(response.body, {
				status: response.status,
				headers: response.headers
			});

			// New version might be available since the page loaded, so make a
			// record of it.

			const nextVersion = responseValue.headers.get(ETagHeader);
			if (nextVersion) {
				setVersion(nextVersion);
			}

			const cacheKey = new Request(formatCacheKey(request.resource));
			const cacheValue = responseValue.clone();

			if (cache === undefined) {
				if (cachePromise === undefined) {
					cachePromise = caches.open(CacheName);
				}
				cache = await cachePromise;
			}

			debug && console.log(`[Oslo] cache prime: ${request.resource}`);
			tasks.push(cache.put(cacheKey, cacheValue));
			tasks.push(publish(request, responseValue));
		}

		await Promise.all(tasks);

	} else {

		for (const request of requests) {

			request.reject(BatchFailedReason);
		}
	}

	if (queue.length > 0) {
		setTimeout(flushQueue, 0);
	} else {
		state = StateIdle;
	}
}

function debounceQueue() {

	if (state !== StateIdle) {
		return;
	}

	if (timer > 0) {
		clearTimeout(timer);
	}

	timer = setTimeout(flushQueue, DebounceTime);
}

async function fetchCollection(url) {

	if (blobs.has(url)) {
		return Promise.resolve(blobs.get(url));
	}

	const res = await fetch(url, { method: 'GET' });

	if (res.ok) {
		const resJson = await res.json();
		blobs.set(url, resJson);
		return Promise.resolve(resJson);
	} else {
		return Promise.reject(SingleFailedReason);
	}
}

function fetchWithQueuing(resource) {

	const promise = new Promise((resolve, reject) => {

		queue.push({ resource, resolve, reject });
	});

	debounceQueue();

	return promise;
}

function formatCacheKey(resource) {

	return formatOsloRequest(documentLocaleSettings.oslo.collection, resource);
}

async function fetchWithCaching(resource) {

	if (cache === undefined) {
		if (cachePromise === undefined) {
			cachePromise = caches.open(CacheName);
		}
		cache = await cachePromise;
	}

	const cacheKey = new Request(formatCacheKey(resource));
	const cacheValue = await cache.match(cacheKey);
	if (cacheValue === undefined) {
		debug && console.log(`[Oslo] cache miss: ${resource}`);
		return fetchWithQueuing(resource);
	}

	debug && console.log(`[Oslo] cache hit: ${resource}`);
	if (!cacheValue.ok) {
		fetchWithQueuing(resource).then(url => URL.revokeObjectURL(url));
		throw SingleFailedReason;
	}

	// Check if the cache response is stale based on either the document init or
	// any requests we've made to the LMS since init. We'll still serve stale
	// from cache for this page, but we'll update it in the background for the
	// next page.

	// We rely on the ETag header to identify if the cache needs to be updated.
	// The LMS will provide it in the format: [release].[build].[langModifiedVersion]
	// So for example, an ETag in the 20.20.10 release could be: 20.20.10.24605.55520

	const currentVersion = getVersion();
	if (currentVersion) {

		const previousVersion = cacheValue.headers.get(ETagHeader);
		if (previousVersion !== currentVersion) {

			debug && console.log(`[Oslo] cache stale: ${resource}`);
			fetchWithQueuing(resource).then(url => URL.revokeObjectURL(url));
		}
	}

	return await cacheValue.json();
}

function fetchWithPooling(resource) {

	// At most one request per resource.

	let promise = blobs.get(resource);
	if (promise === undefined) {
		promise = fetchWithCaching(resource);
		blobs.set(resource, promise);
	}
	return promise;
}

async function shouldUseBatchFetch() {

	if (documentLocaleSettings === undefined) {
		documentLocaleSettings = getDocumentLocaleSettings();
	}

	if (!documentLocaleSettings.oslo) {
		return false;
	}

	try {

		// try opening CacheStorage, if the session is in a private browser in firefox this throws an exception
		await caches.open(CacheName);

		// Only batch if we can do client-side caching, otherwise it's worse on each
		// subsequent page navigation.

		return Boolean(documentLocaleSettings.oslo.batch) && 'CacheStorage' in window;
	} catch (err) {
		return false;
	}

}

function shouldUseCollectionFetch() {

	if (documentLocaleSettings === undefined) {
		documentLocaleSettings = getDocumentLocaleSettings();
	}

	if (!documentLocaleSettings.oslo) {
		return false;
	}

	return Boolean(documentLocaleSettings.oslo.collection);
}

function setVersion(version) {

	if (documentLocaleSettings === undefined) {
		documentLocaleSettings = getDocumentLocaleSettings();
	}

	if (!documentLocaleSettings.oslo) {
		return;
	}

	documentLocaleSettings.oslo.version = version;
}

function getVersion() {

	if (documentLocaleSettings === undefined) {
		documentLocaleSettings = getDocumentLocaleSettings();
	}

	const shouldReturnVersion =
		documentLocaleSettings.oslo &&
		documentLocaleSettings.oslo.version;
	if (!shouldReturnVersion) {
		return null;
	}

	return documentLocaleSettings.oslo.version;
}

async function shouldFetchOverrides() {

	const isOsloAvailable =
		await shouldUseBatchFetch() ||
		shouldUseCollectionFetch();

	return isOsloAvailable;
}

async function fetchOverride(formatFunc) {

	let resource, res, requestURL;

	if (await shouldUseBatchFetch()) {

		// If batching is available, pool requests together.

		resource = formatFunc();
		res = fetchWithPooling(resource);

	} else /* shouldUseCollectionFetch() == true */ {

		// Otherwise, fetch it directly and let the LMS manage the cache.

		resource = formatFunc();
		requestURL = formatOsloRequest(documentLocaleSettings.oslo.collection, resource);

		res = fetchCollection(requestURL);

	}
	res = res.catch(coalesceToNull);
	return res;
}

function coalesceToNull() {

	return null;
}

function formatOsloRequest(baseUrl, resource) {
	return `${baseUrl}/${resource}`;
}

export function __clearWindowCache() {

	// Used to reset state for tests.

	blobs.clear();
	cache = undefined;
	cachePromise = undefined;
}

export function __enableDebugging() {

	// Used to enable debug logging during development.

	debug = true;
}

export async function getLocalizeOverrideResources(
	langCode,
	translations,
	formatFunc
) {
	const promises = [];

	promises.push(translations);

	if (await shouldFetchOverrides()) {
		const overrides = await fetchOverride(formatFunc);
		promises.push(overrides);
	}

	const results = await Promise.all(promises);

	return {
		language: langCode,
		resources: Object.assign({}, ...results)
	};
}

export async function getLocalizeResources(
	possibleLanguages,
	filterFunc,
	formatFunc,
	fetchFunc
) {

	const promises = [];
	let supportedLanguage;

	if (await shouldFetchOverrides()) {

		const overrides = await fetchOverride(formatFunc, fetchFunc);
		promises.push(overrides);
	}

	for (const language of possibleLanguages) {

		if (filterFunc(language)) {

			if (supportedLanguage === undefined) {
				supportedLanguage = language;
			}

			const translations = fetchFunc(formatFunc(language));
			promises.push(translations);

			break;
		}
	}

	const results = await Promise.all(promises);

	// We're fetching in best -> worst, so we'll assign worst -> best, so the
	// best overwrite everything else.

	results.reverse();

	return {
		language: supportedLanguage,
		resources: Object.assign({}, ...results)
	};
}

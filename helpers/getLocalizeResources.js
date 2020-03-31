import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

const CacheName = 'd2l-oslo';
const ContentTypeHeader = 'Content-Type';
const ContentTypeJson = 'application/json';
const DebounceTime = 150;
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

async function publish(request, response) {

	if (response.ok) {
		const blob = await response.blob();
		const objectUrl = URL.createObjectURL(blob);
		request.resolve(objectUrl);
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

			const cacheKey = new Request(formatCacheKey(request.resource));
			const cacheValue = responseValue.clone();

			if (cache === undefined) {
				if (cachePromise === undefined) {
					cachePromise = caches.open(CacheName);
				}
				cache = await cachePromise;
			}

			console.log(`[Oslo] cache prime: ${request.resource}`);
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

function fetchWithQueuing(resource) {

	const promise = new Promise((resolve, reject) => {

		queue.push({ resource, resolve, reject });
	});

	debounceQueue();

	return promise;
}

function formatCacheKey(resource) {

	return documentLocaleSettings.oslo.collection + resource;
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
		console.log(`[Oslo] cache miss: ${resource}`);
		return fetchWithQueuing(resource);
	}

	console.log(`[Oslo] cache hit: ${resource}`);
	if (!cacheValue.ok) {
		throw SingleFailedReason;
	}

	const blob = await cacheValue.blob();
	const objectUrl = URL.createObjectURL(blob);
	return objectUrl;
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

function shouldUseBatchFetch() {

	if (documentLocaleSettings === undefined) {
		documentLocaleSettings = getDocumentLocaleSettings();
	}

	if (documentLocaleSettings.oslo === undefined) {
		return false;
	}

	// Only batch if we can do client-side caching, otherwise it's worse on each
	// subsequent page navigation.

	return documentLocaleSettings.oslo.batch !== null && 'CacheStorage' in window;
}

function shouldUseCollectionFetch() {

	if (documentLocaleSettings === undefined) {
		documentLocaleSettings = getDocumentLocaleSettings();
	}

	if (documentLocaleSettings.oslo === undefined) {
		return false;
	}

	return documentLocaleSettings.oslo.collection !== null;
}

function filterOverride(language) {

	const isOsloAvailable =
		shouldUseBatchFetch() ||
		shouldUseCollectionFetch();

	// Temporary hack until we can sort out which language we should fetch
	// overrides for. We'll try for any two-part code (e.g. en-US) and the LMS
	// will match directly against the language packs (not ideal, because we
	// really want the _locale_'s language pack not the built-in language
	// packs).

	const shouldFetchOverride =
		isOsloAvailable &&
		language.length >= 5;

	return shouldFetchOverride;
}

function fetchOverride(language, formatFunc, fetchFunc) {

	let url, res;

	if (shouldUseBatchFetch()) {

		// If batching is available, pool requests together.

		url = formatFunc(language);
		url = new URL(url).pathname;

		res = fetchWithPooling(url);

	} else /* shouldUseCollectionFetch() == true */ {

		// Otherwise, fetch it directly and let the LMS manage the cache.

		url = formatFunc(language);
		url = new URL(url).pathname;
		url = documentLocaleSettings.oslo.collection + url;

		res = Promise.resolve(url);

	}

	res = res.then(fetchFunc);
	res = res.catch(coalesceToNull);

	return res;
}

function coalesceToNull(err) {

	return null;
}

export function __clearWindowCache() {

	// Used to reset state for tests.

	blobs.clear();
	cache = undefined;
	cachePromise = undefined;
}

export async function getLocalizeResources(
	possibleLanguages,
	filterFunc,
	formatFunc,
	fetchFunc
) {

	const promises = [];
	let supportedLanguage;

	for (const language of possibleLanguages) {

		if (filterOverride(language)) {

			const overrides = fetchOverride(language, formatFunc, fetchFunc);
			promises.push(overrides);
		}

		if (filterFunc(language)) {

			if (supportedLanguage === undefined) {
				supportedLanguage = language;
			}

			const translations = fetchFunc(formatFunc(language));
			promises.push(translations);
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

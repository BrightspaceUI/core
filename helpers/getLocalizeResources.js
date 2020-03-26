import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

const CacheName = 'd2l-oslo';
const ContentTypeHeader = 'Content-Type';
const ContentTypeJson = 'application/json';
const DebounceTime = 16;
const StateFetching = 2;
const StateIdle = 1;

const BatchFailedReason = new Error('Failed to fetch batch overrides.');
const SingleFailedReason = new Error('Failed to fetch overrides.');

let blobs = new Map();
let cache = undefined;
let config = undefined;
let queue = [];
let state = StateIdle;
let timer = 0;

function publish(request, cacheValue) {

	if (!cacheValue.ok) {
		request.reject(SingleFailedReason);
		return;
	}

	const blob = new Blob([cacheValue.body], {
		type: cacheValue.headers.get(ContentTypeHeader)
	});
	const objectUrl = URL.createObjectURL(blob);

	request.resolve(objectUrl);
}

function reschedule() {

	if (queue.length > 0) {
		setTimeout(flush, 0);
	} else {
		state = StateIdle;
	}
}

async function flush() {

	const batch = queue;
	const requests = [];

	state = StateFetching;
	queue = [];
	timer = 0;

	if (cache === undefined) {
		cache = await caches.open(CacheName);
	}

	// Check the shared cache first.

	for (const request of batch) {

		const cacheKey = new Request(config.collection + request.resource);
		const cacheValue = await cache.match(cacheKey);
		if (cacheValue === undefined) {
			console.log(`[Oslo] cache miss: ${request.resource}`);
			requests.push(request);
		} else {
			console.log(`[Oslo] cache hit: ${request.resource}`);
			publish(request, cacheValue);
		}
	}

	// Served from cache :-)

	if (requests.length <= 0) {

		reschedule();
		return;
	}

	// Anything not already in the shared cache will be bulk-fetched.

	const resources = requests.map(item => item.resource);
	const bodyObject = { resources };
	const bodyText = JSON.stringify(bodyObject);

	const res = await fetch(config.batch, {
		method: 'POST',
		body: bodyText,
		headers: { [ContentTypeHeader]: ContentTypeJson }
	});

	const tasks = [];

	if (res.ok) {

		const responses = (await res.json()).resources;

		for (let i = 0; i < responses.length; ++i) {

			const response = responses[i];
			const request = requests[i];

			const cacheKey = new Request(config.collection + request.resource);
			const cacheValue = new Response(response.body, {
				status: response.status,
				headers: response.headers
			});

			console.log(`[Oslo] cache prime: ${request.resource}`);
			tasks.push(cache.put(cacheKey, cacheValue));
			publish(request, cacheValue);
		}

	} else {

		for (const { reject } in requests) {
			reject(BatchFailedReason);
		}
	}

	await Promise.all(tasks);

	reschedule();
}

function debounce() {

	if (state !== StateIdle) {
		return;
	}

	if (timer > 0) {
		clearTimeout(timer);
	}

	timer = setTimeout(flush, DebounceTime);
}

function enqueue(resource) {

	const promise = new Promise((resolve, reject) => {

		queue.push({ resource, resolve, reject });
	});

	debounce();

	return promise;
}

function pool(resource) {

	// At most one request per resource.

	let promise = blobs.get(resource);
	if (promise === undefined) {
		promise = enqueue(resource);
		blobs.set(resource, promise);
	}
	return promise;
}

function ensureInitialized() {

	if (config !== undefined) {
		return;
	}

	const localeSettings = getDocumentLocaleSettings();
	if (localeSettings.oslo !== undefined) {
		config = Object.assign({}, localeSettings.oslo);
	} else {
		config = { batch: null, collection: null };
	}

	// Only batch if we can do client-side caching, otherwise it's worse on each
	// subsequent page navigation.

	if (!('CacheStorage' in window)) {
		config.batch = null;
	}
}

function filterOverride(language) {

	const isOsloAvailable =
		config.batch !== null ||
		config.collection !== null

	const shouldFetchOverride =
		isOsloAvailable &&
		language.length >= 5;

	return shouldFetchOverride;
}

function fetchOverride(language, formatFunc, fetchFunc) {

	// If batching is available, pool requests together.

	if (config.batch !== null) {

		let url, res;

		url = formatFunc(language);
		url = new URL(url).pathname;

		res = pool(url);
		res = res.then(fetchFunc);

		return res;
	}

	// Otherwise, fetch it directly and let the LMS manage the cache.

	url = formatFunc(language);
	url = new URL(url).pathname;
	url = config.collection + url;

	return res;
}

export async function getLocalizeResources(
	possibleLanguages,
	filterFunc,
	formatFunc,
	fetchFunc
) {

	ensureInitialized();

	const promises = [];
	let supportedLanguage;

	for (const language of possibleLanguages) {

		if (filterOverride(language)) {

			promises.push(fetchOverride(language, formatFunc, fetchFunc));
		}

		if (filterFunc(language)) {

			if (supportedLanguage === undefined) {
				supportedLanguage = language;
			}

			promises.push(fetchFunc(formatFunc(language)));
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

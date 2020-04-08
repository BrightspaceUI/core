import { __clearWindowCache, getLocalizeResources } from '../getLocalizeResources.js';
import { expect } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

const DefaultsEllinika = { txtOne: 'One (el)', txtTwo: 'Two (el)' };
const DefaultsEnglish = { txtOne: 'One (en)', txtTwo: 'Two (en)' };
const LanguagesGreekEnglish = ['el-GR', 'el', 'en-GB', 'en', 'en-US'];
const Overrides = { txtTwo: 'Two (override)' };
const ResourceEllinika = '/resolved/to/el.json';
const ResourceEnglish = '/resolved/to/en.json';
const ResourceOverrides = '/resolved/to/overrides.json';
const UrlBatch = 'http://lms/path/to/batch';
const UrlCollection = 'http://lms/path/to/collection';
const VersionNext = 'W\\"abc124"';
const VersionPrev = 'W\\"abc123"';

const OsloBatch = { batch: UrlBatch, collection: UrlCollection, version: VersionPrev };
const OsloDisabled = { batch: null, collection: null, version: null };
const OsloSingle = { batch: null, collection: UrlCollection, version: null };
const SupportedLanguages = new Set(['el', 'en']);
const UrlOverrides = `${UrlCollection}${ResourceOverrides}`;
const UrlResourceEnglish = `http://cdn${ResourceEnglish}`;
const UrlResourceGreek = `http://cdn${ResourceEllinika}`;

function filterFunc(language) {

	return SupportedLanguages.has(language);
}

function formatFunc(language) {

	return `http://cdn/resolved/to/${language}.json`;
}

function fetchFunc(url) {

	switch (url) {

		case UrlOverrides:
			return Overrides;

		case UrlResourceEnglish:
			return DefaultsEnglish;

		case UrlResourceGreek:
			return DefaultsEllinika;

		default:
			throw new Error(`Invalid resource: ${url}`);
	}
}

describe('getLocalizeResources', () => {

	const documentLocaleSettings = getDocumentLocaleSettings();

	if (documentLocaleSettings.oslo === undefined) {
		documentLocaleSettings.oslo = Object.assign({}, OsloDisabled);
	}

	afterEach(() => {

		sinon.restore();
		__clearWindowCache();
	});

	it('does not fetch overrides when oslo is disabled', async() => {

		sinon.stub(documentLocaleSettings, 'oslo').get(() => OsloDisabled);

		const fetchFuncSpy = sinon.spy(fetchFunc);
		const fetchStub = sinon.stub(window, 'fetch');
		const formatFuncSpy = sinon.spy(formatFunc);

		const expected = {
			language: 'el',
			resources: DefaultsEllinika
		};

		const actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.calledTwice;
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.calledTwice;
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchStub).to.have.not.been.called;
		expect(actual).to.deep.equal(expected);
	});

	it('fetches single overrides when oslo enabled', async() => {

		sinon.stub(documentLocaleSettings, 'oslo').get(() => OsloSingle);

		const fetchFuncSpy = sinon.spy(fetchFunc);
		const fetchStub = sinon.stub(window, 'fetch');
		const formatFuncSpy = sinon.spy(formatFunc);

		const expected = {
			language: 'el',
			resources: Object.assign({}, DefaultsEllinika, Overrides)
		};

		const actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly('overrides');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 lms
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlOverrides);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchStub).to.have.not.been.called;
		expect(actual).to.deep.equal(expected);
	});

	it('doesnt cache single overrides', async() => {

		sinon.stub(documentLocaleSettings, 'oslo').get(() => OsloSingle);

		const fetchFuncSpy = sinon.spy(fetchFunc);
		const fetchStub = sinon.stub(window, 'fetch');
		const formatFuncSpy = sinon.spy(formatFunc);

		const expected = {
			language: 'el',
			resources: Object.assign({}, DefaultsEllinika, Overrides)
		};

		// first call to prime cache - discarded
		await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 lms
		expect(fetchFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 lms
		expect(fetchStub).to.have.not.been.called;

		formatFuncSpy.resetHistory();
		fetchFuncSpy.resetHistory();

		const actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 lms
		expect(fetchFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 lms
		expect(fetchStub).to.have.not.been.called;

		expect(actual).to.deep.equal(expected);
	});

	it('fetches batch overrides when enabled, and caches them', async() => {

		const config = Object.assign({}, OsloBatch); // version gets mutated
		sinon.stub(documentLocaleSettings, 'oslo').get(() => config);

		const cache = new Map();

		const cacheFake = {
			match(request) {

				const response = cache.get(request.url);
				return Promise.resolve(response && response.clone());
			},
			put(request, response) {

				cache.set(request.url, response);
				return Promise.resolve();
			}
		};

		const cacheStorageFake = {
			open() {
				return Promise.resolve(cacheFake);
			}
		};

		sinon.replaceGetter(window, 'caches', () => cacheStorageFake);

		let counter = 0;

		sinon.replace(URL, 'createObjectURL', () => `blob://fake-${++counter}`);

		function fetchFuncSpecialized(url) {

			switch (url) {

				case 'blob://fake-1':
				case 'blob://fake-2':
					return Overrides;

				default:
					return fetchFunc(url);
			}
		}

		const fetchFuncSpy = sinon.spy(fetchFuncSpecialized);
		const fetchStub = sinon.stub(window, 'fetch');
		const formatFuncSpy = sinon.spy(formatFunc);
		const matchSpy = sinon.spy(cacheFake, 'match');
		const openSpy = sinon.spy(cacheStorageFake, 'open');
		const putSpy = sinon.spy(cacheFake, 'put');

		fetchStub.resolves({
			ok: true,
			json() {
				return Promise.resolve({
					resources: [
						{
							status: 200,
							headers: [
								['Content-Type', 'application/json'],
								['ETag', VersionNext],
							],
							body: JSON.stringify(Overrides)
						}
					]
				});
			}
		});

		const expected = {
			language: 'el',
			resources: Object.assign({}, DefaultsEllinika, Overrides)
		};

		// Stage 1: novel request

		let actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly('overrides');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 blob
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-1');
		expect(openSpy).to.have.been.calledOnceWithExactly('d2l-oslo');
		expect(matchSpy).to.have.been.callCount(1);
		expect(matchSpy).to.have.been.calledWithMatch({ url: UrlOverrides });
		expect(fetchStub).to.have.been.calledOnceWithExactly(UrlBatch, {
			method: 'POST',
			body: JSON.stringify({
				resources: [ResourceOverrides]
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		expect(putSpy).to.have.been.callCount(1);
		expect(actual).to.deep.equal(expected);

		fetchFuncSpy.resetHistory();
		fetchStub.resetHistory();
		formatFuncSpy.resetHistory();
		matchSpy.resetHistory();
		openSpy.resetHistory();
		putSpy.resetHistory();

		// Stage 2: window cache

		actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 cache key
		expect(formatFuncSpy).to.have.been.calledWithExactly('overrides');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 blob
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-1');
		expect(openSpy).to.have.not.been.called; // in the window cache
		expect(matchSpy).to.have.not.been.called;
		expect(fetchStub).to.have.not.been.called;
		expect(putSpy).to.have.not.been.called;
		expect(actual).to.deep.equal(expected);

		// Stage 3: CacheStorage cache

		__clearWindowCache();
		fetchFuncSpy.resetHistory();
		fetchStub.resetHistory();
		formatFuncSpy.resetHistory();
		matchSpy.resetHistory();
		openSpy.resetHistory();
		putSpy.resetHistory();

		actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 cache key
		expect(formatFuncSpy).to.have.been.calledWithExactly('overrides');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 blob
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-2');
		expect(openSpy).to.have.been.calledOnceWithExactly('d2l-oslo');
		expect(matchSpy).to.have.been.callCount(1);
		expect(matchSpy).to.have.been.calledWithMatch({ url: UrlOverrides });
		expect(fetchStub).to.have.not.been.called; // worker updated version with NextVersion
		expect(putSpy).to.have.not.been.called;
		expect(actual).to.deep.equal(expected);
	});

	it('rejects individually when batch sub-request fails, caches failures', async() => {

		sinon.stub(documentLocaleSettings, 'oslo').get(() => OsloBatch);

		const cacheFake = {
			match() {
				return Promise.resolve();
			},
			put() {
				return Promise.resolve();
			}
		};

		const cacheStorageFake = {
			open() {
				return Promise.resolve(cacheFake);
			}
		};

		sinon.replaceGetter(window, 'caches', () => cacheStorageFake);

		let counter = 0;

		sinon.replace(URL, 'createObjectURL', () => `blob://fake-${++counter}`);

		const fetchFuncSpy = sinon.spy(fetchFunc);
		const fetchStub = sinon.stub(window, 'fetch');
		const formatFuncSpy = sinon.spy(formatFunc);
		const putSpy = sinon.spy(cacheFake, 'put');

		fetchStub.resolves({
			ok: true,
			json() {
				return Promise.resolve({
					resources: [
						{
							status: 404,
							headers: [],
							body: ''
						}
					]
				});
			}
		});

		const expected = {
			language: 'el',
			resources: DefaultsEllinika
		};

		let actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly('overrides');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(2); // 2 cdn
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchStub).to.have.been.calledOnce;
		expect(fetchStub).to.have.been.calledWithExactly(UrlBatch, {
			method: 'POST',
			body: JSON.stringify({
				resources: [ResourceOverrides]
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		expect(putSpy).to.have.been.callCount(1);
		expect(actual).to.deep.equal(expected);

		formatFuncSpy.resetHistory();
		fetchFuncSpy.resetHistory();
		fetchStub.resetHistory();
		putSpy.resetHistory();

		actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 cache key
		expect(formatFuncSpy).to.have.been.calledWithExactly('overrides');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(2); // 2 cdn
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchStub).to.have.not.been.called;
		expect(putSpy).to.have.not.been.called;
		expect(actual).to.deep.equal(expected);
	});

	it('rejects everything when batch request', async() => {

		sinon.stub(documentLocaleSettings, 'oslo').get(() => OsloBatch);

		const cacheFake = {
			match() {
				return Promise.resolve();
			},
			put() {
				return Promise.resolve();
			}
		};

		const cacheStorageFake = {
			open() {
				return Promise.resolve(cacheFake);
			}
		};

		sinon.replaceGetter(window, 'caches', () => cacheStorageFake);

		const fetchFuncSpy = sinon.spy(fetchFunc);
		const fetchStub = sinon.stub(window, 'fetch');
		const formatFuncSpy = sinon.spy(formatFunc);
		const putSpy = sinon.spy(cacheFake, 'put');

		fetchStub.resolves({ ok: false });

		const expected = {
			language: 'el',
			resources: DefaultsEllinika
		};

		let actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly('overrides');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(2); // 2 cdn
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchStub).to.have.been.calledOnce;
		expect(fetchStub).to.have.been.calledWithExactly(UrlBatch, {
			method: 'POST',
			body: JSON.stringify({
				resources: [ResourceOverrides]
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		expect(putSpy).to.have.not.been.called;
		expect(actual).to.deep.equal(expected);

		formatFuncSpy.resetHistory();
		fetchFuncSpy.resetHistory();
		fetchStub.resetHistory();
		putSpy.resetHistory();

		actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(3); // 2 cdn, 1 cache key
		expect(formatFuncSpy).to.have.been.calledWithExactly('overrides');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(2); // 2 cdn
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchStub).to.have.not.been.called;
		expect(putSpy).to.have.not.been.called;
		expect(actual).to.deep.equal(expected);
	});
});

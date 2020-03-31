import { __clearWindowCache, getLocalizeResources } from '../getLocalizeResources.js';
import { expect } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

const DefaultsEllinika = { txtOne: 'One (el)', txtTwo: 'Two (el)' };
const DefaultsEnglish = { txtOne: 'One (en)', txtTwo: 'Two (en)' };
const LanguagesGreekEnglish = ['el-GR', 'el', 'en-GB', 'en', 'en-US'];
const OverridesAmerican = { txtOne: 'One (en-US, override)' };
const OverridesBritish = { txtOne: 'One (en-GB, override)' };
const OverridesGreek = { txtTwo: 'Two (el-GR, override)' };
const ResourceAmerican = '/resolved/to/en-US.json';
const ResourceBritish = '/resolved/to/en-GB.json';
const ResourceEllinika = '/resolved/to/el.json';
const ResourceEnglish = '/resolved/to/en.json';
const ResourceGreek = '/resolved/to/el-GR.json';
const UrlBatch = 'http://lms/path/to/batch';
const UrlCollection = 'http://lms/path/to/collection';

const OsloBatch = { batch: UrlBatch, collection: UrlCollection };
const OsloDisabled = { batch: null, collection: null };
const OsloSingle = { batch: null, collection: UrlCollection };
const SupportedLanguages = new Set(['el', 'en']);
const UrlOverridesAmerican = `${UrlCollection}/resolved/to/en-US.json`;
const UrlOverridesBritish = `${UrlCollection}/resolved/to/en-GB.json`;
const UrlOverridesGreek = `${UrlCollection}/resolved/to/el-GR.json`;
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

		case UrlOverridesAmerican:
			return OverridesAmerican;

		case UrlOverridesBritish:
			return OverridesBritish;

		case UrlOverridesGreek:
			return OverridesGreek;

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
			resources: Object.assign({}, DefaultsEllinika, OverridesGreek)
		};

		const actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly('el-GR');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-GB');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-US');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 lms
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlOverridesAmerican);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlOverridesBritish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlOverridesGreek);
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
			resources: Object.assign({}, DefaultsEllinika, OverridesGreek)
		};

		// first call to prime cache - discarded
		await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 lms
		expect(fetchFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 lms
		expect(fetchStub).to.have.not.been.called;

		formatFuncSpy.resetHistory();
		fetchFuncSpy.resetHistory();

		const actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 lms
		expect(fetchFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 lms
		expect(fetchStub).to.have.not.been.called;

		expect(actual).to.deep.equal(expected);
	});

	it('fetches batch overrides when enabled, and caches them', async() => {

		sinon.stub(documentLocaleSettings, 'oslo').get(() => OsloBatch);

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
				case 'blob://fake-4':
					return OverridesGreek;

				case 'blob://fake-2':
				case 'blob://fake-5':
					return OverridesBritish;

				case 'blob://fake-3':
				case 'blob://fake-6':
					return OverridesAmerican;

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
							headers: [['Content-Type', 'application/json']],
							body: JSON.stringify(OverridesGreek)
						},
						{
							status: 200,
							headers: [['Content-Type', 'application/json']],
							body: JSON.stringify(OverridesBritish)
						},
						{
							status: 200,
							headers: [['Content-Type', 'application/json']],
							body: JSON.stringify(OverridesAmerican)
						}
					]
				});
			}
		});

		const expected = {
			language: 'el',
			resources: Object.assign({}, DefaultsEllinika, OverridesGreek)
		};

		// Stage 1: novel request

		let actual = await getLocalizeResources(
			LanguagesGreekEnglish,
			filterFunc,
			formatFuncSpy,
			fetchFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly('el-GR');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-GB');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-US');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 blobs
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-1');
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-2');
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-3');
		expect(openSpy).to.have.been.calledOnceWithExactly('d2l-oslo');
		expect(matchSpy).to.have.been.callCount(3);
		expect(matchSpy).to.have.been.calledWithMatch({ url: UrlOverridesAmerican });
		expect(matchSpy).to.have.been.calledWithMatch({ url: UrlOverridesBritish });
		expect(matchSpy).to.have.been.calledWithMatch({ url: UrlOverridesGreek });
		expect(fetchStub).to.have.been.calledOnceWithExactly(UrlBatch, {
			method: 'POST',
			body: JSON.stringify({
				resources: [ResourceGreek, ResourceBritish, ResourceAmerican]
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		expect(putSpy).to.have.been.callCount(3);
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

		expect(formatFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 cache keys
		expect(formatFuncSpy).to.have.been.calledWithExactly('el-GR');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-GB');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-US');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 blobs
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-1');
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-2');
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-3');
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

		expect(formatFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 cache keys
		expect(formatFuncSpy).to.have.been.calledWithExactly('el-GR');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-GB');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-US');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 blobs
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-4');
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-5');
		expect(fetchFuncSpy).to.have.been.calledWithExactly('blob://fake-6');
		expect(openSpy).to.have.been.calledOnceWithExactly('d2l-oslo');
		expect(matchSpy).to.have.been.callCount(3);
		expect(matchSpy).to.have.been.calledWithMatch({ url: UrlOverridesAmerican });
		expect(matchSpy).to.have.been.calledWithMatch({ url: UrlOverridesBritish });
		expect(matchSpy).to.have.been.calledWithMatch({ url: UrlOverridesGreek });
		expect(fetchStub).to.have.not.been.called;
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
						},
						{
							status: 404,
							headers: [],
							body: ''
						},
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

		expect(formatFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly('el-GR');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-GB');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-US');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(2); // 2 cdn
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchStub).to.have.been.calledOnce;
		expect(fetchStub).to.have.been.calledWithExactly(UrlBatch, {
			method: 'POST',
			body: JSON.stringify({
				resources: [ResourceGreek, ResourceBritish, ResourceAmerican]
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		expect(putSpy).to.have.been.callCount(3);
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

		expect(formatFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 cache keys
		expect(formatFuncSpy).to.have.been.calledWithExactly('el-GR');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-GB');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-US');
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

		expect(formatFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly('el-GR');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-GB');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-US');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(2); // 2 cdn
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchStub).to.have.been.calledOnce;
		expect(fetchStub).to.have.been.calledWithExactly(UrlBatch, {
			method: 'POST',
			body: JSON.stringify({
				resources: [ResourceGreek, ResourceBritish, ResourceAmerican]
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

		expect(formatFuncSpy).to.have.been.callCount(5); // 2 cdn, 3 cache keys
		expect(formatFuncSpy).to.have.been.calledWithExactly('el-GR');
		expect(formatFuncSpy).to.have.been.calledWithExactly('el');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-GB');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en-US');
		expect(formatFuncSpy).to.have.been.calledWithExactly('en');
		expect(fetchFuncSpy).to.have.been.callCount(2); // 2 cdn
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceEnglish);
		expect(fetchFuncSpy).to.have.been.calledWithExactly(UrlResourceGreek);
		expect(fetchStub).to.have.not.been.called;
		expect(putSpy).to.have.not.been.called;
		expect(actual).to.deep.equal(expected);
	});
});

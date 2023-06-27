import { __clearWindowCache, getLocalizeOverrideResources } from '../getLocalizeResources.js';
import { expect } from '@brightspace-ui/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

const DefaultsGreek = { txtOne: 'One (el)', txtTwo: 'Two (el)' };
const DefaultsEnglish = { txtOne: 'One (en)', txtTwo: 'Two (en)' };
const Overrides = { txtTwo: 'Two (override)' };
const ResourceOverrides = 'd2l-package\\some-component';
const UrlBatch = 'http://lms/path/to/batch';
const UrlCollection = 'http://lms/path/to/collection';
const VersionNext = 'W\\"abc124"';
const VersionPrev = 'W\\"abc123"';

const OsloBatch = { batch: UrlBatch, collection: UrlCollection, version: VersionPrev };
const OsloDisabled = { batch: null, collection: null, version: null };
const OsloSingle = { batch: null, collection: UrlCollection, version: null };
const UrlOverrides = `${UrlCollection}${ResourceOverrides}`;

function formatFunc() {
	return 'd2l-package\\some-component';
}

describe('getLocalizeResources', () => {

	const documentLocaleSettings = getDocumentLocaleSettings();

	if (documentLocaleSettings.oslo === undefined) {
		documentLocaleSettings.oslo = Object.assign({}, OsloDisabled);
	}

	before(() => {
		// Chrome/Safari only expose over HTTPS,
		// therefore window.caches and window.CacheStorage may be undefined
		if (!('caches' in window)) {
			Object.defineProperty(window, 'caches', {
				configurable: true,
				get: function() { return undefined;}
			});
		}
		if (!('CacheStorage' in window)) {
			Object.defineProperty(window, 'CacheStorage', {
				configurable: true,
				get: function() { return undefined;}
			});
		}
	});

	afterEach(() => {

		sinon.restore();
		__clearWindowCache();
	});

	it('does not fetch overrides when oslo is disabled', async() => {

		sinon.stub(documentLocaleSettings, 'oslo').get(() => OsloDisabled);

		const fetchStub = sinon.stub(window, 'fetch');
		const formatFuncSpy = sinon.spy(formatFunc);

		const expected = {
			language: 'en',
			resources: DefaultsEnglish
		};

		const actual = await getLocalizeOverrideResources(
			'en',
			DefaultsEnglish,
			formatFuncSpy
		);

		expect(formatFuncSpy).to.have.not.been.called;
		expect(fetchStub).to.have.not.been.called;
		expect(actual).to.deep.equal(expected);
	});

	it('fetches single overrides when oslo enabled', async() => {

		sinon.stub(documentLocaleSettings, 'oslo').get(() => OsloSingle);

		const fetchStub = sinon.stub(window, 'fetch');
		const formatFuncSpy = sinon.spy(formatFunc);

		fetchStub.resolves({
			ok: true,
			json() {
				return Promise.resolve(
					Overrides
				);
			}
		});

		const expected = {
			language: 'el',
			resources: Object.assign({}, DefaultsGreek, Overrides)
		};

		const actual = await getLocalizeOverrideResources(
			'el',
			DefaultsGreek,
			formatFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(1); // 1 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly();
		expect(fetchStub).to.have.been.called;
		expect(actual).to.deep.equal(expected);
	});

	it('doesnt cache single overrides', async() => {

		sinon.stub(documentLocaleSettings, 'oslo').get(() => OsloSingle);

		const fetchStub = sinon.stub(window, 'fetch');
		const formatFuncSpy = sinon.spy(formatFunc);

		const expected = {
			language: 'el',
			resources: Object.assign({}, DefaultsGreek, Overrides)
		};

		fetchStub.resolves({
			ok: true,
			json() {
				return Promise.resolve(
					Overrides
				);
			}
		});

		// first call to prime cache - discarded
		await getLocalizeOverrideResources(
			'el',
			DefaultsGreek,
			formatFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(1); // 1 lms
		expect(fetchStub).to.have.been.callCount(1);

		formatFuncSpy.resetHistory();
		fetchStub.resetHistory();

		const actual = await getLocalizeOverrideResources(
			'el',
			DefaultsGreek,
			formatFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(1); // 1 lms
		expect(fetchStub).to.have.been.callCount(0);
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
							json() {
								() => {
									Overrides;
								};
							},
							body: JSON.stringify(Overrides)
						}
					]
				});
			}
		});

		const expected = {
			language: 'el',
			resources: Object.assign({}, DefaultsGreek, Overrides)
		};

		// Stage 1: novel request

		let actual = await getLocalizeOverrideResources(
			'el',
			DefaultsGreek,
			formatFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(1); // 1 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly();
		expect(openSpy).to.always.have.been.calledWithExactly('d2l-oslo');
		expect(openSpy).to.have.callCount(3);
		expect(matchSpy).to.have.been.callCount(1);
		expect(matchSpy).to.have.been.calledWithMatch(new Request(UrlOverrides));
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

		fetchStub.resetHistory();
		formatFuncSpy.resetHistory();
		matchSpy.resetHistory();
		openSpy.resetHistory();
		putSpy.resetHistory();

		// Stage 2: window cache

		actual = await getLocalizeOverrideResources(
			'el',
			DefaultsGreek,
			formatFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(1); // 1 cache key
		expect(formatFuncSpy).to.have.been.calledWithExactly();
		expect(openSpy).to.always.have.been.calledWithExactly('d2l-oslo'); // in the window cache
		expect(openSpy).to.have.callCount(2);
		expect(matchSpy).to.have.not.been.called;
		expect(fetchStub).to.have.not.been.called;
		expect(putSpy).to.have.not.been.called;
		expect(actual).to.deep.equal(expected);

		// Stage 3: CacheStorage cache

		__clearWindowCache();
		fetchStub.resetHistory();
		formatFuncSpy.resetHistory();
		matchSpy.resetHistory();
		openSpy.resetHistory();
		putSpy.resetHistory();

		actual = await getLocalizeOverrideResources(
			'el',
			DefaultsGreek,
			formatFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(1); // 1 cache key
		expect(formatFuncSpy).to.have.been.calledWithExactly();
		expect(openSpy).to.have.been.calledWithExactly('d2l-oslo');
		expect(openSpy).to.have.callCount(3);
		expect(matchSpy).to.have.been.callCount(1);
		expect(matchSpy).to.have.been.calledWithMatch(new Request(UrlOverrides));
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
			resources: DefaultsGreek
		};

		let actual = await getLocalizeOverrideResources(
			'el',
			DefaultsGreek,
			formatFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(1); // 1 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly();
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
		fetchStub.resetHistory();
		putSpy.resetHistory();

		actual = await getLocalizeOverrideResources(
			'el',
			DefaultsGreek,
			formatFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(1); // 1 cache key
		expect(formatFuncSpy).to.have.been.calledWithExactly();
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

		const fetchStub = sinon.stub(window, 'fetch');
		const formatFuncSpy = sinon.spy(formatFunc);
		const putSpy = sinon.spy(cacheFake, 'put');

		fetchStub.resolves({ ok: false });

		const expected = {
			language: 'el',
			resources: DefaultsGreek
		};

		let actual = await getLocalizeOverrideResources(
			'el',
			DefaultsGreek,
			formatFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(1); // 1 lms
		expect(formatFuncSpy).to.have.been.calledWithExactly();
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
		fetchStub.resetHistory();
		putSpy.resetHistory();

		actual = await getLocalizeOverrideResources(
			'el',
			DefaultsGreek,
			formatFuncSpy
		);

		expect(formatFuncSpy).to.have.been.callCount(1); // 1 cache key
		expect(formatFuncSpy).to.have.been.calledWithExactly();
		expect(fetchStub).to.have.not.been.called;
		expect(putSpy).to.have.not.been.called;
		expect(actual).to.deep.equal(expected);
	});
});

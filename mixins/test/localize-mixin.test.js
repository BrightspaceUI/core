import '../demo/localize-test.js';
import '../demo/localize-test-async.js';
import { expect, fixture } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

const staticFixture = '<d2l-test-localize></d2l-test-localize>';
const langSetFixture = '<d2l-test-localize __language="fr"></d2l-test-localize>';
const asyncFixture = '<d2l-test-localize-async name="Bill"></d2l-test-localize-async>';

describe('LocalizeMixin', () => {

	const documentLocaleSettings = getDocumentLocaleSettings();

	afterEach(() => documentLocaleSettings.reset());

	['static', 'async'].forEach((type) => {

		const f = (type === 'static') ? staticFixture : asyncFixture;
		const tagName = (type === 'static') ? 'd2l-test-localize' : 'd2l-test-localize-async';

		describe(`localize (${type})`, () => {
			let elem;
			beforeEach(async() => {
				elem = await fixture(f);
			});
			it('should localize text using object format', () => {
				const val = elem.localize('hello', {name: 'Bill'});
				expect(val).to.equal('Hello Bill');
			});
			it('should localize text using legacy format', () => {
				const val = elem.localize('hello', 'name', 'Bill');
				expect(val).to.equal('Hello Bill');
			});
			it('should re-localize text when locale changes', (done) => {
				const valInitial = elem.localize('hello', {name: 'Sam'});
				expect(valInitial).to.equal('Hello Sam');
				const myEventListener = () => {
					const val = elem.localize('hello', {name: 'Mary'});
					expect(val).to.equal('Bonjour Mary');
					elem.removeEventListener('d2l-localize-behavior-language-changed', myEventListener);
					done();
				};
				elem.addEventListener('d2l-localize-behavior-language-changed', myEventListener);
				documentLocaleSettings.language = 'fr';
			});
			it('should localize term using plurals', () => {
				const val = elem.localize('plural', {itemCount: 1});
				expect(val).to.equal('You have 1 item.');
			});
		});

		it(`should only render once (${type})`, (done) => {
			fixture('<div></div>').then((container) => {
				const elem = document.createElement(tagName);
				let renderCount = 0;
				elem.addEventListener('d2l-test-localize-render', () => {
					renderCount++;
				});
				container.appendChild(elem);
				setTimeout(() => {
					expect(renderCount).to.equal(1);
					done();
				}, 100);
			});
		});

	});

	describe('lang set', () => {
		it('should ignore "__language" attribute and use default', async() => {
			const elem = await fixture(langSetFixture);
			expect(elem.__language).to.equal('en');
		});
		it('should ignore "__language" attribute and use "lang"', async() => {
			documentLocaleSettings.language = 'de';
			const elem = await fixture(langSetFixture);
			expect(elem.__language).to.equal('de');
		});
	});

	describe('shouldUpdate tracking', () => {

		it('should pass all changed properties to updated()', (done) => {
			fixture('<div></div>').then((container) => {
				const elem = document.createElement('d2l-test-localize-async');
				elem.addEventListener('d2l-test-localize-updated', (e) => {
					const props = e.detail.props;
					expect(props.size).to.equal(2);
					expect(props.has('__language'));
					expect(props.has('__resources'));
					done();
				});
				container.appendChild(elem);
			});
		});

		it('should clear changed properties after language resolution', (done) => {
			fixture('<div></div>').then((container) => {
				let first = true;
				const elem = document.createElement('d2l-test-localize-async');
				elem.setAttribute('name', 'Bill');
				elem.addEventListener('d2l-test-localize-updated', (e) => {
					const props = e.detail.props;
					if (first) {
						first = false;
						expect(props.size).to.equal(3);
						return;
					}
					expect(props.size).to.equal(1);
					expect(e.detail.props.has('name'));
					done();
				});
				elem.addEventListener('d2l-test-localize-render', () => {
					elem.setAttribute('name', 'Jim');
				});
				container.appendChild(elem);
			});
		});

	});

});

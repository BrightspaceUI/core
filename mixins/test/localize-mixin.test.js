import '../demo/localize-test.js';
import { defineCE, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '../localize-mixin.js';
import { stub } from 'sinon';

const asyncTag = defineCE(
	class extends LocalizeMixin(LitElement) {
		static get properties() {
			return {
				name: {
					type: String
				}
			};
		}
		static async getLocalizeResources(langs) {
			return new Promise((resolve) => {
				const langResources = {
					'en': {
						'hello': 'Hello {name}',
						'plural': 'You have {itemCount, plural, =0 {no items} one {1 item} other {{itemCount} items}}.'
					},
					'fr': { 'hello': 'Bonjour {name}' }
				};
				for (let i = 0; i < langs.length; i++) {
					if (langResources[langs[i]]) {
						const langVal = {
							language: langs[i],
							resources: langResources[langs[i]]
						};
						setTimeout(() => {
							resolve(langVal);
						}, 50);
					}
				}
			});
		}
		render() {
			requestAnimationFrame(
				() => this.dispatchEvent(new CustomEvent('d2l-test-localize-render', {
					bubbles: false,
					composed: false
				}))
			);
			return html`
				<p>${this.localize('hello', {name: this.name})}</p>
			`;
		}
		updated(changedProperties) {
			super.updated(changedProperties);
			this.dispatchEvent(new CustomEvent('d2l-test-localize-updated', {
				bubbles: false,
				composed: false,
				detail: {
					props: changedProperties
				}
			}));
		}
	}
);

describe('LocalizeMixin', () => {

	const documentLocaleSettings = getDocumentLocaleSettings();

	afterEach(() => documentLocaleSettings.reset());

	['static', 'async'].forEach((type) => {

		const f = (type === 'static') ? html`<d2l-test-localize></d2l-test-localize>` :
			`<${asyncTag} name="Bill"></${asyncTag}>`;
		const tagName = (type === 'static') ? 'd2l-test-localize' : asyncTag;

		describe(`localize (${type})`, () => {

			let elem, errorSpy;
			beforeEach(async() => {
				elem = await fixture(f);
				errorSpy = stub(console, 'error');
			});

			afterEach(() => {
				errorSpy.restore();
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

			it('should not throw when a parameter is missing', () => {
				let val;
				expect(() => {
					val = elem.localize('hello', {invalidParam: 'Bill'});
				}).to.not.throw();
				expect(val).to.equal('Hello {name}');
				const errArg = errorSpy.firstCall.args[0];
				expect(errArg).to.be.instanceof(Error);
				expect(errArg.message).to.equal('The intl string context variable "name" was not provided to the string "Hello {name}"');
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

	describe('shouldUpdate tracking', () => {

		it('should pass all changed properties to updated()', () => {
			fixture('<div></div>').then(async(container) => {
				const elem = document.createElement(asyncTag);
				setTimeout(() => container.appendChild(elem));
				const { detail } = await oneEvent(elem, 'd2l-test-localize-updated');
				expect(detail.props.size).to.equal(2);
				expect(detail.props.has('__language'));
				expect(detail.props.has('__resources'));
			});
		});

		it('should clear changed properties after language resolution', (done) => {
			fixture('<div></div>').then((container) => {
				let first = true;
				const elem = document.createElement(asyncTag);
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

import { defineCE, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { generateLink, generateTooltipHelp, localizeMarkup } from '../../helpers/localize.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { LitElement } from 'lit';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { LocalizeDynamicMixin } from '../localize-dynamic-mixin.js';
import { LocalizeMixin } from '../localize-mixin.js';
import { LocalizeStaticMixin } from '../localize-static-mixin.js';
import { stub } from 'sinon';

const Test1LocalizeStaticMixin = superclass => class extends LocalizeStaticMixin(superclass) {

	static get resources() {
		return {
			'en': { 'test1': 'This is English from Test1LocalizeStaticMixin' },
			'fr': { 'test1': 'This is French from Test1LocalizeStaticMixin' }
		};
	}

};

const Test2LocalizeStaticMixin = superclass => class extends LocalizeStaticMixin(superclass) {

	static get resources() {
		return {
			'en': { 'test2': 'This is English from Test2LocalizeStaticMixin' }
		};
	}

};

const Test3LocalizeMixin = superclass => class extends LocalizeMixin(superclass) {

	static async getLocalizeResources(langs) {
		return new Promise((resolve) => {
			const langResources = {
				'en': { 'test3': 'This is English from Test3LocalizeMixin' },
				'fr': { 'test3': 'This is French from Test3LocalizeMixin' }
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

};

const Test4LocalizeMixin = superclass => class extends LocalizeMixin(superclass) {

	static async getLocalizeResources(langs) {
		return new Promise((resolve) => {
			const langResources = {
				'en': { 'test4': 'This is English from Test4LocalizeMixin' }
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

};

const Test1LocalizeDynamicMixn = superclass => class extends LocalizeDynamicMixin(superclass) {
	static get localizeConfig() {
		return {
			importFunc: () => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve({ 'testA': 'Test A Content' });
					}, 50);
				});
			}
		};
	}
};

const Test2LocalizeDynamicMixn = superclass => class extends LocalizeDynamicMixin(superclass) {
	static get localizeConfig() {
		return {
			importFunc: () => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve({ 'testB': 'Test B Content' });
					}, 50);
				});
			}
		};
	}
};

const Test3LocalizeDynamicMixn = superclass => class extends LocalizeDynamicMixin(superclass) {

	static translations = {
		'en': { laborDay: 'Labor Day' },
		'en-ca': { laborDay: 'Labour Day' },
		'fr': { laborDay: 'Fête du travail' }
	};

	static get localizeConfig() {
		return {
			importFunc: (lang) => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(this.translations[lang]);
					}, 50);
				});
			},
			useBrowserLangs: true,
		};
	}
};

const Test1LocalizeHTML = superclass => class extends LocalizeStaticMixin(superclass) {
	static get resources() {
		return {
			en: {
				test1: 'This is <b>important</b>, this is <b><i>very important</i></b>',
				test2: 'This is <link>a link</link>',
				test3: 'This is <link>replaceable</link>',
				test4: 'This is a <tooltip>tooltip-help</tooltip> within a sentence',
				test5: 'This is a <tooltip-help-1>tooltip helper</tooltip-help-1> within a sentence. Here is <tooltip-help-2>another</tooltip-help-2>.',
				pluralTest: '{itemCount, plural, =0 {Cart is empty} =1 {You have {item} in your cart. <link>Checkout</link>} other {Items in your cart:<html></html><link>Checkout</link>}}',
				typeChecker: '{a, select, true {T <i>{c}</i>} false {F - {b, date, medium}} other {O - {a}}}'
			}
		};
	}

};

const multiMixinTag = defineCE(
	class extends Test1LocalizeStaticMixin(Test3LocalizeMixin(Test2LocalizeStaticMixin(Test4LocalizeMixin(LitElement)))) {

	}
);

const multiMixinTagDynamic = defineCE(
	class extends Test1LocalizeDynamicMixn(Test2LocalizeDynamicMixn((LitElement))) {

	}
);

const browserLangsTag = defineCE(
	class extends Test3LocalizeDynamicMixn((LitElement)) {

	}
);

const multiMixinTagDynamicConsolidated = defineCE(
	class extends LocalizeDynamicMixin(LocalizeCoreElement((LitElement))) {
		static get localizeConfig() {
			return {
				importFunc: () => {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve({ 'testC': 'Test C Content' });
						}, 50);
					});
				}
			};
		}
	}
);

class StaticEl extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
			name: {
				type: String
			}
		};
	}
	static langResources = {
		'en': {
			'hello': 'Hello {name}',
			'plural': 'You have {itemCount, plural, =0 {no items} one {1 item} other {{itemCount} items}}.'
		},
		'fr': { 'hello': 'Bonjour {name}' }
	};
	static getLocalizeResources(langs) {
		for (let i = 0; i < langs.length; i++) {
			if (this.langResources[langs[i]]) {
				return {
					language: langs[i],
					resources: this.langResources[langs[i]]
				};
			}
		}
	}
	render() {
		requestAnimationFrame(
			() => this.dispatchEvent(new CustomEvent('d2l-test-localize-render', {
				bubbles: false,
				composed: false
			}))
		);
		return html`
			<p>${this.localize('hello', { name: this.name })}</p>
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

const staticTag = defineCE(StaticEl);

const asyncTag = defineCE(
	class extends StaticEl {
		static getLocalizeResources(langs) {
			for (let i = 0; i < langs.length; i++) {
				if (this.langResources[langs[i]]) {
					const resources = {
						language: langs[i],
						resources: this.langResources[langs[i]]
					};
					return new Promise(r => setTimeout(() => r(resources), 50));
				}
			}
		}
	}
);

const localizeHTMLTag = defineCE(
	class extends Test1LocalizeHTML((LitElement)) {}
);

describe('LocalizeMixin', () => {

	const documentLocaleSettings = getDocumentLocaleSettings();

	afterEach(() => documentLocaleSettings.reset());

	['static', 'async'].forEach((type) => {

		const f = (type === 'static') ? `<${staticTag}></${staticTag}>` :
			`<${asyncTag}></${asyncTag}>`;
		const tagName = (type === 'static') ? staticTag : asyncTag;

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
				const val = elem.localize('hello', { name: 'Bill' });
				expect(val).to.equal('Hello Bill');
			});

			it('should localize text using legacy format', () => {
				const val = elem.localize('hello', 'name', 'Bill');
				expect(val).to.equal('Hello Bill');
			});

			it('should re-localize text when locale changes', (done) => {
				const valInitial = elem.localize('hello', { name: 'Sam' });
				expect(valInitial).to.equal('Hello Sam');
				const myEventListener = () => {
					const val = elem.localize('hello', { name: 'Mary' });
					expect(val).to.equal('Bonjour Mary');
					elem.removeEventListener('d2l-localize-resources-change', myEventListener);
					done();
				};
				elem.addEventListener('d2l-localize-resources-change', myEventListener);
				documentLocaleSettings.language = 'fr';
			});

			it('should localize term using plurals', () => {
				const val = elem.localize('plural', { itemCount: 1 });
				expect(val).to.equal('You have 1 item.');
			});

			it('should not throw when a parameter is missing', () => {
				let val;
				expect(() => {
					val = elem.localize('hello', { invalidParam: 'Bill' });
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
				}, 300);
			});
		});

	});

	describe('localizeHTML', async() => {

		const elem = await fixture(`<${localizeHTMLTag}></${localizeHTMLTag}>`);

		const getRenderString = data => {
			if (data.constructor === String || data.constructor === Number) return data;
			if (Array.isArray(data)) {
				return data.map(e => getRenderString(e)).join('');
			}
			const { strings, values } = data;

			if (!strings || !values) return data;

			const flatValues = [...values, ''].map(v => {
				if (typeof v === 'object') return getRenderString(v);
				if (v.toString() === 'Symbol(lit-nothing)') {
					return '{lit-nothing}';
				}
				return v;
			});
			return strings.reduce((acc, s, idx) => acc + s + flatValues[idx], '').replace(/\s[\w-]+="{lit-nothing}"/g, '');
		};

		it('should replace acceptable markup with correct HTML', async() => {
			const defaultTags = elem.localizeHTML('test1');
			const manual = elem.localizeHTML('test2', { link: chunks => localizeMarkup`<d2l-link href="http://d2l.com">${chunks}</d2l-link>` });
			const disallowed = elem.localizeHTML('test3', { link: chunks => localizeMarkup`<div>${chunks}</div>` });
			const badTemplate = elem.localizeHTML('test3', { link: chunks => html`${chunks}` });
			const tooltip = elem.localizeHTML('test4', { tooltip: generateTooltipHelp({ contents: 'Tooltip text' }) });

			const items = ['milk'];
			const pluralLink = elem.localizeHTML('pluralTest', { itemCount: items.length, item: items[0], link: generateLink({ href: 'checkout' }) });

			items.push('bread', 'eggs');
			const pluralMap = elem.localizeHTML('pluralTest', { itemCount: items.length, link: generateLink({ href: 'checkout' }), html: () => items.map(i => localizeMarkup`<p>${i}</p>`) });

			expect(getRenderString(defaultTags)).to.equal('This is <strong>important</strong>, this is <strong><em>very important</em></strong>');
			expect(getRenderString(manual)).to.equal('This is <d2l-link href="http://d2l.com">a link</d2l-link>');

			expect(getRenderString(disallowed)).to.equal('This is <link>replaceable</link>');
			expect(getRenderString(badTemplate)).to.equal('This is replaceable');
			expect(getRenderString(tooltip)).to.equal('This is a <d2l-tooltip-help inherit-font-style text="tooltip-help">Tooltip text</d2l-tooltip-help> within a sentence');
			expect(getRenderString(pluralLink)).to.equal('You have milk in your cart. <d2l-link href="checkout">Checkout</d2l-link>');
			expect(getRenderString(pluralMap)).to.equal('Items in your cart:<p>milk</p><p>bread</p><p>eggs</p><d2l-link href="checkout">Checkout</d2l-link>');
		});

		let a;
		[{
			get renderString() { return elem.localizeHTML('typeChecker', { a }); },
			type: 'undefined',
			expect: 'O - '
		},
		{
			get renderString() { return elem.localizeHTML('typeChecker', { a: null }); },
			type: 'null',
			expect: 'O - '
		},
		{
			get renderString() { return elem.localizeHTML('typeChecker', { a: 1 }); },
			type: 'Number',
			expect: 'O - 1'
		},
		{
			get renderString() { return elem.localizeHTML('typeChecker', { a: {} }); },
			type: 'Object',
			expect: 'O - [object Object]'
		},
		{
			get renderString() { return elem.localizeHTML('typeChecker', { a: false, b: new Date('3/31/2023') }); },
			type: 'Date',
			expect: 'F - Mar 31, 2023'
		},
		{
			get renderString() { return elem.localizeHTML('typeChecker', { a: true, c: [1, 2, 3] }); },
			type: 'Array',
			expect: 'T <em>123</em>'
		},
		{
			get renderString() { return elem.localizeHTML('typeChecker', { a: true, c: localizeMarkup`<b>bold</b>` }); },
			type: 'localizeMarkup template object',
			expect: 'T <em><b>bold</b></em>'
		},
		{
			get renderString() { return elem.localizeHTML('typeChecker', { a: true, c: [localizeMarkup`<br>`] }); },
			type: 'Array with template Object',
			expect: 'T <em><br></em>'
		},
		{
			get renderString() { return elem.localizeHTML('typeChecker', { a: true, c: '<test>' }); },
			type: 'HTML as text',
			expect: 'T <em><test></em>'
		},
		].forEach(t => it(`should handle ${t.type}`, () => {
			expect(getRenderString(t.renderString)).to.equal(t.expect);
		}));

	});

	describe('browser language settings in dynamic mixin', () => {

		const browserLangsFixture = `<${browserLangsTag}></${browserLangsTag}>`;
		const initialBrowserLangs = navigator.languages;
		const setBrowserLangs = langs => {
			Object.defineProperty(navigator, 'languages', {
				get: () => langs,
				configurable: true
			});
		};

		after(() => {
			setBrowserLangs(initialBrowserLangs);
		});

		[{
			browserLangs: ['en-CA'],
			resolvedLang: 'en-ca',
			localizedTerm: 'Labour Day',
			it: 'should localize text based on browser settings'
		},
		{
			browserLangs: ['fr-CA', 'fr-BE', 'fr-FR', 'fr'],
			resolvedLang: 'fr',
			localizedTerm: 'Fête du travail',
			it: 'should loop until an alternative is found'
		},
		{
			browserLangs: ['fr-CA', 'fr-BE', 'fr-FR'],
			resolvedLang: 'en',
			localizedTerm: 'Labor Day',
			it: 'should fall back to en if nothing else is found'
		}].forEach(test => {

			it(test.it, async() => {
				setBrowserLangs(test.browserLangs);
				const elem = await fixture(browserLangsFixture);

				const laborDay = elem.localize('laborDay');
				expect(navigator.languages).to.deep.equal(test.browserLangs);
				expect(elem.__resources.laborDay.language).to.equal(test.resolvedLang);
				expect(laborDay).to.equal(test.localizedTerm);
			});
		});
	});

	describe('multiple localize and localize static mixin', () => {

		const multiMixinFixture = `<${multiMixinTag}></${multiMixinTag}>`;
		const multiMixinFixtureDynamic = `<${multiMixinTagDynamic}></${multiMixinTagDynamic}>`;
		const multiMixinFixtureDynamicConsolidated = `<${multiMixinTagDynamicConsolidated}></${multiMixinTagDynamicConsolidated}>`;

		let elem, elemDynamic, elemDynamicConsolidated;
		beforeEach(async() => {
			elem = await fixture(multiMixinFixture);
			elemDynamic = await fixture(multiMixinFixtureDynamic);
			elemDynamicConsolidated = await fixture(multiMixinFixtureDynamicConsolidated);
		});

		it('should localize text from all mixins', () => {
			const val1 = elem.localize('test1');
			const val2 = elem.localize('test2');
			const val3 = elem.localize('test3');
			const val4 = elem.localize('test4');

			expect(val1).to.equal('This is English from Test1LocalizeStaticMixin');
			expect(val2).to.equal('This is English from Test2LocalizeStaticMixin');
			expect(val3).to.equal('This is English from Test3LocalizeMixin');
			expect(val4).to.equal('This is English from Test4LocalizeMixin');
		});

		it('should localize text from inherited dynamic mixins', () => {
			const val1 = elemDynamic.localize('testA');
			const val2 = elemDynamic.localize('testB');

			expect(val1).to.equal('Test A Content');
			expect(val2).to.equal('Test B Content');
		});

		it('should localize text from inherited dynamic mixin and class itself', () => {
			const val1 = elemDynamicConsolidated.localize('testC');
			const val2 = elemDynamicConsolidated.localize('components.filter.clearAll');

			expect(val1).to.equal('Test C Content');
			expect(val2).to.equal('Clear All');
		});

		it('should re-localize text from all mixins when locale changes', (done) => {
			const val1Initial = elem.localize('test1');
			const val2Initial = elem.localize('test2');
			const val3Initial = elem.localize('test3');
			const val4Initial = elem.localize('test4');

			expect(val1Initial).to.equal('This is English from Test1LocalizeStaticMixin');
			expect(val2Initial).to.equal('This is English from Test2LocalizeStaticMixin');
			expect(val3Initial).to.equal('This is English from Test3LocalizeMixin');
			expect(val4Initial).to.equal('This is English from Test4LocalizeMixin');
			const myEventListener = () => {
				const val1 = elem.localize('test1');
				const val2 = elem.localize('test2');
				const val3 = elem.localize('test3');
				const val4 = elem.localize('test4');
				expect(val1).to.equal('This is French from Test1LocalizeStaticMixin');
				expect(val2).to.equal('This is English from Test2LocalizeStaticMixin');
				expect(val3).to.equal('This is French from Test3LocalizeMixin');
				expect(val4).to.equal('This is English from Test4LocalizeMixin');
				elem.removeEventListener('d2l-localize-resources-change', myEventListener);
				done();
			};
			elem.addEventListener('d2l-localize-resources-change', myEventListener);
			documentLocaleSettings.language = 'fr';
		});
	});

	describe('shouldUpdate tracking', () => {

		it('should pass all changed properties to updated()', (done) => {
			fixture('<div></div>').then(async(container) => {
				const elem = document.createElement(asyncTag);
				setTimeout(() => container.appendChild(elem));
				const { detail } = await oneEvent(elem, 'd2l-test-localize-updated');
				expect(detail.props.size).to.equal(1);
				expect(detail.props.has('__resources'));
				done();
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
						expect(props.size).to.equal(2);
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

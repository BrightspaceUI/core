import { _LocalizeMixinBase, generateLink, generateTooltipHelp, localizeMarkup, LocalizeMixin } from '../localize-mixin.js';
import { defineCE, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { LitElement, render } from 'lit';
import { restore, stub } from 'sinon';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { LocalizeCoreElement } from '../../../helpers/localize-core-element.js';

const Test1LocalizeMixinBase = superclass => class extends _LocalizeMixinBase(superclass) {

	static async getLocalizeResources(langs) {
		return new Promise((resolve) => {
			const langResources = {
				'en': { 'test3': 'This is English from Test1LocalizeMixinBase' },
				'fr': { 'test3': 'This is French from Test1LocalizeMixinBase' }
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

const Test2LocalizeMixinBase = superclass => class extends _LocalizeMixinBase(superclass) {

	static async getLocalizeResources(langs) {
		return new Promise((resolve) => {
			const langResources = {
				'en': { 'test4': 'This is English from Test2LocalizeMixinBase' }
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

const Test1LocalizeMixin = superclass => class extends LocalizeMixin(superclass) {
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

const Test2LocalizeMixin = superclass => class extends LocalizeMixin(superclass) {
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

const Test3LocalizeMixin = superclass => class extends LocalizeMixin(superclass) {

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

const Test4LocalizeMixin = superclass => class extends LocalizeMixin(superclass) {
	static get localizeConfig() {
		return {
			importFunc: () => {
				return { 'sync': 'Synchronous Content' };
			}
		};
	}
};

const Test5LocalizeMixin = superclass => class extends LocalizeMixin(superclass) {
	static get localizeConfig() {
		return {
			importFunc: (lang) => {
				if (lang === 'fr') {
					return { 'test1': 'This is French from Test5LocalizeMixin' };
				}
				return { 'test1': 'This is English from Test5LocalizeMixin' };
			}
		};
	}
};

const Test6LocalizeMixin = superclass => class extends LocalizeMixin(superclass) {
	static get localizeConfig() {
		return {
			importFunc: () => {
				return { 'test2': 'This is English from Test6LocalizeMixin' };
			}
		};
	}
};

const Test1LocalizeHTML = superclass => class extends LocalizeMixin(superclass) {
	static get localizeConfig() {
		return {
			importFunc: () => {
				return {
					test1: 'This is <strong>important</strong>, this is <strong><em>very important</em></strong>',
					test2: 'This is <link>a link</link>',
					test3: 'This is <link>replaceable</link>',
					test4: 'This is a <tooltip>tooltip-help</tooltip> within a sentence',
					test5: 'This is a <tooltip-help-1>tooltip helper</tooltip-help-1> within a sentence. Here is <tooltip-help-2>another</tooltip-help-2>.',
					test6: 'This is <b>bold</b> but not important, this is <i>italic</i> but not emphasized',
					pluralTest: '{itemCount, plural, =0 {Cart is empty} =1 {You have {item} in your cart. <link>Checkout</link>} other {Items in your cart:<html></html><link>Checkout</link>}}',
					typeChecker: '{a, select, true {T <em>{c}</em>} false {F - {b, date, medium}} other {O - {a}}}'
				};
			}
		};
	}
};

const multiMixinTagStatic = defineCE(
	class extends Test5LocalizeMixin(Test1LocalizeMixinBase(Test6LocalizeMixin(Test2LocalizeMixinBase(LitElement)))) {

	}
);

const multiMixinTag = defineCE(
	class extends Test1LocalizeMixin(Test2LocalizeMixin((LitElement))) {

	}
);

const browserLangsTag = defineCE(
	class extends Test3LocalizeMixin((LitElement)) {

	}
);

const synchronousTag = defineCE(
	class extends Test4LocalizeMixin((LitElement)) {

	}
);

const multiMixinTagConsolidated = defineCE(
	class extends LocalizeMixin(LocalizeCoreElement((LitElement))) {
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

class StaticEl extends _LocalizeMixinBase(LitElement) {
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
		static async getLocalizeResources(langs) {
			for (let i = 0; i < langs.length; i++) {
				if (this.langResources[langs[i]]) {
					const resources = {
						language: langs[i],
						resources: { getsConcatenated: 'I‘m here too!' }
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

			it('should localize text without replacement arguments', () => {
				const val = elem.localize('hello');
				expect(val).to.equal('Hello {name}');
			});

			it('should localize text with undefined replacement arguments', () => {
				const val = elem.localize('hello', undefined);
				expect(val).to.equal('Hello {name}');
			});

			it('should localize text using object format', () => {
				const val = elem.localize('hello', { name: 'Bill' });
				expect(val).to.equal('Hello Bill');
			});

			it('should localize text using legacy format', () => {
				const val = elem.localize('hello', 'name', 'Bill');
				expect(val).to.equal('Hello Bill');
			});

			it('should re-localize text when locale changes', () => {
				const valInitial = elem.localize('hello', { name: 'Sam' });
				expect(valInitial).to.equal('Hello Sam');
				let resolve;
				elem.addEventListener('d2l-localize-resources-change', () => {
					const val = elem.localize('hello', { name: 'Mary' });
					expect(val).to.equal('Bonjour Mary');
					resolve();
				}, { once: true });
				documentLocaleSettings.language = 'fr';
				return new Promise(r => resolve = r);
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

		let consoleErrorStub, elem;
		beforeEach(async() => {
			consoleErrorStub = stub(console, 'error');
			elem = await fixture(`<${localizeHTMLTag}></${localizeHTMLTag}>`);
		});

		afterEach(() => restore());

		const renderToElem = data => {
			render(data, elem);
			return elem;
		};

		it('should replace acceptable markup with correct HTML', async() => {
			const defaultTags = elem.localizeHTML('test1');
			const manual = elem.localizeHTML('test2', { link: chunks => localizeMarkup`<d2l-link href="http://d2l.com">${chunks}</d2l-link>` });
			const disallowed = elem.localizeHTML('test3', { link: chunks => localizeMarkup`<div>${chunks}</div>` });
			const badTemplate = elem.localizeHTML('test3', { link: chunks => html`${chunks}` });
			const tooltip = elem.localizeHTML('test4', { tooltip: generateTooltipHelp({ contents: 'Tooltip text' }) });
			const boldItalic = elem.localizeHTML('test6');

			const items = ['milk'];
			const pluralLink = elem.localizeHTML('pluralTest', { itemCount: items.length, item: items[0], link: generateLink({ href: 'checkout' }) });

			items.push('bread', 'eggs');
			const pluralMap = elem.localizeHTML('pluralTest', { itemCount: items.length, link: generateLink({ href: 'checkout' }), html: () => items.map(i => localizeMarkup`<p>${i}</p>`) });

			expect(consoleErrorStub).to.have.been.calledTwice;
			expect(renderToElem(defaultTags)).lightDom.to.equal('This is <strong>important</strong>, this is <strong><em>very important</em></strong>');
			expect(renderToElem(manual)).lightDom.to.equal('This is <d2l-link href="http://d2l.com">a link</d2l-link>');
			expect(renderToElem(disallowed)).lightDom.to.equal('This is &lt;link&gt;replaceable&lt;/link&gt;');
			expect(renderToElem(badTemplate)).lightDom.to.equal('This is &lt;link&gt;replaceable&lt;/link&gt;');
			expect(renderToElem(tooltip)).lightDom.to.equal('This is a <d2l-tooltip-help inherit-font-style="" text="tooltip-help">Tooltip text</d2l-tooltip-help> within a sentence');
			expect(renderToElem(boldItalic)).lightDom.to.equal('This is <b>bold</b> but not important, this is <i>italic</i> but not emphasized');
			expect(renderToElem(pluralLink)).lightDom.to.equal('You have milk in your cart. <d2l-link href="checkout">Checkout</d2l-link>');
			expect(renderToElem(pluralMap)).lightDom.to.equal('Items in your cart:<p>milk</p><p>bread</p><p>eggs</p><d2l-link href="checkout">Checkout</d2l-link>');
		});

		[{
			replacements: { a: undefined },
			type: 'undefined',
			expect: 'O - '
		},
		{
			replacements: { a: null },
			type: 'null',
			expect: 'O - '
		},
		{
			replacements: { a: 1 },
			type: 'Number',
			expect: 'O - 1'
		},
		{
			replacements: { a: {} },
			type: 'Object',
			expect: 'O - [object Object]'
		},
		{
			replacements: { a: false, b: new Date('3/31/2023') },
			type: 'Date',
			expect: 'F - Mar 31, 2023'
		},
		{
			replacements: { a: true, c: [1, 2, 3] },
			type: 'Array',
			expect: 'T <em>123</em>'
		},
		{
			replacements: { a: true, c: localizeMarkup`<b>bold</b>` },
			type: 'localizeMarkup template object',
			expect: 'T <em><b>bold</b></em>'
		},
		{
			replacements: { a: true, c: [localizeMarkup`<br>`] },
			type: 'Array with template Object',
			expect: 'T <em><br></em>'
		},
		{
			replacements: { a: true, c: '<test>' },
			type: 'HTML as text',
			expect: 'T <em>&lt;test&gt;</em>'
		}].forEach(t => it(`should handle ${t.type}`, () => {
			renderToElem(elem.localizeHTML('typeChecker', t.replacements));
			expect(elem).lightDom.to.equal(t.expect);
		}));

	});

	describe('browser language settings in mixin', () => {

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
				expect(elem.localize.resources.laborDay.language).to.equal(test.resolvedLang);
				expect(laborDay).to.equal(test.localizedTerm);
			});
		});
	});

	describe('synchronous importFunc', () => {

		it('should handle synchrnoous implementations of importFunc', async() => {
			const elem = await fixture(`<${synchronousTag}></${synchronousTag}>`);
			const value = elem.localize('sync');
			expect(value).to.equal('Synchronous Content');
		});

	});

	describe('multiple localize mixins', () => {

		const multiMixinFixtureStatic = `<${multiMixinTagStatic}></${multiMixinTagStatic}>`;
		const multiMixinFixture = `<${multiMixinTag}></${multiMixinTag}>`;
		const multiMixinFixtureConsolidated = `<${multiMixinTagConsolidated}></${multiMixinTagConsolidated}>`;

		let elem, elemStatic, elemConsolidated;
		beforeEach(async() => {
			elemStatic = await fixture(multiMixinFixtureStatic);
			elem = await fixture(multiMixinFixture);
			elemConsolidated = await fixture(multiMixinFixtureConsolidated);
		});

		it('should localize text from all mixins', () => {
			const val1 = elemStatic.localize('test1');
			const val2 = elemStatic.localize('test2');
			const val3 = elemStatic.localize('test3');
			const val4 = elemStatic.localize('test4');

			expect(val1).to.equal('This is English from Test5LocalizeMixin');
			expect(val2).to.equal('This is English from Test6LocalizeMixin');
			expect(val3).to.equal('This is English from Test1LocalizeMixinBase');
			expect(val4).to.equal('This is English from Test2LocalizeMixinBase');
		});

		it('should localize text from inherited mixins', () => {
			const val1 = elem.localize('testA');
			const val2 = elem.localize('testB');

			expect(val1).to.equal('Test A Content');
			expect(val2).to.equal('Test B Content');
		});

		it('should localize text from inherited mixin and class itself', () => {
			const val1 = elemConsolidated.localize('testC');
			const val2 = elemConsolidated.localize('components.filter.clearAll');

			expect(val1).to.equal('Test C Content');
			expect(val2).to.equal('Clear All');
		});

		it('should re-localize text from all mixins when locale changes', (done) => {
			const val1Initial = elemStatic.localize('test1');
			const val2Initial = elemStatic.localize('test2');
			const val3Initial = elemStatic.localize('test3');
			const val4Initial = elemStatic.localize('test4');

			expect(val1Initial).to.equal('This is English from Test5LocalizeMixin');
			expect(val2Initial).to.equal('This is English from Test6LocalizeMixin');
			expect(val3Initial).to.equal('This is English from Test1LocalizeMixinBase');
			expect(val4Initial).to.equal('This is English from Test2LocalizeMixinBase');
			elemStatic.addEventListener('d2l-localize-resources-change', () => {
				const val1 = elemStatic.localize('test1');
				const val2 = elemStatic.localize('test2');
				const val3 = elemStatic.localize('test3');
				const val4 = elemStatic.localize('test4');
				expect(val1).to.equal('This is French from Test5LocalizeMixin');
				expect(val2).to.equal('This is English from Test6LocalizeMixin');
				expect(val3).to.equal('This is French from Test1LocalizeMixinBase');
				expect(val4).to.equal('This is English from Test2LocalizeMixinBase');
				done();
			}, { once: true });
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
				expect(detail.props.has('localize'));
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

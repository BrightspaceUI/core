import '../link.js';
import { defineCE, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { LinkMixin } from '../link-mixin.js';
import { LitElement } from 'lit';

const tagName = defineCE(
	class extends LinkMixin(LitElement) {
		static get properties() {
			return {
				label: { type: String }
			};
		}

		render() {
			return this._render(html`Link Test${this._renderNewWindowIcon()}`, { ariaLabel: this.label });
		}
	}
);

const emptyFixture = `<${tagName}></${tagName}>`;
const newWindowFixture = `<${tagName} target="_blank"></${tagName}>`;

describe('LinkMixin', () => {
	let elem, anchor;
	beforeEach(async() => {
		elem = await fixture(emptyFixture);
		anchor = elem.shadowRoot.querySelector('a');
	});

	describe('attribute binding', () => {

		it('should not bind any properties on empty', () => {
			for (const attr of ['download', 'href', 'target'])
				expect(anchor.hasAttribute(attr)).to.be.false;
		});

		[
			{ attr: 'download', val: '', details: 'empty boolean attribute' },
			{ attr: 'download', val: 'filename.txt' },
			{ attr: 'href', val: 'https://www.d2l.com' },
			{ attr: 'target', val: '_blank' }
		].forEach(({ attr, val, details }) => {
			it(`should bind "${attr}" attribute to anchor attribute${details ? `(${details})` : ''}`, async() => {
				elem.setAttribute(attr, val);
				await elem.updateComplete;
				expect(anchor.hasAttribute(attr)).to.be.true;
				expect(anchor.getAttribute(attr)).to.equal(val);
			});
		});
	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			elem = await fixture(emptyFixture);
			setTimeout(() => elem.click());
			const { target } = await oneEvent(elem, 'click');
			expect(target).to.equal(elem);
		});

	});

	describe('new-window', () => {
		it('should add offscreen text', async() => {
			const elem = await fixture(newWindowFixture);
			expect(elem.shadowRoot.querySelector('.d2l-offscreen').innerText).to.equal('Opens in a new window.');
		});

		it('should add description if label is added', async() => {
			const elem = await fixture(newWindowFixture);
			elem.label = 'Label';
			await elem.updateComplete;
			expect(elem.shadowRoot.querySelector('a').getAttribute('aria-description')).to.equal('Opens in a new window.');
		});
	});

	describe('getNewWindowDescription', () => {

		it('should return localized string when target is _blank and label is provided', async() => {
			const elem = await fixture(newWindowFixture);
			const description = elem.getNewWindowDescription('My Label');
			expect(description).to.equal('Opens in a new window.');
		});

		it('should return undefined when target is not _blank', async() => {
			const elem = await fixture(emptyFixture);
			const description = elem.getNewWindowDescription('My Label');
			expect(description).to.be.undefined;
		});

		it('should return undefined when label is not provided', async() => {
			const elem = await fixture(newWindowFixture);
			const description = elem.getNewWindowDescription();
			expect(description).to.be.undefined;
		});

	});

	describe('_render parameters', () => {

		it('should apply rel attribute when provided', async() => {
			const tagNameWithRel = defineCE(
				class extends LinkMixin(LitElement) {
					render() {
						return this._render(html`Link Test`, { rel: 'noopener noreferrer' });
					}
				}
			);
			const elem = await fixture(`<${tagNameWithRel}></${tagNameWithRel}>`);
			const anchor = elem.shadowRoot.querySelector('a');
			expect(anchor.getAttribute('rel')).to.equal('noopener noreferrer');
		});

		it('should apply custom link classes', async() => {
			const tagNameWithClasses = defineCE(
				class extends LinkMixin(LitElement) {
					render() {
						return this._render(html`Link Test`, { linkClasses: { 'custom-class': true, 'another-class': true } });
					}
				}
			);
			const elem = await fixture(`<${tagNameWithClasses}></${tagNameWithClasses}>`);
			const anchor = elem.shadowRoot.querySelector('a');
			expect(anchor.classList.contains('custom-class')).to.be.true;
			expect(anchor.classList.contains('another-class')).to.be.true;
		});

		it('should apply custom tabindex', async() => {
			const tagNameWithTabindex = defineCE(
				class extends LinkMixin(LitElement) {
					render() {
						return this._render(html`Link Test`, { tabindex: '-1' });
					}
				}
			);
			const elem = await fixture(`<${tagNameWithTabindex}></${tagNameWithTabindex}>`);
			const anchor = elem.shadowRoot.querySelector('a');
			expect(anchor.getAttribute('tabindex')).to.equal('-1');
		});

		it('should apply ariaLabel when provided', async() => {
			const tagNameWithAriaLabel = defineCE(
				class extends LinkMixin(LitElement) {
					render() {
						return this._render(html`Link Test`, { ariaLabel: 'Custom Label' });
					}
				}
			);
			const elem = await fixture(`<${tagNameWithAriaLabel}></${tagNameWithAriaLabel}>`);
			const anchor = elem.shadowRoot.querySelector('a');
			expect(anchor.getAttribute('aria-label')).to.equal('Custom Label');
		});

	});

});

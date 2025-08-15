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

});

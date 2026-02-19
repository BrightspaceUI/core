import '../button-subtle.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';
import { runButtonPropertyTests } from './button-shared-tests.js';

describe('d2l-button-subtle', () => {

	/*const getFixture = async(props = {}) => {
		const attrs = Object.entries(props).map(([key, value]) => {
			const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
			if (typeof value === 'boolean') {
				return value ? attrName : '';
			}
			return `${attrName}="${value}"`;
		}).filter(Boolean).join(' ');
		return await fixture(staticHtml`<d2l-button-subtle text="Subtle Button" ${unsafeStatic(attrs)}></d2l-button-subtle>`);
	};

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-subtle');
		});

	});

	describe('errors', () => {

		// enable when PropertyRequiredMixin is used
		it.skip('throws error when no text', async() => {
			const el = await fixture(html`<d2l-button-subtle></d2l-button-subtle>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'text'));
		});

	});*/

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
			clickElem(el);
			await oneEvent(el, 'click');
		});

	});

	/*runButtonPropertyTests(getFixture);

	describe('button-subtle specific properties', () => {

		it('should use ariaLabel when provided for aria-label', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" aria-label="Custom Label"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-label')).to.equal('Custom Label');
		});

		it('should not set aria-label when ariaLabel is not provided', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.hasAttribute('aria-label')).to.be.false;
		});

	});*/

});

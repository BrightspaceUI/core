import '../button-add.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';

describe('d2l-button-add', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-add');
		});

	});

	describe('properties', () => {

		it('should default mode to "icon"', async() => {
			const el = await fixture(html`<d2l-button-add text="Add"></d2l-button-add>`);
			expect(el.mode).to.equal('icon');
		});

		it('throws error when no text', async() => {
			const el = await fixture(html`<d2l-button-add></d2l-button-add>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'text'));
		});

		it('does not throw when text is provided', async() => {
			const el = await fixture(html`<d2l-button-add text="Custom Text"></d2l-button-add>`);
			expect(() => el.flushRequiredPropertyErrors()).to.not.throw();
		});

	});

	describe('focus', () => {

		it('should focus on button element', async() => {
			const el = await fixture(html`<d2l-button-add text="Add"></d2l-button-add>`);
			await el.focus();
			const button = el.shadowRoot.querySelector('button');
			expect(el.shadowRoot.activeElement).to.equal(button);
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-add text="Add"></d2l-button-add>`);
			setTimeout(() => clickElem(el));
			await oneEvent(el, 'click');
		});

		it('dispatches click event when press enter', async() => {
			const el = await fixture(html`<d2l-button-add text="Add"></d2l-button-add>`);
			setTimeout(() => sendKeysElem(el, 'press', 'Enter'));
			await oneEvent(el, 'click');
		});

	});

});

import '../button-icon.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';

describe('d2l-button-icon', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-icon');
		});

	});

	describe('errors', () => {

		it('throws error when no icon', async() => {
			const el = await fixture(html`<d2l-button-icon text="Icon Button"></d2l-button-icon>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'icon'));
		});

		it('throws error when no text', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear"></d2l-button-icon>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'text'));
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
			setTimeout(() => el.click());
			await oneEvent(el, 'click');
		});

	});

});

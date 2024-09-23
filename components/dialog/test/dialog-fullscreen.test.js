import '../dialog-fullscreen.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';

describe('d2l-dialog-fullscreen', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-dialog-fullscreen');
		});

	});

	describe('properties', () => {

		it('throws error when no title-text', async() => {
			const el = await fixture(html`<d2l-dialog-fullscreen></d2l-dialog-fullscreen>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'title-text'));
		});

	});

});

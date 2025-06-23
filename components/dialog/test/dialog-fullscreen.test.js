import '../dialog-fullscreen.js';
import { aTimeout, expect, fixture, html, runConstructor, waitUntil } from '@brightspace-ui/testing';
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

	describe('focus management', () => {

		it('should set focusableContentElemPresent to true when there is a focusable element in the dialog added late', async() => {
			const el = await fixture(html`<d2l-dialog-fullscreen opened></d2l-dialog-fullscreen>`);
			expect(el.focusableContentElemPresent).to.be.false;
			await aTimeout(300);
			el.appendChild(document.createElement('button'));
			await waitUntil(() => el.focusableContentElemPresent, 'focusableContentElemPresent never became true');
		});

	});

});

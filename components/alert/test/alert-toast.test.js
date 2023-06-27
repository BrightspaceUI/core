import '../alert-toast.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-alert-toast', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-alert-toast');
		});

	});

	describe('button-press', () => {

		it('should fire "d2l-alert-toast-button-press" event when alert button is pressed', async() => {
			const el = await fixture(html`<d2l-alert-toast button-text="Click Me" open>message</d2l-alert-toast>`);
			const alert = el.shadowRoot.querySelector('d2l-alert');
			setTimeout(() => alert.dispatchEvent(new CustomEvent('d2l-alert-button-press', { bubbles: true, composed: true })));
			await oneEvent(el, 'd2l-alert-toast-button-press');
		});

	});

	describe('close', () => {

		it('should close when close button is clicked', async() => {
			const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
			const alert = el.shadowRoot.querySelector('d2l-alert');
			alert.dispatchEvent(new CustomEvent('d2l-alert-close'));
			await el.updateComplete;
			expect(el.open).to.be.false;
		});

		it('should fire "d2l-alert-toast-close" event when closed', async() => {
			const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
			setTimeout(() => el.open = false);
			await oneEvent(el, 'd2l-alert-toast-close');
			expect(el.open).to.be.false;
		});
	});

});

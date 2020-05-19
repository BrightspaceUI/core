import '../alert-toast.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-alert-toast', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-alert-toast');
		});

	});

	describe('close', () => {
		it('should close when close button is clicked', async() => {
			const el = await fixture(html`<d2l-alert-toast has-close-button open>message</d2l-alert-toast>`);
			const alert = el.shadowRoot.querySelector('d2l-alert');
			alert.dispatchEvent(new CustomEvent('d2l-alert-closed'));
			await el.updateComplete;
			expect(el.open).to.be.false;
		});
	});

});

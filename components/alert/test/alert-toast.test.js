import '../alert-toast.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const toastFixture = html`
		<d2l-alert-toast id="button-close" type="default" button-text="Do it!" has-close-button
			subtext="I am subtext. I'm here to test the wrapping capabilities of adding subtext to these alerts, as well as other styling issues. Feel free to add to me!">
			A message.
		</d2l-alert-toast>`;

describe('d2l-alert-toast', () => {

	let toast;
	beforeEach(async() => {
		toast = await fixture(toastFixture);
	});

	describe('accessibility', () => {

		it('passes aXe tests', async() => {
			toast.open = true;
			await toast.updateComplete;
			await expect(toast).to.be.accessible();
		});

		it('should have status role when open', async() => {
			toast.open = true;
			await toast.updateComplete;
			expect(toast.getAttribute('role')).to.equal('status');
		});

	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-alert-toast');
		});

	});

	describe('close', () => {
		it('should close when close button is clicked', async() => {
			toast.open = true;
			await toast.updateComplete;
			const alert = toast.shadowRoot.querySelector('d2l-alert');
			alert.dispatchEvent(new CustomEvent('d2l-alert-closed'));
			await toast.updateComplete;
			expect(toast.open).to.be.false;
		});
	});

});

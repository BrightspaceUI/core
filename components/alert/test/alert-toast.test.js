import '../alert-toast.js';
import { aTimeout, expect, fixture, html } from '@open-wc/testing';
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

	describe('state', () => {

		it('should start closed', () => {
			expect(toast._state).to.equal('closed');
		});

		it('should transition to preopening then opening when open is set to true', async() => {
			expect(toast._state).to.equal('closed');
			toast.open = true;
			await toast.updateComplete;
			expect(toast._state).to.equal('preopening');
			await aTimeout(75);
			expect(toast._state).to.equal('opening');
		});

		it('should transition from opening to open on animation end', async() => {

			toast._state = 'opening';

			const container = toast.shadowRoot.querySelector('.d2l-alert-toast-container');
			container.dispatchEvent(new Event('transitionend'));
			await toast.updateComplete;

			expect(toast._state).to.equal('open');
		});

		it('should transition from open to closing when open is set to false', async() => {

			toast.open = true;
			toast._state = 'open';
			await toast.updateComplete;

			toast.open = false;
			await toast.updateComplete;
			expect(toast._state).to.equal('closing');
		});

		it('should transition from closing to closed on animation end', async() => {

			toast._state = 'closing';
			const container = toast.shadowRoot.querySelector('.d2l-alert-toast-container');
			container.dispatchEvent(new Event('transitionend'));
			await toast.updateComplete;

			expect(toast._state).to.equal('closed');
		});

		it('should transition from preopening to closed when open is set to false', async() => {

			toast.open = true;
			toast._state = 'preopening';
			await toast.updateComplete;

			toast.open = false;
			await toast.updateComplete;
			expect(toast._state).to.equal('closed');
		});

		it('should transition from opening to closing when open is set to false', async() => {

			toast.open = true;
			toast._state = 'opening';
			await toast.updateComplete;

			toast.open = false;
			await toast.updateComplete;
			expect(toast._state).to.equal('closing');
		});

		it('should transition closing to opening when open is set to true', async() => {

			toast.open = false;
			toast._state = 'closing';
			await toast.updateComplete;

			toast.open = true;
			await toast.updateComplete;
			expect(toast._state).to.equal('opening');
		});
	});

	describe('close', () => {
		it('should close when close button is clicked', async() => {

			toast.open = true;
			toast._state = 'open';
			await toast.updateComplete;

			const container = toast.shadowRoot.querySelector('.d2l-alert-toast');
			container.dispatchEvent(new CustomEvent('d2l-alert-closed'));
			await toast.updateComplete;
			expect(toast.open).to.be.false;
		});
	});

});

import '../alert.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const alertFixture = html`
		<d2l-alert id="button-close" type="default" button-text="Do it!" has-close-button
			subtext="I am subtext. I'm here to test the wrapping capabilities of adding subtext to these alerts, as well as other styling issues. Feel free to add to me!">
			A message.
		</d2l-alert>`;

describe('d2l-alert', () => {

	let alert;
	beforeEach(async() => {
		alert = await fixture(alertFixture);
	});

	describe('accessibility', () => {

		[
			'default',
			'warning',
			'critical',
			'success',
			'call-to-action',
			'error'
		].forEach((type) => {
			it(`passes aXe tests for type "${type}"`, async() => {
				alert.type = type;
				await alert.updateComplete;
				await expect(alert).to.be.accessible();
			});
		});

	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-alert');
		});

	});

	describe('events', () => {

		it('should fire "d2l-alert-closed" event when close button is clicked', async() => {
			const closeButton = alert.shadowRoot.querySelector('d2l-button-icon.d2l-alert-action');
			setTimeout(() => closeButton.click());
			await oneEvent(alert, 'd2l-alert-closed');
			expect(alert.hasAttribute('hidden')).to.be.true;
		});

		it('should fire "d2l-alert-closed" event when close is called', async() => {
			setTimeout(() => alert.close());
			await oneEvent(alert, 'd2l-alert-closed');
			expect(alert.hasAttribute('hidden')).to.be.true;
		});

		it('should fire "d2l-alert-button-pressed" event when action button is clicked', async() => {
			const actionButton = alert.shadowRoot.querySelector('d2l-button-subtle.d2l-alert-action');
			setTimeout(() => actionButton.click());
			await oneEvent(alert, 'd2l-alert-button-pressed');
		});

	});

});

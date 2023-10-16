import '../alert.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

const alertFixture = html`
		<d2l-alert id="button-close" type="default" button-text="Do it!" has-close-button
			subtext="I am subtext. I'm here to test the wrapping capabilities of adding subtext to these alerts, as well as other styling issues. Feel free to add to me!">
			A message.
		</d2l-alert>`;

describe('d2l-alert', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-alert');
		});

	});

	describe('events', () => {

		it('should fire "d2l-alert-close" event when close button is clicked', async() => {
			const alert = await fixture(alertFixture);
			const closeButton = alert.shadowRoot.querySelector('d2l-button-icon');
			setTimeout(() => closeButton.click());
			await oneEvent(alert, 'd2l-alert-close');
			expect(alert.hasAttribute('hidden')).to.be.true;
		});

		it('should fire "d2l-alert-close" event when close is called', async() => {
			const alert = await fixture(alertFixture);
			setTimeout(() => alert.close());
			await oneEvent(alert, 'd2l-alert-close');
			expect(alert.hasAttribute('hidden')).to.be.true;
		});

		it('should fire "d2l-alert-close" event when close button is clicked', async() => {
			const alert = await fixture(alertFixture);
			const closeButton = alert.shadowRoot.querySelector('d2l-button-icon');
			setTimeout(() => closeButton.click());
			await oneEvent(alert, 'd2l-alert-close');
			expect(alert.hasAttribute('hidden')).to.be.true;
		});

		it('should fire "d2l-alert-close" event when close is called', async() => {
			const alert = await fixture(alertFixture);
			setTimeout(() => alert.close());
			await oneEvent(alert, 'd2l-alert-close');
			expect(alert.hasAttribute('hidden')).to.be.true;
		});

		it('should fire "d2l-alert-button-press" event when action button is clicked', async() => {
			const alert = await fixture(alertFixture);
			const actionButton = alert.shadowRoot.querySelector('d2l-button-subtle');
			setTimeout(() => actionButton.click());
			await oneEvent(alert, 'd2l-alert-button-press');
		});

		it('calling preventDefault on close action should prevent alert from closing', async() => {
			const alert = await fixture(alertFixture);
			const closeButton = alert.shadowRoot.querySelector('d2l-button-icon');
			setTimeout(() => closeButton.click());
			alert.addEventListener('d2l-alert-close', (e) => {
				e.preventDefault();
			});
			expect(alert.hasAttribute('hidden')).to.be.false;
		});

	});

});

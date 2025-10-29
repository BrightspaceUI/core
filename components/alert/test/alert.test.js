import '../alert.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

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
			alert.addEventListener('d2l-alert-close', (e) => {
				e.preventDefault();
			});
			clickElem(alert.shadowRoot.querySelector('d2l-button-icon'));
			await oneEvent(alert, 'd2l-alert-close');
			expect(alert.hasAttribute('hidden')).to.be.false;
		});

		it('close event bubbles when multiple alerts present and only target hides', async() => {
			const multi = await fixture(html`<div>
				<d2l-alert id="a1" type="default" has-close-button>First</d2l-alert>
				<d2l-alert id="a2" type="default" has-close-button>Second</d2l-alert>
			</div>`);
			const a1 = multi.querySelector('#a1');
			const a2 = multi.querySelector('#a2');
			const closeBtn = a2.shadowRoot.querySelector('d2l-button-icon');
			setTimeout(() => closeBtn.click());
			const details = await oneEvent(a2, 'd2l-alert-close');
			expect(details.target).to.equal(a2);
			expect(a2.hasAttribute('hidden')).to.be.true;
			expect(a1.hasAttribute('hidden')).to.be.false;
		});

	});

});

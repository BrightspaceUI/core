import '../alert-toast.js';
import { expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';
import sinon from 'sinon';

const alertWithSubtextAndCloseButton = html`
	<d2l-alert-toast id="alert-top" no-auto-close type="critical" button-text="Do it!" open
		subtext="I am subtext. I'm here to test the wrapping capabilities of adding subtext to these alerts, as well as other styling issues. Feel free to add to me!">
		A message.
	</d2l-alert-toast>
`;

const multipleAlerts = html`
	<div>
		<d2l-alert-toast no-auto-close type="default" id="alert-middle">A default message.</d2l-alert-toast>
		${alertWithSubtextAndCloseButton}
		<d2l-alert-toast no-auto-close type="success" hide-close-button id="alert-bottom">A message.</d2l-alert-toast>
	</div>
`;

const multipleAlertsAutoClose = html`
<div>
	<d2l-alert-toast type="default" id="alert-middle">A default message.</d2l-alert-toast>
	<d2l-alert-toast type="success" hide-close-button id="alert-bottom">A message.</d2l-alert-toast>
	<div id="other"></div>
</div>
`;

const viewport = { width: 700, height: 400 };

describe('alert-toast', () => {

	[
		{ name: 'default', template: html`<d2l-alert-toast no-auto-close type="default" open>A default message.</d2l-alert-toast>` },
		{ name: 'no-close', template: html`<d2l-alert-toast no-auto-close type="success" hide-close-button open>A message.</d2l-alert-toast>` },
		{ name: 'button-close', template: html`<d2l-alert-toast no-auto-close type="warning" button-text="Do it!" open>A message.</d2l-alert-toast>` },
		{ name: 'subtext-button-close', template: alertWithSubtextAndCloseButton }
	].forEach(({ name, template }) => {
		it(name, async() => {
			await fixture(template, { viewport: { width: 700, height: 200 } });
			await expect(document).to.be.golden();
		});
	});

	describe('responsive-position', () => {
		it('wide', async() => {
			await fixture(alertWithSubtextAndCloseButton, { viewport });
			await expect(document).to.be.golden();
		});

		it('narrow', async() => {
			await fixture(alertWithSubtextAndCloseButton, { viewport: { width: 400, height: 400 } });
			await expect(document).to.be.golden();
		});
	});

	describe('multiple-alerts', () => {

		async function openAlerts(elem) {
			const alert1 = elem.querySelector('#alert-middle');
			const alert3 = elem.querySelector('#alert-bottom');
			alert1.open = true;
			await oneEvent(alert1, 'd2l-alert-toast-resize');
			alert3.open = true;
			await oneEvent(alert3, 'd2l-alert-toast-resize');
		}

		it('open all', async() => {
			const elem = await fixture(multipleAlerts, { viewport });
			await openAlerts(elem);
			await expect(document).to.be.golden();
		});

		['top', 'middle', 'bottom'].forEach(position => {
			it(`open all then close ${position}`, async() => {
				const elem = await fixture(multipleAlerts, { viewport: { width: 700, height: 300 } });
				await openAlerts(elem);
				const alert = elem.querySelector(`#alert-${position}`);
				alert.open = false;
				await oneEvent(alert, 'd2l-alert-toast-close');
				await expect(document).to.be.golden();
			});
		});

		it('narrow', async() => {
			const elem = await fixture(multipleAlerts, { viewport: { width: 400, height: 400 } });
			await openAlerts(elem);
			await expect(document).to.be.golden();
		});

		/**
		 * TODO: switch to more legitimate form of resizing once available
		 */
		it('resize smaller', async() => {
			const elem = await fixture(multipleAlerts, { viewport });
			await openAlerts(elem);
			await fixture(html``, { viewport: { width: 300 } });
			await expect(document).to.be.golden();
		});

		/**
		 * TODO: switch to more legitimate form of resizing once available
		 */
		it('resize larger', async() => {
			const elem = await fixture(multipleAlerts, { viewport: { width: 300, height: 400 } });
			await openAlerts(elem);
			await fixture(html``, { viewport: { width: 700 } });
			await expect(document).to.be.golden();
		});

		describe('hover and focus', () => {

			async function focusAlert(elem) {
				const firstAlertButton = elem.querySelector('d2l-alert-toast').shadowRoot.querySelector('d2l-alert').shadowRoot.querySelector('d2l-button-icon');
				await focusElem(firstAlertButton);
			}

			async function hoverAlert(elem) {
				const firstAlert = elem.querySelectorAll('d2l-alert-toast')[1].shadowRoot.querySelector('d2l-alert');
				await hoverElem(firstAlert);
			}

			async function hoverOtherElem(elem) {
				const otherElem = elem.querySelector('div#other');
				await hoverElem(otherElem);
			}

			let clock;

			beforeEach(() => {
				clock = sinon.useFakeTimers({ toFake: ['clearTimeout', 'setTimeout'] });
			});
			afterEach(() => {
				clock.restore();
			});

			it('hover then wait', async() => {
				const elem = await fixture(multipleAlertsAutoClose, { viewport });
				await openAlerts(elem);
				await hoverAlert(elem);
				clock.tick(4100);
				await expect(document).to.be.golden();
			});

			it('hover then remove hover', async() => {
				const elem = await fixture(multipleAlertsAutoClose, { viewport });
				await openAlerts(elem);
				await hoverAlert(elem);
				await hoverOtherElem(elem);
				clock.tick(4100);
				await expect(document).to.be.golden();
			});

			it('focus then wait', async() => {
				const elem = await fixture(multipleAlertsAutoClose, { viewport });
				await openAlerts(elem);
				await focusAlert(elem);
				clock.tick(4100);
				await expect(document).to.be.golden();
			});

			it('hover then focus then remove hover then wait', async() => {
				const elem = await fixture(multipleAlertsAutoClose, { viewport });
				await openAlerts(elem);
				await hoverAlert(elem);
				await focusAlert(elem);
				await hoverOtherElem(elem);
				clock.tick(4100);
				await expect(document).to.be.golden();
			});

			it('open quickly then wait', async() => {
				const elem = await fixture(multipleAlertsAutoClose, { viewport });
				elem.querySelector('d2l-alert-toast')._setReduceMotion(false);
				await openAlerts(elem);
				clock.tick(4100);
				await expect(document).to.be.golden();
				elem.querySelector('d2l-alert-toast')._setReduceMotion(true);
			});

		});

	});
});

import '../alert-toast.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

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
			await fixture(alertWithSubtextAndCloseButton, { viewport: { width: 700, height: 400 } });
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
			await alert1.updateComplete;
			alert3.open = true;
			await alert3.updateComplete;
		}

		it('open all', async() => {
			const elem = await fixture(multipleAlerts, { viewport: { width: 700, height: 400 } });
			await openAlerts(elem);
			await expect(document).to.be.golden();
		});

		it('open all then close top', async() => {
			const elem = await fixture(multipleAlerts, { viewport: { width: 700, height: 200 } });
			await openAlerts(elem);
			const alert = elem.querySelector('#alert-top');
			alert.open = false;
			await alert.updateComplete;
			await expect(document).to.be.golden();
		});

		it('open all then close middle', async() => {
			const elem = await fixture(multipleAlerts, { viewport: { width: 700, height: 300 } });
			await openAlerts(elem);
			const alert = elem.querySelector('#alert-middle');
			alert.open = false;
			await alert.updateComplete;
			await expect(document).to.be.golden();
		});

		it('open all then close bottom', async() => {
			const elem = await fixture(multipleAlerts, { viewport: { width: 700, height: 300 } });
			await openAlerts(elem);
			const alert = elem.querySelector('#alert-bottom');
			alert.open = false;
			await alert.updateComplete;
			await expect(document).to.be.golden();
		});

		it('narrow', async() => {
			const elem = await fixture(multipleAlerts, { viewport: { width: 400, height: 400 } });
			await openAlerts(elem);
			await expect(document).to.be.golden();
		});

		it.skip('resize', async() => {

		});
	});
});

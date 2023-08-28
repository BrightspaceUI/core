import '../alert-toast.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const alertWithSubtextAndCloseButton = html`
	<d2l-alert-toast no-auto-close type="critical" button-text="Do it!" open
		subtext="I am subtext. I'm here to test the wrapping capabilities of adding subtext to these alerts, as well as other styling issues. Feel free to add to me!">
		A message.
	</d2l-alert-toast>
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
});

import '../alert.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

function createAlertWithCloseButton(opts) {
	const { noPadding } =  { noPadding: false, ...opts };
	return html`
		<d2l-alert type="default" button-text="Do it!" has-close-button ?no-padding="${noPadding}"
			subtext="I am subtext. I'm here to test the wrapping capabilities of adding subtext to these alerts, as well as other styling issues. Feel free to add to me!">
			A message.
		</d2l-alert>
	`;
}

describe('alert', () => {

	[ 'default', 'success', 'critical', 'warning', 'error', 'call-to-action'].forEach(type => {
		it(`type-${type}`, async() => {
			const elem = await fixture(html`
				<d2l-alert type="${type}">${`A${type === 'error' ? 'n' : ''} ${type === 'call-to-action' ? 'call to action.' : `${type} message.`}`}</d2l-alert>
			`);
			await expect(elem).to.be.golden();
		});
	});

	[
		{ name: 'close', template: html`<d2l-alert type="default" has-close-button>A message.</d2l-alert>` },
		{ name: 'button', template: html`<d2l-alert type="default" button-text="Do it!">A message.</d2l-alert>` },
		{ name: 'button-close', template: createAlertWithCloseButton() },
		{ name: 'rtl', rtl: true, template: createAlertWithCloseButton() },
		{ name: 'hidden', rtl: true, template: html`<div style="height: 10px; width: 10px;"><d2l-alert type="default" hidden>A hidden message.</d2l-alert></div>` },
		{ name: 'no-padding', template: createAlertWithCloseButton({ noPadding: true }) },
		{ name: 'no-padding-rtl', rtl: true, template: createAlertWithCloseButton({ noPadding: true }) }
	].forEach(({ name, template, rtl }) => {
		it(name, async() => {
			const elem = await fixture(template, { rtl });
			await expect(elem).to.be.golden();
		});
	});

	it('narrow', async() => {
		const elem = await fixture(createAlertWithCloseButton(), { viewport: { width: 600 } });
		await expect(elem).to.be.golden();
	});
});

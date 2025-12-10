import '../count-badge.js';
import { expect, fixture, focusElem, html, oneEvent } from '@brightspace-ui/testing';

describe('count-badge', () => {
	[
		{ name: 'small-notification', template: html`<d2l-count-badge size="small" type="notification" number="1"></d2l-count-badge>` },
		{ name: 'small-notification-focused', template: html`<d2l-count-badge tab-stop size="small" type="notification" number="1"></d2l-count-badge>`, action: elem => focusElem(elem) },
		{ name: 'small-notification-truncated', template: html`<d2l-count-badge size="small" type="notification" number="100"></d2l-count-badge>` },
		{ name: 'small-notification-truncated-rtl', rtl: true, template: html`<d2l-count-badge size="small" type="notification" number="100"></d2l-count-badge>` },
		{ name: 'small-notification', template: html`<d2l-count-badge size="small" type="notification" number="1"></d2l-count-badge>` },
		{ name: 'large-count', template: html`<d2l-count-badge size="large" type="count" number="1"></d2l-count-badge>` },
		{ name: 'large-count-focused', template: html`<d2l-count-badge tab-stop size="large" type="count" number="1"></d2l-count-badge>`, action: elem => focusElem(elem) },
		{ name: 'large-count-large-number', template: html`<d2l-count-badge size="large" type="count" number="100000"></d2l-count-badge>` },
		{ name: 'large-count-large-number-rtl', rtl: true, template: html`<d2l-count-badge size="large" type="count" number="100000"></d2l-count-badge>` },
		{ name: 'large-count-colorway-override', template: html`<d2l-count-badge style="--d2l-count-badge-foreground-color: #ffffff; --d2l-count-badge-background-color: purple;" size="large" type="count" number="10"></d2l-count-badge>` },
		{ name: 'hide-zero-nonzero-shown', template: html`<d2l-count-badge number="10" hide-zero></d2l-count-badge>` },
		{ name: 'hide-zero-hidden', template: html`<d2l-count-badge number="0" hide-zero></d2l-count-badge>` },
		{ name: 'no-hide-zero', template: html`<d2l-count-badge number="0"></d2l-count-badge>` },
		{ name: 'skeleton', template: html`<d2l-count-badge has-tooltip number="10" text="10 new notifications" skeleton></d2l-count-badge>` },
		{ name: 'max-digits-3', template: html`<d2l-count-badge max-digits="3" number="5000" text="5000 items"></d2l-count-badge>` },
		{ name: 'max-digits-4', template: html`<d2l-count-badge max-digits="4" number="50000" text="50000 items"></d2l-count-badge>` },
		{ name: 'small-count', template: html`<d2l-count-badge size="small" type="count" number="42"></d2l-count-badge>` },
		{ name: 'large-notification', template: html`<d2l-count-badge size="large" type="notification" number="5"></d2l-count-badge>` },
		{ name: 'not-tabbable-by-default', template: html`<d2l-count-badge number="5" text="5 items"></d2l-count-badge>`, action: elem => focusElem(elem) },
		{ name: 'not-tabbable-hide-zero-with-zero', template: html`<d2l-count-badge tab-stop hide-zero number="0" text="0 items"></d2l-count-badge>`, action: elem => focusElem(elem) },
		{ name: 'not-tabbable-skeleton', template: html`<d2l-count-badge tab-stop skeleton number="5" text="5 items"></d2l-count-badge>`, action: elem => focusElem(elem) },
		{ name: 'no-tooltip-when-skeleton', template: html`<d2l-count-badge has-tooltip skeleton number="5" text="5 items"></d2l-count-badge>` }
	].forEach(({ name, template, rtl, action }) => {
		it(name, async() => {
			const elem = await fixture(template, { rtl });
			if (action) await action(elem);
			await expect(elem).to.be.golden();
		});
	});

	describe('tooltip', () => {
		const template = html`<d2l-count-badge has-tooltip number="10" text="10 new notifications"></d2l-count-badge>`;

		it('does not appear by default', async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});

		it('appears on focus-visible', async() => {
			const elem = await fixture(template);
			focusElem(elem);
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});

	});
});

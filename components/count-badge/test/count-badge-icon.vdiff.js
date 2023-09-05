import '../count-badge-icon.js';
import { expect, fixture, focusElem, html, oneEvent } from '@brightspace-ui/testing';

describe('count-badge-icon', () => {
	it('icon-skeleton', async() => {
		const elem = await fixture(html`<d2l-count-badge-icon has-tooltip skeleton icon="tier3:gear" number="100"></d2l-count-badge-icon>`);
		await expect(elem).to.be.golden();
	});

	[true, false].forEach(rtl => {
		[
			{ name: 'small-notification-icon-focused', template: html`<d2l-count-badge-icon tab-stop icon="tier3:gear" number="100" type="notification"></d2l-count-badge-icon>`, action: elem => focusElem(elem) },
			{ name: 'large-count-icon', template: html`<d2l-count-badge-icon icon="tier3:gear" size="large" type="count" number="1"></d2l-count-badge-icon>` },
			{ name: 'large-number-centered', template: html`<d2l-count-badge-icon icon="tier3:gear" size="large" type="count" number="100000"></d2l-count-badge-icon>` },
		].forEach(({ name, template, action }) => {
			it(`${name}${rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(template, { rtl });
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('icon and tooltip', () => {
		const template = html`<d2l-count-badge-icon has-tooltip icon="tier3:gear" number="10" text="10 new notifications"></d2l-count-badge-icon>`;

		it('tooltip does not appear by default', async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
		it('tooltip appears on focus-visible', async() => {
			const elem = await fixture(template);
			await focusElem(elem);
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});
	});
});

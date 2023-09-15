import '../../colors/colors.js';
import '../icon.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-icon', () => {

	['tier1', 'tier2', 'tier3'].forEach((tier) => {
		const template = html`<d2l-icon icon="${tier}:assignments"></d2l-icon>`;
		it(tier, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
		it(`rtl-${tier}`, async() => {
			const elem = await fixture(template, { rtl: true });
			await expect(elem).to.be.golden();
		});
	});

	[
		{
			name: 'prefixed',
			template: html`<d2l-icon icon="d2l-tier3:assignments"></d2l-icon>`
		},
		{
			name: 'fill-none',
			template: html`<d2l-icon icon="tier2:evaluate-all"></d2l-icon>`
		},
		{
			name: 'fill-circle',
			template: html`<d2l-icon icon="tier2:divider-big"></d2l-icon>`
		},
		{
			name: 'fill-mixed',
			template: html`<d2l-icon icon="tier2:check-box" style="color: var(--d2l-color-celestine-minus-1)"></d2l-icon>`
		},
		{
			name: 'color-override',
			template: html`<d2l-icon icon="tier3:assignments" style="color: var(--d2l-color-celestine-minus-1)"></d2l-icon>`
		},
		{
			name: 'size-override',
			template: html`<d2l-icon icon="tier3:assignments" style="height: 100px; width: 100px;"></d2l-icon>`
		}
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
	});

});

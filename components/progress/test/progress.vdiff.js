import '../progress.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-progress', () => {
	[true, false].forEach(rtl => {

		['small', 'medium', 'large'].forEach(size => {
			it(`${size}${rtl ? '-rtl' : ''}`, async() => {
				const ele = await fixture(html`<div>
					<d2l-progress label="No Progress" value="0" max="10" size="${size}"></d2l-progress>
					<d2l-progress label="Progress" value="8" max="10" size="${size}"></d2l-progress>
					<d2l-progress label="Complete" value="10" max="10" size="${size}"></d2l-progress>
				</div>`, { rtl });

				await expect(ele).to.be.golden({ allColorModes: !rtl && size === 'medium' });
			});
		});

		it(`hidden states${rtl ? '-rtl' : ''}`, async() => {
			const ele = await fixture(html`<div>
				<d2l-progress label="Progress" value="0" label-hidden></d2l-progress>
				<br>
				<d2l-progress label="Progress" value="0" value-hidden></d2l-progress>
				<br>
				<d2l-progress label="Progress" value="0" label-hidden value-hidden></d2l-progress>
			</div>`, { rtl });

			await expect(ele).to.be.golden();
		});
	});

	it('indeterminate', async() => {
		const ele = await fixture(html`<d2l-progress label="Indeterminate Progress"></d2l-progress>`);
		await expect(ele).to.be.golden({ allColorModes: true });
	});
});

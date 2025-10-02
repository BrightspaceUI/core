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

				await expect(ele).to.be.golden();
			});
		});

		it(`hidden states${rtl ? '-rtl' : ''}`, async() => {
			const ele = await fixture(html`<div>
				<d2l-progress label="Progress" label-hidden></d2l-progress>
				<br>
				<d2l-progress label="Progress" value-hidden></d2l-progress>
				<br>
				<d2l-progress label="Progress" label-hidden value-hidden></d2l-progress>
			</div>`, { rtl });

			await expect(ele).to.be.golden();
		});
	});
});

import '../../colors/colors.js';
import '../meter-circle.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('meter-circle', () => {
	[true, false].forEach(rtl => {
		[
			{ name: 'progress', template: html`<d2l-meter-circle value="16" max="47"></d2l-meter-circle>` },
			{ name: 'percent', template: html`<d2l-meter-circle value="16" max="47" percent></d2l-meter-circle>` }
		].forEach(({ name, template }) => {
			it(`${name}${ rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(template, { rtl });
				await expect(elem).to.be.golden();
			});
		});
	});

	[
		{ name: 'no-progress', template: html`<d2l-meter-circle value="0" max="10"></d2l-meter-circle>` },
		{ name: 'complete', template: html`<d2l-meter-circle value="5" max="5"></d2l-meter-circle>` },
		{ name: 'round-to-zero', template: html`<d2l-meter-circle value="0.004" max="100"></d2l-meter-circle>` },
		{ name: 'max-zero-with-value', template: html`<d2l-meter-circle value="10" max="0"></d2l-meter-circle>` },
		{ name: 'foreground-light', wrapped: true, template: html`
			<div style="background-color: var(--d2l-color-celestine); padding: 1rem;">
				<d2l-meter-circle value="16" max="47" foreground-light></d2l-meter-circle>
			</div>
		` },
		{ name: 'scaled-larger', wrapped: true, template: html`
			<div style="width: 90px;">
				<d2l-meter-circle value="16" max="47" style="width: 300%;"></d2l-meter-circle>
			</div>
		` },
		{ name: 'scaled-smaller', wrapped: true, template: html`
			<div style="width: 100px;">
				<d2l-meter-circle value="16" max="47" style="width: 30%;"></d2l-meter-circle>
			</div>
		` }
	].forEach(({ name, template, wrapped }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(!wrapped ? elem : elem.querySelector('d2l-meter-circle')).to.be.golden();
		});
	});
});

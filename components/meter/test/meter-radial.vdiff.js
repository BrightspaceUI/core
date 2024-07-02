import '../../colors/colors.js';
import '../meter-radial.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('meter-radial', () => {
	[true, false].forEach(rtl => {
		[
			{ name: 'progress', template: html`<d2l-meter-radial value="16" max="47"></d2l-meter-radial>` },
			{ name: 'percent', template: html`<d2l-meter-radial value="16" max="47" percent></d2l-meter-radial>` },
			{ name: 'text', template: html`<d2l-meter-radial value="10" max="10" percent text="Completed"></d2l-meter-radial>` },
		].forEach(({ name, template }) => {
			it(`${name}${ rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(template, { rtl });
				await expect(elem).to.be.golden();
			});
		});
	});

	[
		{ name: 'no-progress', template: html`<d2l-meter-radial value="0" max="10"></d2l-meter-radial>` },
		{ name: 'complete', template: html`<d2l-meter-radial value="256" max="256"></d2l-meter-radial>` },
		{ name: 'text', template: html`<d2l-meter-radial value="256" max="256" text="Completed"></d2l-meter-radial>` },
		{ name: 'text', template: html`<d2l-meter-radial value="256" max="256" text="Completed" text-hidden></d2l-meter-radial>` },
		{ name: 'round-to-zero', template: html`<d2l-meter-radial value="0.004" max="100" percent></d2l-meter-radial>` },
		{ name: 'max-zero-with-value', template: html`<d2l-meter-radial value="10" max="0"></d2l-meter-radial>` },
		{ name: 'foreground-light', wrapped: true, template: html`
			<div style="background-color: var(--d2l-color-celestine); padding: 1rem;">
				<d2l-meter-radial value="16" max="47" foreground-light text="Keep going!"></d2l-meter-radial>
			</div>
		` },
		{ name: 'scaled-larger', wrapped: true, template: html`
			<div style="width: 90px;">
				<d2l-meter-radial value="16" max="47" text="Keep going!" style="width: 300%;"></d2l-meter-radial>
			</div>
		` },
		{ name: 'scaled-smaller', wrapped: true, template: html`
			<div style="width: 90px;">
				<d2l-meter-radial value="16" max="47" style="width: 30%;"></d2l-meter-radial>
			</div>
		` }
	].forEach(({ name, template, wrapped }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(!wrapped ? elem : elem.querySelector('d2l-meter-radial')).to.be.golden();
		});
	});
});

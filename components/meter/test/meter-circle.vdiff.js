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
});

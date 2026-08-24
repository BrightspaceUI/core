import '../demo/offscreen-demo.js';
import '../offscreen.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('offscreen', () => {

	[true, false].forEach(rtl => {
		[
			{ name: 'wc', template: html`<d2l-offscreen>This message will only be visible to assistive technology, such as a screen reader.</d2l-offscreen>` },
			{ name: 'style', template: html`<d2l-offscreen-demo></d2l-offscreen-demo>` },
			{ name: 'ltr-container', template: html`<span dir="ltr"><d2l-offscreen-demo></d2l-offscreen-demo></span>` },
		].forEach(({ name, template }) => {
			it(`${name}${rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(html`<div><p>Offscreen text:</p>${template}</div>`, { rtl });
				await expect(elem).to.be.golden();
			});
		});
	});
});

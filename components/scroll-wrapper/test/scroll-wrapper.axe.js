
import '../scroll-wrapper.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-scroll-wrapper', () => {

	it('smaller', async() => {
		const elem = await fixture(html`<d2l-scroll-wrapper><div style="width: 200px;"></div></d2l-scroll-wrapper>`);
		await expect(elem).to.be.accessible();
	});

	it('overflow', async() => {
		const elem = await fixture(html`<d2l-scroll-wrapper><div style="width: 400px;"></div></d2l-scroll-wrapper>`);
		await expect(elem).to.be.accessible();
	});

	it('overflow-hide-actions', async() => {
		const elem = await fixture(html`<d2l-scroll-wrapper hide-actions><div style="width: 400px;"></div></d2l-scroll-wrapper>`);
		await expect(elem).to.be.accessible();
	});

});

import '../list-item-placement-marker.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-list-item-placement-marker', () => {
	it('visible', async() => {
		const element = await fixture(html`<d2l-list-item-placement-marker aria-label='drag placement'></d2l-list-item-placement-marker>`);
		await expect(element).to.be.accessible();
	});
});

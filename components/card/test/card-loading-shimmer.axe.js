import '../card-loading-shimmer.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-card-loading-shimmer', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-card-loading-shimmer>Content</d2l-card-loading-shimmer>`);
		await expect(elem).to.be.accessible();
	});

	it('loading', async() => {
		const elem = await fixture(html`<d2l-card-loading-shimmer loading>Content</d2l-card-loading-shimmer>`);
		await expect(elem).to.be.accessible();
	});

});

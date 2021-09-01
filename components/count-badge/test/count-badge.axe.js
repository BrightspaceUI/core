import '../count-badge.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-count-badge', () => {
	it('default', async() => {
		const elem = await fixture(html`<d2l-count-badge>5</d2l-count-badge>`);
		await expect(elem).to.be.accessible();
	});
});

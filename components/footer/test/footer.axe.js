import '../footer.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-footer', () => {

	it('passes aXe tests for default case', async() => {
		const el = await fixture(html`<d2l-footer></d2l-footer>`);
		await expect(el).to.be.accessible();
	});

	it('passes aXe tests when background color', async() => {
		const el = await fixture(html`<d2l-footer color></d2l-footer>`);
		await expect(el).to.be.accessible();
	});

});

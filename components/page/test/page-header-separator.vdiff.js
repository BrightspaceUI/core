import '../page-header-separator.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-page-header-separator', () => {

	it('separator', async() => {
		const elem = await fixture(html`<d2l-page-header-separator></d2l-page-header-separator>`);
		await expect(elem).to.be.golden();
	});

});

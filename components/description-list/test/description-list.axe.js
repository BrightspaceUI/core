import '../demo/description-list-test.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-d2l-wrapper', () => {

	it('should pass all aXe tests', async() => {
		const elem = await fixture(html`<d2l-test-dl></d2l-test-dl>`);
		await expect(elem).to.be.accessible();
	});

});

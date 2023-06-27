import '../card-content-meta.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-card-content-meta', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-card-content-meta>Meta</d2l-card-content-meta>`);
		await expect(elem).to.be.accessible();
	});

});

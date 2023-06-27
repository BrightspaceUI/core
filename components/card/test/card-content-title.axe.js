import '../card-content-title.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-card-content-title', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-card-content-title>Title</d2l-card-content-title>`);
		await expect(elem).to.be.accessible;
	});

});

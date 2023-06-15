import '../demo/description-list-test.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-d2l-wrapper', () => {

	it('is accessible with default content', async() => {
		const elem = await fixture(html`<d2l-test-dl></d2l-test-dl>`);
		await expect(elem).to.be.accessible();
	});

	it('is accessible with long content', async() => {
		const elem = await fixture(html`<d2l-test-dl type="long"></d2l-test-dl>`);
		await expect(elem).to.be.accessible();
	});

	it('is accessible with slotted content', async() => {
		const elem = await fixture(html`<d2l-test-dl type="slotted"></d2l-test-dl>`);
		await expect(elem).to.be.accessible();
	});

});

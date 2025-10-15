import '../button-copy.js';
import { expect, focusElem, fixture, html } from '@brightspace-ui/testing';

describe('d2l-button-copy', () => {

	it('normal', async() => {
		const el = await fixture(html`<d2l-button-copy></d2l-button-copy>`);
		await expect(el).to.be.accessible();
	});

	it('disabled', async() => {
		const el = await fixture(html`<d2l-button-copy disabled></d2l-button-copy>`);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(html`<d2l-button-copy></d2l-button-copy>`);
		await focusElem(el);
		await expect(el).to.be.accessible();
	});

});

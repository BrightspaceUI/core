import '../button-add.js';
import { expect, fixture, focusElem, html, oneEvent } from '@brightspace-ui/testing';

describe('d2l-button-add', () => {

	it('default', async() => {
		const el = await fixture(html`<d2l-button-add></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('text', async() => {
		const el = await fixture(html`<d2l-button-add text="Custom Text"></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('visible text', async() => {
		const el = await fixture(html`<d2l-button-add text-visible></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(html`<d2l-button-add></d2l-button-add>`);
		await focusElem(el);
		await expect(el).to.be.accessible();
	});

	it('focused, visible text', async() => {
		const el = await fixture(html`<d2l-button-add text-visible></d2l-button-add>`);
		await focusElem(el);
		await expect(el).to.be.accessible();
	});

});

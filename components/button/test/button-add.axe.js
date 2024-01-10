import '../button-add.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

describe('d2l-button-add', () => {

	it('default', async() => {
		const el = await fixture(html`<d2l-button-add></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('text', async() => {
		const el = await fixture(html`<d2l-button-add text="Custom Text"></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('icon-and-text mode', async() => {
		const el = await fixture(html`<d2l-button-add mode="icon-and-text"></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('icon-when-interacted mode', async() => {
		const el = await fixture(html`<d2l-button-add mode="icon-when-interacted"></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(html`<d2l-button-add></d2l-button-add>`);
		await focusElem(el);
		await expect(el).to.be.accessible();
	});

	it('focused, icon-and-text mode', async() => {
		const el = await fixture(html`<d2l-button-add mode="icon-and-text"></d2l-button-add>`);
		await focusElem(el);
		await expect(el).to.be.accessible();
	});
	it('focused, icon-when-interacted mode', async() => {
		const el = await fixture(html`<d2l-button-add mode="icon-when-interacted"></d2l-button-add>`);
		await focusElem(el);
		await expect(el).to.be.accessible();
	});

});

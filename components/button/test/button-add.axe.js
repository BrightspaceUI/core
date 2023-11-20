import '../button-add.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

describe('d2l-button-add', () => {

	it('default', async() => {
		const el = await fixture(html`<d2l-button-add></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('label', async() => {
		const el = await fixture(html`<d2l-button-add label="Custom Label"></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('text', async() => {
		const el = await fixture(html`<d2l-button-add text="Custom Text"></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('visible text', async() => {
		const el = await fixture(html`<d2l-button-add visible-text></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(html`<d2l-button-add></d2l-button-add>`);
		setTimeout(() => el.focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

	it('focused, visible text', async() => {
		const el = await fixture(html`<d2l-button-add visible-text></d2l-button-add>`);
		setTimeout(() => el.focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

});

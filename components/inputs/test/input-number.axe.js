import '../input-number.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-input-number', () => {
	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-number label="label"></d2l-input-number>`);
		await expect(elem).to.be.accessible();
	});

	it('default value', async() => {
		const elem = await fixture(html`<d2l-input-number label="label" value="10"></d2l-input-number>`);
		await expect(elem).to.be.accessible();
	});

	it('required', async() => {
		const elem = await fixture(html`<d2l-input-number label="label" required></d2l-input-number>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-number label="label" disabled></d2l-input-number>`);
		await expect(elem).to.be.accessible();
	});

	it('placeholder', async() => {
		const elem = await fixture(html`<d2l-input-number label="label" placeholder="placeholder"></d2l-input-number>`);
		await expect(elem).to.be.accessible();
	});

	it('hidden label', async() => {
		const elem = await fixture(html`<d2l-input-number label="label" label-hidden></d2l-input-number>`);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-number label="label"></d2l-input-number>`);
		elem.focus();
		await expect(elem).to.be.accessible();
	});
});

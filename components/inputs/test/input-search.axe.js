import '../input-search.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-input-search', () => {

	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-search label="search"></d2l-input-search>`);
		await expect(elem).to.be.accessible;
	});

	it('with value', async() => {
		const elem = await fixture(html`<d2l-input-search value="foo"></d2l-input-search>`);
		await expect(elem).to.be.accessible;
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-search label="search" disabled></d2l-input-search>`);
		await expect(elem).to.be.accessible;
	});

	it('invalid', async() => {
		const elem = await fixture(html`<d2l-input-search label="search" aria-invalid="true"></d2l-input-search>`);
		await expect(elem).to.be.accessible;
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-search label="search"></d2l-input-search>`);
		elem.focus();
		await expect(elem).to.be.accessible();
	});

});

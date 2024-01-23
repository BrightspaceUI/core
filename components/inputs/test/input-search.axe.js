import '../input-search.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { inlineHelpFixtures } from './input-shared-content.js';

describe('d2l-input-search', () => {

	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-search label="search"></d2l-input-search>`);
		await expect(elem).to.be.accessible();
	});

	it('with value', async() => {
		const elem = await fixture(html`<d2l-input-search label="search" value="foo"></d2l-input-search>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-search label="search" disabled></d2l-input-search>`);
		await expect(elem).to.be.accessible();
	});

	it('invalid', async() => {
		const elem = await fixture(html`<d2l-input-search label="search" aria-invalid="true"></d2l-input-search>`);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-search label="search"></d2l-input-search>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

	it('description', async() => {
		const elem = await fixture(html`<d2l-input-search label="search" description="description"></d2l-input-search>`);
		await expect(elem).to.be.accessible();
	});

	it('inline-help', async() => {
		const elem = await fixture(inlineHelpFixtures.search.normal);
		await expect(elem).to.be.accessible();
	});
});

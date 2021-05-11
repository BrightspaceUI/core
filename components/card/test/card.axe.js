import '../card.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-card', () => {

	it.only('Test for axe tests', async() => {
		const testcomp = await fixture(html`<img src="./card.png">`);
		await expect(testcomp).to.be.accessible;
	});

	it('default', async() => {
		const elem = await fixture(html`<d2l-card><div slot="content">Content</div></d2l-card>`);
		await expect(elem).to.be.accessible;
	});

	it('subtle', async() => {
		const elem = await fixture(html`<d2l-card subtle><div slot="content">Content</div></d2l-card>`);
		await expect(elem).to.be.accessible;
	});

	it('default link', async() => {
		const elem = await fixture(html`<d2l-card text="Link Text" href="https://d2l.com"><div slot="content">Content</div></d2l-card>`);
		await expect(elem).to.be.accessible;
	});

	it('default link + focused', async() => {
		const elem = await fixture(html`<d2l-card text="Link Text" href="https://d2l.com"><div slot="content">Content</div></d2l-card>`);
		elem.focus();
		await expect(elem).to.be.accessible;
	});

	it('subtle link', async() => {
		const elem = await fixture(html`<d2l-card subtle text="Link Text" href="https://d2l.com"><div slot="content">Content</div></d2l-card>`);
		await expect(elem).to.be.accessible;
	});

	it('subtle link + focused', async() => {
		const elem = await fixture(html`<d2l-card subtle text="Link Text" href="https://d2l.com"><div slot="content">Content</div></d2l-card>`);
		elem.focus();
		await expect(elem).to.be.accessible;
	});

});

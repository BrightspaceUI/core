import '../link.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

describe('d2l-link', () => {

	it('normal', async() => {
		const elem = await fixture(html`<d2l-link href="https://www.d2l.com">Link Test</d2l-link>`);
		await expect(elem).to.be.accessible();
	});

	it('main', async() => {
		const elem = await fixture(html`<d2l-link main>Main Link</d2l-link>`);
		await expect(elem).to.be.accessible();
	});

	it('small', async() => {
		const elem = await fixture(html`<d2l-link small>Small Link</d2l-link>`);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-link href="https://www.d2l.com">Link Test</d2l-link>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

	it('new-window with target="_blank"', async() => {
		const elem = await fixture(html`<d2l-link href="https://www.d2l.com" target="_blank">Opens New Window</d2l-link>`);
		await expect(elem).to.be.accessible();
	});

	it('with aria-label', async() => {
		const elem = await fixture(html`<d2l-link href="https://www.d2l.com" aria-label="Custom accessible label">Link</d2l-link>`);
		await expect(elem).to.be.accessible();
	});

	it('with download attribute', async() => {
		const elem = await fixture(html`<d2l-link href="https://www.d2l.com/file.pdf" download>Download File</d2l-link>`);
		await expect(elem).to.be.accessible();
	});

	it('truncated with lines property', async() => {
		const elem = await fixture(html`<div style="width: 200px;"><d2l-link href="https://www.d2l.com" lines="2">This is a very long link that will be truncated after two lines</d2l-link></div>`);
		await expect(elem).to.be.accessible();
	});

	it('without href', async() => {
		const elem = await fixture(html`<d2l-link>Link without href</d2l-link>`);
		await expect(elem).to.be.accessible();
	});

});

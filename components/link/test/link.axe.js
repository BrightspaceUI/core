import '../link.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-link', () => {

	it('normal', async() => {
		const elem = await fixture(html`<d2l-link href="https://www.d2l.com">Link Test</d2l-link>`);
		await expect(elem).to.be.accessible;
	});

	it('main', async() => {
		const elem = await fixture(html`<d2l-link main>Main Link</d2l-link>`);
		await expect(elem).to.be.accessible;
	});

	it('small', async() => {
		const elem = await fixture(html`<d2l-link small>Small Link</d2l-link>`);
		await expect(elem).to.be.accessible;
	});

});

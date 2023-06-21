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

});

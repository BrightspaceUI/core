import '../pager-load-more.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

describe('d2l-pager-load-more', () => {

	it('normal', async() => {
		const elem = await fixture(html`<d2l-pager-load-more has-more page-size="5" item-count="30"></d2l-pager-load-more>`);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-pager-load-more has-more page-size="5" item-count="30"></d2l-pager-load-more>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

	it('no more', async() => {
		const elem = await fixture(html`<d2l-pager-load-more page-size="5" item-count="30"></d2l-pager-load-more>`);
		await expect(elem).to.be.accessible();
	});

	it('no item count', async() => {
		const elem = await fixture(html`<d2l-pager-load-more has-more page-size="5"></d2l-pager-load-more>`);
		await expect(elem).to.be.accessible();
	});

});

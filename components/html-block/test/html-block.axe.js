import '../html-block.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-html-block', () => {

	it('simple', async() => {
		const elem = await fixture(html`<d2l-html-block>some html</d2l-html-block>`);
		await expect(elem).to.be.accessible();
	});

	it('inline', async() => {
		const elem = await fixture(html`<d2l-html-block inline>some html</d2l-html-block>`);
		await expect(elem).to.be.accessible({ ignoredRules: ['scrollable-region-focusable'] });
	});

});

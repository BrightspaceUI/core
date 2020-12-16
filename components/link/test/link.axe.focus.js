import '../link.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

describe('d2l-link', () => {

	it('focused', async() => {
		const elem = await fixture(html`<d2l-link href="https://www.d2l.com">Link Test</d2l-link>`);
		setTimeout(() => elem.shadowRoot.querySelector('a').focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

});

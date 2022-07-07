import '../object-property-list-item-link.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-object-property-list-item-link', () => {

	it('should not set href attribute if null', async() => {
		const elem = await fixture(html`<d2l-object-property-list-item-link></d2l-object-property-list-item-link>`);
		elem.href = null;
		await elem.updateComplete;
		const anchorElem = elem.shadowRoot.querySelector('a');
		expect(anchorElem.hasAttribute('href')).to.be.false;
	});

});

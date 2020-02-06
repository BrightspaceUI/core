import '../menu-item-separator.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-menu-item-separator', () => {

	it('has role="separator"', async() => {
		const elem = await fixture(html`<d2l-menu-item-separator></d2l-menu-item-separator>`);
		expect(elem.getAttribute('role')).to.equal('separator');
	});

});

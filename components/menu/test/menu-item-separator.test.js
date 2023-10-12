import '../menu-item-separator.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('d2l-menu-item-separator', () => {

	describe('accessibility', () => {

		it('has role="separator"', async() => {
			const elem = await fixture(html`<d2l-menu-item-separator></d2l-menu-item-separator>`);
			expect(elem.getAttribute('role')).to.equal('separator');
		});

	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-menu-item-separator');
		});

	});

});

import '../menu-item-separator.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

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

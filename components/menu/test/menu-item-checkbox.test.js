import '../menu-item-checkbox.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

function dispatchItemSelectEvent(elem) {
	const e = new CustomEvent(
		'd2l-menu-item-select',
		{ bubbles: true, composed: true }
	);
	elem.dispatchEvent(e);
}

describe('d2l-menu-item-checkbox', () => {

	describe('accessibility', () => {

		it('has role="menuitemcheckbox"', async() => {
			const elem = await fixture(html`<d2l-menu-item-checkbox></d2l-menu-item-checkbox>`);
			expect(elem.getAttribute('role')).to.equal('menuitemcheckbox');
		});

	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-menu-item-checkbox');
		});

	});

	describe('events', () => {

		it('should set selected=true when "d2l-menu-item-select" event occurs', async() => {
			const elem = await fixture(html`<d2l-menu-item-checkbox></d2l-menu-item-checkbox>`);
			dispatchItemSelectEvent(elem);
			expect(elem.selected).to.be.true;
		});

		it('dispatches "d2l-menu-item-change" event when selected by calling __onSelect()', async() => {
			const elem = await fixture(html`<d2l-menu-item-checkbox value="1"></d2l-menu-item-checkbox>`);
			setTimeout(() => dispatchItemSelectEvent(elem));
			const { detail } = await oneEvent(elem, 'd2l-menu-item-change');
			expect(detail.value).to.equal('1');
			expect(detail.selected).to.be.true;
		});

	});

});

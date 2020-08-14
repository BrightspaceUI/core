import { defineCE, expect, fixture, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit-element/lit-element.js';
import { MenuItemMixin } from '../menu-item-mixin.js';

const tag = defineCE(
	class extends MenuItemMixin(LitElement) {}
);

function dispatchKeyEvent(elem, key) {
	const eventObj = document.createEvent('Events');
	eventObj.initEvent('keydown', true, true);
	eventObj.keyCode = key;
	elem.dispatchEvent(eventObj);
}

describe('MenuItemMixin', () => {

	let elem;
	beforeEach(async() => {
		elem = await fixture(`<${tag} id="my-menu-item"></${tag}>`);
	});

	describe('accessibility', () => {

		it('has role="menuitem"', () => {
			expect(elem.getAttribute('role')).to.equal('menuitem');
		});

		it('adds aria-disabled to disabled menu item', async() => {
			const disabledElem = await fixture(`<${tag} id="my-menu-item-disabled" disabled></${tag}>`);
			expect(disabledElem.getAttribute('aria-disabled')).to.equal('true');
		});

	});

	describe('events', () => {

		it('dispatches "d2l-menu-item-select" event when item clicked', async() => {
			setTimeout(() => elem.click());
			const { target } = await oneEvent(elem, 'd2l-menu-item-select');
			expect(target.id).to.equal('my-menu-item');
		});

		it('dispatches "d2l-menu-item-select" event when enter key pressed on item', async() => {
			setTimeout(() => dispatchKeyEvent(elem, 13));
			const { target } = await oneEvent(elem, 'd2l-menu-item-select');
			expect(target.id).to.equal('my-menu-item');
		});

		it('dispatches "d2l-menu-item-select" event when space key pressed on item', async() => {
			setTimeout(() => dispatchKeyEvent(elem, 32));
			const { target } = await oneEvent(elem, 'd2l-menu-item-select');
			expect(target.id).to.equal('my-menu-item');
		});

		it('does not dispatch select event for disabled item', async() => {
			elem.disabled = true;
			await elem.updateComplete;
			let dispatched = false;
			elem.addEventListener('d2l-menu-item-select', () => dispatched = true);
			elem.click();
			expect(dispatched).to.be.false;
		});

	});

});

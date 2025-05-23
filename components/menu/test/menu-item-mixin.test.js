import { clickElem, defineCE, expect, fixture, oneEvent, sendKeysElem } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';
import { LitElement } from 'lit';
import { MenuItemMixin } from '../menu-item-mixin.js';

const tag = defineCE(
	class extends MenuItemMixin(LitElement) {
		render() { return this.text; }
	}
);

describe('MenuItemMixin', () => {

	describe('accessibility', () => {
		it('has role="menuitem"', async() => {
			const elem = await fixture(`<${tag} text="my menu item"></${tag}>`);
			expect(elem.getAttribute('role')).to.equal('menuitem');
		});

		it('adds aria-disabled to disabled menu item', async() => {
			const elem = await fixture(`<${tag} text="my menu item" disabled></${tag}>`);
			expect(elem.getAttribute('aria-disabled')).to.equal('true');
		});

		it('adds aria-label to menu items', async() => {
			const elem = await fixture(`<${tag} text="my menu item"></${tag}>`);
			expect(elem.getAttribute('aria-label')).to.equal('my menu item');
		});

		it('overrides aria-label with description text', async() => {
			const elem = await fixture(`<${tag} text="my menu item" description="description-text"></${tag}>`);
			expect(elem.getAttribute('aria-label')).to.equal('description-text');
		});
	});

	describe('events', () => {
		it('dispatches "d2l-menu-item-select" event when item clicked', async() => {
			const elem = await fixture(`<${tag} text="my menu item"></${tag}>`);
			clickElem(elem);
			const { target } = await oneEvent(elem, 'd2l-menu-item-select');
			expect(target).to.equal(elem);
		});

		it('dispatches "d2l-menu-item-select" event when enter key pressed on item', async() => {
			const elem = await fixture(`<${tag} text="my menu item"></${tag}>`);
			sendKeysElem(elem, 'press', 'Enter');
			const { target } = await oneEvent(elem, 'd2l-menu-item-select');
			expect(target).to.equal(elem);
		});

		it('dispatches "d2l-menu-item-select" event when space key pressed on item', async() => {
			const elem = await fixture(`<${tag} text="my menu item"></${tag}>`);
			sendKeysElem(elem, 'press', 'Space');
			const { target } = await oneEvent(elem, 'd2l-menu-item-select');
			expect(target).to.equal(elem);
		});

		it('does not dispatch select event for disabled item', async() => {
			const elem = await fixture(`<${tag} text="disabled menu item" disabled></${tag}>`);
			let dispatched = false;
			elem.addEventListener('d2l-menu-item-select', () => dispatched = true);
			await clickElem(elem);
			expect(dispatched).to.be.false;
		});
	});

	describe('validation', () => {
		it('should throw when text is missing', async() => {
			const elem = await fixture(`<${tag}></${tag}>`);
			expect(() => elem.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(elem, 'text'));
		});

		it('should not throw when text is provided', async() => {
			const elem = await fixture(`<${tag} text="my menu item"></${tag}>`);
			expect(() => elem.flushRequiredPropertyErrors()).to.not.throw();
		});
	});

});

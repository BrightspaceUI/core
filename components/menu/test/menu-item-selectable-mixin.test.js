import { defineCE, expect, fixture } from '@open-wc/testing';
import { LitElement } from 'lit-element/lit-element.js';
import { MenuItemSelectableMixin } from '../menu-item-selectable-mixin.js';

const tag = defineCE(
	class extends MenuItemSelectableMixin(LitElement) {}
);

describe('MenuItemSelectableMixin', () => {

	describe('accessibility', () => {

		it('has no "aria-checked by default', async() => {
			const elem = await fixture(`<${tag}></${tag}>`);
			expect(elem.hasAttribute('aria-checked')).to.be.false;
		});

		it('has no "aria-checked when selected', async() => {
			const elem = await fixture(`<${tag} selected></${tag}>`);
			expect(elem.getAttribute('aria-checked')).to.equal('true');
		});

		it('sets "aria-checked when change occurs', async() => {
			const elem = await fixture(`<${tag}></${tag}>`);
			elem.selected = true;
			await elem.updateComplete;
			expect(elem.getAttribute('aria-checked')).to.equal('true');
		});

		it('removes "aria-checked when unselected', async() => {
			const elem = await fixture(`<${tag} selected></${tag}>`);
			elem.selected = false;
			await elem.updateComplete;
			expect(elem.hasAttribute('aria-checked')).to.be.false;
		});

	});

	describe('default property values', () => {

		it('should default "selected" property to "false" when unset', async() => {
			const elem = await fixture(`<${tag}></${tag}>`);
			expect(elem.selected).to.be.false;
		});

	});

});

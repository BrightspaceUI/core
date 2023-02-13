import { defineCE, expect, fixture } from '@open-wc/testing';
import { LitElement } from 'lit';
import { MenuItemSelectableMixin } from '../menu-item-selectable-mixin.js';

const tag = defineCE(
	class extends MenuItemSelectableMixin(LitElement) {}
);

describe('MenuItemSelectableMixin', () => {

	describe('accessibility', () => {

		it('has "aria-checked" false by default', async() => {
			const elem = await fixture(`<${tag}></${tag}>`);
			expect(elem.getAttribute('aria-checked')).to.equal('false');
		});

		it('has "aria-checked" true when selected', async() => {
			const elem = await fixture(`<${tag} selected></${tag}>`);
			expect(elem.getAttribute('aria-checked')).to.equal('true');
		});

		it('sets "aria-checked when change occurs', async() => {
			const elem = await fixture(`<${tag}></${tag}>`);
			elem.selected = true;
			await elem.updateComplete;
			expect(elem.getAttribute('aria-checked')).to.equal('true');
		});

		it('sets "aria-checked" to false when unselected', async() => {
			const elem = await fixture(`<${tag} selected></${tag}>`);
			elem.selected = false;
			await elem.updateComplete;
			expect(elem.getAttribute('aria-checked')).to.equal('false');
		});

	});

	describe('default property values', () => {

		it('should default "selected" property to "false" when unset', async() => {
			const elem = await fixture(`<${tag}></${tag}>`);
			expect(elem.selected).to.be.false;
		});

	});

});

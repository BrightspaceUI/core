import { defineCE, expect, fixture } from '@brightspace-ui/testing';
import { LitElement } from 'lit';
import { PopoverMixin } from '../popover-mixin.js';

const tagName = defineCE(
	class extends PopoverMixin(LitElement) {
		static get styles() {
			return super.styles;
		}
		render() {
			return this._renderPopover();
		}
	}
);

describe('PopoverMixin', () => {

	it('closed', async() => {
		const el = await fixture(`<${tagName}></${tagName}>`);
		await expect(el).to.be.accessible();
	});

	it('opened', async() => {
		const el = await fixture(`<${tagName} opened></${tagName}>`);
		await expect(el).to.be.accessible();
	});

});

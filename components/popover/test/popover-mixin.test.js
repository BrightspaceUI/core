import { defineCE, fixture, oneEvent, runConstructor } from '@brightspace-ui/testing';
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

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor(tagName);
		});

	});

	describe('events', () => {

		it('should fire the open event when the opened attribute is set to true', async() => {
			const elem = await fixture(`<${tagName}></${tagName}>`);
			elem.opened = true;
			await oneEvent(elem, 'd2l-popover-open');
		});

		it('should fire the close event when the opened attribute is set to true', async() => {
			const elem = await fixture(`<${tagName} opened></${tagName}>`);
			elem.opened = false;
			await oneEvent(elem, 'd2l-popover-close');
		});

	});

});

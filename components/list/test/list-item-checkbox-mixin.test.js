import { defineCE, expect, fixture, oneEvent } from '@open-wc/testing';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';

const tag = defineCE(
	class extends ListItemCheckboxMixin(LitElement) {
		render() {
			return this._renderCheckbox();
		}
	}
);

describe('ListItemCheckboxMixin', () => {
	it('Sets checked status to undefined when no key is given', async() => {
		const element = await fixture(`<${tag} selected="true"></${tag}>`);
		expect(element.selected).to.be.undefined;
	});

	describe('Events', () => {
		let element;
		beforeEach(async() => {
			element = await fixture(`<${tag} key="1234" selectable="true"></${tag}>`);
		});
		it('dispatches "d2l-list-item-selected" when checkbox is checked', async() => {
			// simulate a checkbox click
			setTimeout(() => {
				const checkbox = element.shadowRoot.querySelector('.d2l-input-checkbox');
				checkbox.checked = true;
				checkbox.dispatchEvent(new Event('change'));
			});

			const { detail } = await oneEvent(element, 'd2l-list-item-selected');
			expect(detail.key).to.equal('1234');
			expect(detail.selected).to.equal(true);
		});

		it('dispatches "d2l-list-item-selected" when action area is clicked', async() => {
			// simulate an action area click
			setTimeout(() => {
				const actionArea = element.shadowRoot.querySelector('[slot="control-action"]');
				actionArea.dispatchEvent(new Event('click'));
			});

			const { detail } = await oneEvent(element, 'd2l-list-item-selected');
			expect(detail.key).to.equal('1234');
			expect(detail.selected).to.equal(true);
		});

		it('does not dispatch when item is disabled', async() => {
			let dispatched = false;
			element.disabled = true;
			await element.updateComplete;
			element.addEventListener('d2l-list-item-selected', () => dispatched = true);
			const actionArea = element.shadowRoot.querySelector('[slot="control-action"]');
			// simulate an action area click
			setTimeout(() => {
				actionArea.dispatchEvent(new Event('click'));
			});
			await oneEvent(actionArea, 'click');
			expect(dispatched).to.be.false;

		});
	});
});

import { defineCE, expect, fixture, oneEvent } from '@open-wc/testing';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';

const tag = defineCE(
	class extends ListItemCheckboxMixin(LitElement) {
		render() {
			return html`
				${this._renderCheckbox()}
				${this._renderCheckboxAction()}
			`;
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

		it('does not dispatch when item is disabled', async() => {
			let dispatched = false;
			element.disabled = true;
			await element.updateComplete;
			element.addEventListener('d2l-list-item-selected', () => dispatched = true);
			const actionArea = element.shadowRoot.querySelector('.d2l-checkbox-action');
			// simulate an action area click
			setTimeout(() => {
				actionArea.dispatchEvent(new Event('click'));
			});
			await oneEvent(actionArea, 'click');
			expect(dispatched).to.be.false;

		});
	});
});

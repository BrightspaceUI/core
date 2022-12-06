import { defineCE, expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { ListItemExpandCollapseMixin } from '../list-item-expand-collapse-mixin.js';

const tag = defineCE(
	class extends ListItemExpandCollapseMixin(LitElement) {
		render() {
			return html`
				${this._renderExpandCollapse()}
				${this._renderExpandCollapseAction()}
			`;
		}
	}
);

describe('ListItemExpandCollapseMixin', () => {
	it('Sets expand-collapse-enabled to false when no key is given', async() => {
		const element = await fixture(`<${tag} expand-collapse-enabled></${tag}>`);
		await element.updateComplete;
		expect(element.expandCollapseEnabled).to.be.false;
	});

	describe('Render expand/collapse action area when appropriate', () => {
		const cases = [{
			properties: { selectable: false, disabled: false, expandCollapseEnabled: true, _hasChildren: true },
			actionAreaAvailable: true
		},
		{
			properties: { selectable: false, disabled: false, expandCollapseEnabled: false, _hasChildren: true },
			actionAreaAvailable: false
		},
		{
			properties: { selectable: false, disabled: false, expandCollapseEnabled: false, _hasChildren: false },
			actionAreaAvailable: false
		},
		{
			properties: { selectable: true, disabled: false, expandCollapseEnabled: false, _hasChildren: false },
			actionAreaAvailable: false
		},
		{
			properties: { selectable: true, disabled: false, expandCollapseEnabled: true, _hasChildren: false },
			actionAreaAvailable: false
		},
		{
			properties: { selectable: true, disabled: true, expandCollapseEnabled: true, _hasChildren: true },
			actionAreaAvailable: true
		}];

		for (const test of cases) {
			it(`selectable: ${test.properties.selectable} disabled: ${test.properties.disabled} expandCollapseEnabled: ${test.properties.expandCollapseEnabled} _hasChildren: ${test.properties._hasChildren}`, async() => {
				const element = await fixture(`<${tag} key="1234" ${test.input}></${tag}>`);
				for (const [key, value] of Object.entries(test.properties)) {
					element[key] = value;
				}
				await element.updateComplete;
				const actionArea = element.shadowRoot.querySelector('.d2l-list-expand-collapse-action');
				if (test.actionAreaAvailable) {
					expect(actionArea).to.exist;
				} else {
					expect(actionArea).to.not.exist;
				}
			});
		}
	});

	describe('Render expand/collapse slot and button when appropriate', () => {
		const cases = [{
			properties: { expandCollapseEnabled: true, _hasChildren: true, _siblingHasNestedItems: false },
			slotAvailable: true
		},
		{
			properties: { expandCollapseEnabled: true, _hasChildren: false, _siblingHasNestedItems: true },
			slotAvailable: true
		},
		{
			properties: { expandCollapseEnabled: false, _hasChildren: true, _siblingHasNestedItems: true },
			slotAvailable: false
		}];

		for (const test of cases) {
			it(`expandCollapseEnabled: ${test.properties.expandCollapseEnabled} _hasChildren: ${test.properties._hasChildren} _siblingHasNestedItems: ${test.properties._siblingHasNestedItems}`, async() => {
				const element = await fixture(`<${tag} key="1234" ${test.input}></${tag}>`);
				for (const [key, value] of Object.entries(test.properties)) {
					element[key] = value;
				}
				await element.updateComplete;
				const slot = element.shadowRoot.querySelector('.d2l-list-expand-collapse');
				const button = element.shadowRoot.querySelector('.d2l-list-expand-collapse d2l-button-icon');
				if (test.slotAvailable) {
					expect(slot).to.exist;
					if (test.properties._hasChildren) {
						expect(button).to.exist;
					} else {
						expect(button).to.not.exist;
					}
				} else {
					expect(slot).to.not.exist;
				}
			});
		}
	});
});

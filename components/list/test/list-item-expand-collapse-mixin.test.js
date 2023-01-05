import { defineCE, expect, fixture, oneEvent } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';
import { ListItemExpandCollapseMixin } from '../list-item-expand-collapse-mixin.js';
import { ListItemMixin } from '../list-item-mixin.js';

const tag = defineCE(
	class extends ListItemMixin(ListItemExpandCollapseMixin(ListItemCheckboxMixin(LitElement))) {
		render() {
			return html`
				${this._renderExpandCollapse()}
				${this._renderExpandCollapseAction()}
				${this._renderChildrenLoadingSpinner()}
			`;
		}
	}
);

describe('ListItemExpandCollapseMixin', () => {
	it('Sets expandable to false when no key is given', async() => {
		const element = await fixture(`<${tag} expandable></${tag}>`);
		await element.updateComplete;
		expect(element.expandable).to.be.false;
	});

	describe('Render expand/collapse action area when appropriate', () => {
		const cases = [{
			properties: { selectable: false, expandable: true, _hasChildren: true, noPrimaryAction: false },
			actionAreaAvailable: true
		},
		{
			properties: { selectable: false, expandable: false, _hasChildren: true, noPrimaryAction: false },
			actionAreaAvailable: false
		},
		{
			properties: { selectable: false, expandable: false, _hasChildren: false, noPrimaryAction: false },
			actionAreaAvailable: false
		},
		{
			properties: { selectable: true, expandable: true, _hasChildren: true, noPrimaryAction: false },
			actionAreaAvailable: false
		},
		{
			properties: { selectable: false, expandable: true, _hasChildren: true, noPrimaryAction: true },
			actionAreaAvailable: false
		}];

		for (const test of cases) {
			it(`selectable: ${test.properties.selectable} expandable: ${test.properties.expandable} _hasChildren: ${test.properties._hasChildren} noPrimaryAction: ${test.properties.noPrimaryAction}`, async() => {
				const element = await fixture(`<${tag} key="1234" expanded></${tag}>`);
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
			properties: { expandable: true, _hasChildren: true, _siblingHasNestedItems: false },
			slotAvailable: true
		},
		{
			properties: { expandable: true, _hasChildren: false, _siblingHasNestedItems: true },
			slotAvailable: true
		},
		{
			properties: { expandable: false, _hasChildren: true, _siblingHasNestedItems: true },
			slotAvailable: false
		}];

		for (const test of cases) {
			it(`expandable: ${test.properties.expandable} _hasChildren: ${test.properties._hasChildren} _siblingHasNestedItems: ${test.properties._siblingHasNestedItems}`, async() => {
				const element = await fixture(`<${tag} key="1234" expanded></${tag}>`);
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

	describe('Fires appropriate event when clicking button or action area', () => {

		it('Fires event on button click', async() => {
			const element = await fixture(`<${tag} key="1234" expandable expanded></${tag}>`);
			element._hasChildren = true;
			await element.updateComplete;
			const button = element.shadowRoot.querySelector('.d2l-list-expand-collapse d2l-button-icon');
			expect(button).to.exist;
			// simulate a button click
			setTimeout(() => {
				button.click();
			});

			const { detail } = await oneEvent(element, 'd2l-list-item-expand-collapse-toggled');
			expect(detail.expanded).to.equal(false);
			expect(detail.key).to.equal('1234');
		});

		it('Fires event on action area click', async() => {
			const element = await fixture(`<${tag} key="1234" expandable></${tag}>`);
			element._hasChildren = true;
			await element.updateComplete;
			const actionControl = element.shadowRoot.querySelector('.d2l-list-expand-collapse-action');
			expect(actionControl).to.exist;
			// simulate action control click
			setTimeout(() => {
				actionControl.click();
			});

			const { detail } = await oneEvent(element, 'd2l-list-item-expand-collapse-toggled');
			expect(detail.expanded).to.equal(true);
			expect(detail.key).to.equal('1234');
		});
	});

	describe('Render expand/collapse toggle and action area when override set', () => {
		const overrideCases = [{
			value: 'closed',
			btnAvailable: true
		},
		{
			value: 'opened',
			btnAvailable: true
		},
		{
			value: '',
			btnAvailable: false
		}];

		for (const test of overrideCases) {
			it(`expandCollapseOverride: ${test.value}`, async() => {
				const element = await fixture(`<${tag} key="1234" expandable expand-collapse-override="${test.value}"></${tag}>`);
				await element.updateComplete;
				const button = element.shadowRoot.querySelector('.d2l-list-expand-collapse d2l-button-icon');
				const actionArea = element.shadowRoot.querySelector('.d2l-list-expand-collapse-action');
				if (test.btnAvailable) {
					expect(button).to.exist;
					expect(actionArea).to.exist;
					if (test.value === 'opened') {
						expect(element.expanded).to.equal(true);
					} else if (test.value === 'closed') {
						expect(element.expanded).to.equal(false);
					}
				} else {
					expect(button).to.not.exist;
					expect(actionArea).to.not.exist;
				}
			});
		}
	});

	describe('Render loading spinner when lazy loading children', () => {
		const cases = [{
			overrideValue: 'opened',
			hasChildren: true,
			spinnerLoaded: false
		},
		{
			overrideValue: '',
			hasChildren: false,
			spinnerLoaded: false
		},
		{
			overrideValue: 'closed',
			hasChildren: false,
			spinnerLoaded: false
		},
		{
			overrideValue: 'opened',
			hasChildren: false,
			spinnerLoaded: true
		}];

		for (const test of cases) {
			it(`expandCollapseOverride: ${test.overrideValue} hasChildren: ${test.hasChildren}`, async() => {
				const element = await fixture(`<${tag} key="1234" expandable expand-collapse-override="${test.overrideValue}"></${tag}>`);
				element['_hasChildren'] = test.hasChildren;
				await element.updateComplete;
				const spinner = element.shadowRoot.querySelector('.d2l-list-children-loading');
				if (test.spinnerLoaded) {
					expect(spinner).to.exist;
				} else {
					expect(spinner).to.not.exist;
				}
			});
		}
	});

	describe('Does not toggle expanded property when clicking button or action area with override set', () => {
		const overrideCases = ['closed', 'opened'];
		for (const test of overrideCases) {
			it(`override value: ${test}`, async() => {
				const element = await fixture(`<${tag} key="1234" expandable expand-collapse-override="${test}"></${tag}>`);
				await element.updateComplete;
				if (test === 'opened') {
					expect(element.expanded).to.equal(true);
				} else {
					expect(element.expanded).to.equal(false);
				}
				const button = element.shadowRoot.querySelector('.d2l-list-expand-collapse d2l-button-icon');
				expect(button).to.exist;
				// simulate a button click
				setTimeout(() => {
					button.click();
				});

				const { detail } = await oneEvent(element, 'd2l-list-item-expand-collapse-toggled');
				if (test === 'opened') {
					expect(detail.expanded).to.equal(true);
					expect(element.expanded).to.equal(true);
				} else {
					expect(detail.expanded).to.equal(false);
					expect(element.expanded).to.equal(false);
				}
				expect(detail.key).to.equal('1234');
			});
		}
	});
});

import { defineCE, expect, fixture, oneEvent } from '@brightspace-ui/testing';
import { html, LitElement } from 'lit';
import { restore, stub } from 'sinon';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';
import { ListItemExpandCollapseMixin } from '../list-item-expand-collapse-mixin.js';
import { ListItemMixin } from '../list-item-mixin.js';

const tag = defineCE(
	class extends ListItemMixin(ListItemExpandCollapseMixin(ListItemCheckboxMixin(LitElement))) {
		render() {
			return html`
				${this._renderExpandCollapse()}
				${this._renderExpandCollapseAction()}
				${this._renderNestedLoadingSpinner()}
			`;
		}
	}
);

describe('ListItemExpandCollapseMixin', () => {

	let consoleWarnStub;
	beforeEach(() => {
		consoleWarnStub = stub(console, 'warn');
	});

	afterEach(() => restore());

	it('Sets expandable to false when no key is given', async() => {
		const element = await fixture(`<${tag} expandable></${tag}>`);
		expect(element.expandable).to.be.false;
		expect(consoleWarnStub).to.be.calledWith('ListItemExpandCollapseMixin requires a key.');
	});

	describe('Render expand/collapse action area when appropriate', () => {
		const cases = [{
			properties: { selectable: false, expandable: true, noPrimaryAction: false },
			actionAreaAvailable: true
		},
		{
			properties: { selectable: false, expandable: false, noPrimaryAction: false },
			actionAreaAvailable: false
		},
		{
			properties: { selectable: true, expandable: true, noPrimaryAction: false },
			actionAreaAvailable: false
		},
		{
			properties: { selectable: false, expandable: true, noPrimaryAction: true },
			actionAreaAvailable: false
		}];

		for (const test of cases) {
			it(`selectable: ${test.properties.selectable} expandable: ${test.properties.expandable} noPrimaryAction: ${test.properties.noPrimaryAction}`, async() => {
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

	describe('Fires appropriate event when clicking button or action area', () => {

		it('Fires event on button click', async() => {
			const element = await fixture(`<${tag} key="1234" expandable expanded></${tag}>`);
			const button = element.shadowRoot.querySelector('d2l-button-icon');
			expect(button).to.exist;
			// simulate a button click
			setTimeout(() => {
				button.click();
			});

			const e = await oneEvent(element, 'd2l-list-item-expand-collapse-toggled');
			expect(e).to.exist;
			expect(e.target.key).to.equal('1234');
			expect(e.target.expanded).to.equal(false);
		});

		it('Fires event on action area click', async() => {
			const element = await fixture(`<${tag} key="1234" expandable></${tag}>`);
			const actionControl = element.shadowRoot.querySelector('.d2l-list-expand-collapse-action');
			expect(actionControl).to.exist;
			// simulate action control click
			setTimeout(() => {
				actionControl.click();
			});

			const e = await oneEvent(element, 'd2l-list-item-expand-collapse-toggled');
			expect(e).to.exist;
			expect(e.target.key).to.equal('1234');
			expect(e.target.expanded).to.equal(true);
		});
	});

	describe('Render loading spinner when expanded but no children', () => {
		for (const test of [true, false]) {
			it(`expandCollapseOverride: hasChildren: ${test}`, async() => {
				const hasChildren = test;
				const element = await fixture(`<${tag} key="1234" expandable expanded></${tag}>`);
				element._hasNestedList = hasChildren;
				await element.updateComplete;
				const spinner = element.shadowRoot.querySelector('.d2l-list-nested-loading');
				if (!hasChildren) {
					expect(spinner).to.exist;
				} else {
					expect(spinner).to.not.exist;
				}
			});
		}
	});
});

import { defineCE, expect, fixture, oneEvent } from '@open-wc/testing';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';

const tag = defineCE(
	class extends ListItemCheckboxMixin(LitElement) {
		render() {
			return html`
				${this._renderCheckbox()}
				${this._renderCheckboxAction('item label')}
			`;
		}
	}
);

describe('ListItemCheckboxMixin', () => {
	describe('Sets selected status to undefined when no key is given', () => {
		const cases = [
			'disabled selected',
			'disabled selected selectable',
			'selected',
			'selected selectable'
		];
		for (const test of cases) {
			it(test, async() => {
				const element = await fixture(`<${tag} ${test} label="some label"></${tag}>`);
				expect(element.selected).to.be.undefined;
			});
		}
	});

	describe('Does not render checkbox or action area when not selectable', () => {
		const cases = [{
			input: '',
			expected: { selectable: undefined, disabled: undefined, selected: false }
		}, {
			input: 'disabled',
			expected: { selectable: undefined, disabled: true, selected: false }
		}, {
			input: 'disabled selected',
			expected: { selectable: undefined, disabled: true, selected: true }
		}, {
			input: 'selected',
			expected: { selectable: undefined, disabled: undefined, selected: true }
		}];
		for (const test of cases) {
			it(test.input || 'empty', async() => {
				const element = await fixture(`<${tag} key="1234" ${test.input}></${tag}>`);
				const actionArea = element.shadowRoot.querySelector('.d2l-checkbox-action');
				const selectionInput = element.shadowRoot.querySelector('d2l-selection-input');
				expect(actionArea).to.be.null;
				expect(selectionInput).to.be.null;

				Object.keys(test.expected).forEach(prop =>
					expect(element[prop]).to.be.equal(test.expected[prop]));
			});
		}
	});

	describe('Dispatches custom event when checkbox is checked', () => {
		const cases = [{
			input: 'selectable',
			initial: { selectable: true, disabled: undefined, selected: false },
			expected: { selectable: true, disabled: undefined, selected: true }
		}, {
			input: 'selectable selected',
			initial: { selectable: true, disabled: undefined, selected: true },
			expected: { selectable: true, disabled: undefined, selected: false }
		}];
		for (const test of cases) {
			it(test.input, async() => {
				const element = await fixture(`<${tag} key="1234" ${test.input} label="some label"></${tag}>`);
				Object.keys(test.initial).forEach(prop =>
					expect(element[prop]).to.be.equal(test.initial[prop]));
				// simulate a checkbox click
				setTimeout(() => {
					const selectionInput = element.shadowRoot.querySelector('d2l-selection-input');
					selectionInput.selected = test.expected.selected;
					selectionInput.dispatchEvent(new Event('change'));
				});
				const { detail } = await oneEvent(element, 'd2l-list-item-selected');
				expect(detail.selected).to.equal(test.expected.selected);
				Object.keys(test.expected).forEach(prop =>
					expect(element[prop]).to.be.equal(test.expected[prop]));
			});
		}
	});

	describe('Dispatches custom event when action area is clicked', () => {
		const cases = [{
			input: 'selectable',
			initial: { selectable: true, disabled: undefined, selected: false },
			expected: { selectable: true, disabled: undefined, selected: true }
		}, {
			input: 'selectable selected',
			initial: { selectable: true, disabled: undefined, selected: true },
			expected: { selectable: true, disabled: undefined, selected: false }
		}];
		for (const test of cases) {
			it(test.input, async() => {
				const element = await fixture(`<${tag} key="1234" ${test.input} label="some label"></${tag}>`);
				Object.keys(test.initial).forEach(prop =>
					expect(element[prop]).to.be.equal(test.initial[prop]));
				// simulate an action area click
				setTimeout(() => {
					const actionArea = element.shadowRoot.querySelector('.d2l-checkbox-action');
					actionArea.dispatchEvent(new Event('click'));
				});

				const { detail } = await oneEvent(element, 'd2l-list-item-selected');
				expect(detail.selected).to.equal(test.expected.selected);

				Object.keys(test.expected).forEach(prop =>
					expect(element[prop]).to.be.equal(test.expected[prop]));
			});
		}
	});

	describe('Does not dispatch event when item is disabled', () => {
		const cases = [{
			input: 'disabled selected selectable',
			initial: { selectable: true, disabled: true, selected: true },
			expected: { selectable: true, disabled: true, selected: true }
		}, {
			input: 'disabled selectable',
			initial: { selectable: true, disabled: true, selected: false },
			expected: { selectable: true, disabled: true, selected: false }
		}];
		for (const test of cases) {
			it(test.input, async() => {
				const element = await fixture(`<${tag} key="1234" ${test.input} label="some label"></${tag}>`);
				let dispatched = false;
				const actionArea = element.shadowRoot.querySelector('.d2l-checkbox-action');
				element.addEventListener('d2l-list-item-selected', () => dispatched = true);

				Object.keys(test.initial).forEach(prop =>
					expect(element[prop]).to.be.equal(test.initial[prop]));
				// simulate an action area click
				setTimeout(() => {
					actionArea.dispatchEvent(new Event('click'));
				});
				await oneEvent(actionArea, 'click');
				expect(dispatched).to.be.false;
				Object.keys(test.expected).forEach(prop =>
					expect(element[prop]).to.be.equal(test.expected[prop]));
			});
		}
	});
});

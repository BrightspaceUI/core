import { defineCE, expect, fixture, oneEvent } from '@brightspace-ui/testing';
import { html, LitElement } from 'lit';
import { restore, stub } from 'sinon';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';

const tag = defineCE(
	class extends ListItemCheckboxMixin(LitElement) {
		static properties = {
			noActionContent: { type: Boolean, attribute: 'no-action-content' }
		};
		constructor() {
			super();
			this.noActionContent = false;
		}
		render() {
			return html`
				${this._renderCheckbox()}
				${this._renderCheckboxAction(this.noActionContent ? '' : 'item label')}
			`;
		}
	}
);

describe('ListItemCheckboxMixin', () => {

	let consoleWarnStub;
	beforeEach(() => {
		consoleWarnStub = stub(console, 'warn');
	});

	afterEach(() => restore());

	describe('Sets selected status to undefined when no key is given', () => {
		const cases = [
			'selection-disabled selected',
			'selection-disabled selected selectable',
			'selected',
			'selected selectable'
		];
		for (const test of cases) {
			it(test, async() => {
				const element = await fixture(`<${tag} ${test} label="some label"></${tag}>`);
				expect(element.selected).to.be.undefined;
				if (cases.indexOf('selectable') > -1) {
					expect(consoleWarnStub).to.be.calledWith('ListItemCheckboxMixin requires a key.');
				}
			});
		}
	});

	describe('checkbox and action area', () => {
		const cases = [{
			input: '',
			expected: { selectionDisabled: false, selected: false }
		}, {
			input: 'selection-disabled',
			expected: { selectionDisabled: true, selected: false }
		}, {
			input: 'selection-disabled selected',
			expected: { selectionDisabled: true, selected: true }
		}, {
			input: 'selected',
			expected: { selectionDisabled: false, selected: true }
		}, {
			input: 'selected no-action-content',
			expected: { selectionDisabled: false, selected: true }
		}];

		[true, false].forEach(selectable => {
			const not = selectable ? '' : 'not ';
			describe(`Does ${not}render checkbox or action area when ${not}selectable`, () => {
				for (const test of cases) {
					it(test.input || 'empty', async() => {
						const element = await fixture(`<${tag} key="1234" ${test.input}${selectable ? ' selectable' : ''}></${tag}>`);
						const actionArea = element.shadowRoot.querySelector('.d2l-checkbox-action');
						const selectionInput = element.shadowRoot.querySelector('d2l-selection-input');
						if (selectable) {
							expect(actionArea).to.exist;
							expect(actionArea.ariaHidden).to.equal(test.input.indexOf('no-action-content') > -1 ? 'true' : null);
							expect(selectionInput).to.exist;
						} else {
							expect(actionArea).to.be.null;
							expect(selectionInput).to.be.null;
						}
						expect(element.selectable).to.be.equal(selectable);
						Object.keys(test.expected).forEach(prop =>
							expect(element[prop]).to.be.equal(test.expected[prop]));
					});
				}
			});
		});
	});

	describe('Dispatches custom event when checkbox is checked', () => {
		const cases = [{
			input: 'selectable',
			initial: { selectable: true, selectionDisabled: false, selected: false },
			expected: { selectable: true, selectionDisabled: false, selected: true }
		}, {
			input: 'selectable selected',
			initial: { selectable: true, selectionDisabled: false, selected: true },
			expected: { selectable: true, selectionDisabled: false, selected: false }
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

	describe('Dispatches custom event when action area is selected', () => {
		const cases = [{
			input: 'selectable',
			initial: { selectable: true, selectionDisabled: false, selected: false },
			expected: { selectable: true, selectionDisabled: false, selected: true }
		}, {
			input: 'selectable selected',
			initial: { selectable: true, selectionDisabled: false, selected: true },
			expected: { selectable: true, selectionDisabled: false, selected: false }
		}];

		for (const test of cases) {
			it(`${test.input} click`, async() => {
				const element = await fixture(`<${tag} key="1234" ${test.input} label="some label"></${tag}>`);
				Object.keys(test.initial).forEach(prop =>
					expect(element[prop]).to.be.equal(test.initial[prop]));
				// simulate an action area selection
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

	describe('Does not dispatch event when item has selection disabled', () => {
		const cases = [{
			input: 'selection-disabled selected selectable',
			initial: { selectable: true, selectionDisabled: true, selected: true },
			expected: { selectable: true, selectionDisabled: true, selected: true }
		}, {
			input: 'selection-disabled selectable',
			initial: { selectable: true, selectionDisabled: true, selected: false },
			expected: { selectable: true, selectionDisabled: true, selected: false }
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

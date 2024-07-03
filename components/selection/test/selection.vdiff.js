import '../selection-action.js';
import '../selection-action-dropdown.js';
import '../selection-controls.js';
import '../selection-input.js';
import '../selection-select-all.js';
import '../selection-select-all-pages.js';
import '../selection-summary.js';
import './selection-component.js';
import { clickElem, expect, fixture, focusElem, html, oneEvent, sendKeysElem } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';

const viewport = { width: 476 };

function createInputList(numInputs, selected) {
	return html`
		<ul style="padding: 0;">
			${Array.from(Array(numInputs).keys()).map((key) => html`
				<li style="list-style-type: none;">
					<d2l-selection-input
						style="margin-right: 10px;"
						label="${`item ${key + 1}`}"
						key="${`key${key + 1}`}"
						?selected="${selected && selected[key]}">
					</d2l-selection-input>${`Item ${key + 1}`}
				</li>
			`)}
		</ul>
	`;
}

describe('selection-components', () => {
	[{
		category: 'action',
		tests: [
			{ name: 'text', template: html`<d2l-selection-action text="action"></d2l-selection-action>` },
			{ name: 'text-icon', template: html`<d2l-selection-action text="action" icon="tier1:gear"></d2l-selection-action>` },
			{ name: 'disabled', template: html`<d2l-selection-action text="action" disabled></d2l-selection-action>`, waitFor: elem => oneEvent(elem, 'd2l-tooltip-show') }
		],
		requiresSelectionTemplate: html`<d2l-selection-action text="action" requires-selection></d2l-selection-action>`
	},
	{
		category: 'dropdown',
		tests: [
			{ name: 'text', template: html`<d2l-selection-action-dropdown text="action"></d2l-selection-action-dropdown>` },
			{ name: 'disabled', template: html`<d2l-selection-action-dropdown text="action" disabled></d2l-selection-action-dropdown>`, waitFor: elem => oneEvent(elem, 'd2l-tooltip-show') }
		],
		requiresSelectionTemplate: html`<d2l-selection-action-dropdown text="action" requires-selection></d2l-selection-action-dropdown>`
	}].forEach(({ category, tests, requiresSelectionTemplate }) => {
		describe(category, () => {
			tests.forEach(({ name, template, waitFor }) => {
				it(name, async() => {
					const elem = await fixture(template);
					await expect(elem).to.be.golden();
				});

				it(`${name}-focus`, async() => {
					const elem = await fixture(template);
					await focusElem(elem);
					if (waitFor) await waitFor(elem);
					await expect(elem).to.be.golden();
				});
			});

			[
				{ name: 'requires-selection-none', selectionInfo: { state: 'none', keys: [] } },
				{ name: 'requires-selection-some', selectionInfo: { state: 'some', keys: [] } },
				{ name: 'requires-selection-all', selectionInfo: { state: 'all', keys: [] } }
			].forEach(({ name, selectionInfo }) => {
				it(name, async() => {
					const elem = await fixture(requiresSelectionTemplate);
					elem.selectionInfo = selectionInfo;
					await expect(elem).to.be.golden();
				});
			});
		});
	});

	describe('controls', () => {
		[
			{ name: 'minimal', template: html`<d2l-selection-controls></d2l-selection-controls>` },
			{ name: 'with-actions', template: html`
				<d2l-test-selection>
					<d2l-selection-controls>
						<d2l-selection-action text="Bookmark" icon="tier1:bookmark-hollow" requires-selection></d2l-selection-action>
						<d2l-selection-action text="Settings" icon="tier1:gear"></d2l-selection-action>
					</d2l-selection-controls>
					${createInputList(1)}
				</d2l-test-selection>
			` },
			{ name: 'with-pageable', template: html`
				<d2l-test-pageable>
					<d2l-selection-controls></d2l-selection-controls>
					${createInputList(1)}
				</d2l-test-pageable>
			` },
			{ name: 'with-pageable-more', template: html`
				<d2l-test-pageable item-count="10">
					<d2l-selection-controls></d2l-selection-controls>
					${createInputList(1)}
				</d2l-test-pageable>
			` },
			{ name: 'with-selection-pageable', template: html`
				<d2l-test-selection-pageable>
					<d2l-selection-controls></d2l-selection-controls>
					${createInputList(1)}
				</d2l-test-selection-pageable>
			` },
			{ name: 'with-custom-no-selection-text', template: html`
				<d2l-test-selection-pageable>
					<d2l-selection-controls no-selection-text="custom no selection text"></d2l-selection-controls>
					${createInputList(1)}
				</d2l-test-selection-pageable>
			` },
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template, { viewport });
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('checkbox', () => {
		const defaultTemplate = html`<d2l-test-selection><d2l-selection-input label="item 1" key="key1"></d2l-selection-input></d2l-test-selection>`;
		const selectedTemplate = html`<d2l-test-selection><d2l-selection-input label="item 1" key="key1" selected></d2l-selection-input></d2l-test-selection>`;

		[
			{ name: 'default', template: defaultTemplate },
			{ name: 'focus', template: defaultTemplate, action: focusElem },
			{ name: 'click', template: defaultTemplate, action: clickElem },
			{ name: 'selected', template: selectedTemplate },
			{ name: 'skeleton', template: html`<d2l-test-selection><d2l-selection-input label="item 1" key="key1" skeleton></d2l-selection-input></d2l-test-selection>` },
			{ name: 'selected-focus', template: selectedTemplate, action: focusElem },
			{ name: 'selected-click', template: selectedTemplate, action: clickElem }
		].forEach(({ name, template, action }) => {
			it(name, async() => {
				const elem = await fixture(template);
				const input = elem.querySelector('d2l-selection-input');
				if (action) await action(input);
				await expect(input).to.be.golden();
			});
		});
	});

	describe('radio', () => {
		const defaultTemplate = html`<d2l-test-selection selection-single><d2l-selection-input label="item 1" key="key1"></d2l-selection-input></d2l-test-selection>`;
		const defaultRadioToggleTemplate = html`<d2l-test-selection selection-single radio-toggle><d2l-selection-input label="item 1" key="key1"></d2l-selection-input></d2l-test-selection>`;
		const selectedTemplate = html`<d2l-test-selection selection-single><d2l-selection-input label="item 1" key="key1" selected></d2l-selection-input></d2l-test-selection>`;
		const selectedRadioToggleTemplate = html`<d2l-test-selection selection-single radio-toggle><d2l-selection-input label="item 1" key="key1" selected></d2l-selection-input></d2l-test-selection>`;

		[
			{ name: 'default', template: defaultTemplate },
			{ name: 'focus', template: defaultTemplate, action: focusElem },
			{ name: 'click', template: defaultTemplate, action: clickElem },
			{ name: 'click-radio-toggle', template: defaultRadioToggleTemplate, action: clickElem },
			{ name: 'space', template: defaultTemplate, action: elem => sendKeysElem(elem, 'press', 'Space') },
			{ name: 'space-radio-toggle', template: defaultRadioToggleTemplate, action: elem => sendKeysElem(elem, 'press', 'Space') },
			{ name: 'selected', template: selectedTemplate },
			{ name: 'skeleton', template: html`<d2l-test-selection selection-single><d2l-selection-input label="item 1" key="key1" skeleton></d2l-selection-input></d2l-test-selection>` },
			{ name: 'selected-focus', template: selectedTemplate, action: focusElem },
			{ name: 'selected-click', template: selectedTemplate, action: clickElem },
			{ name: 'selected-click-radio-toggle', template: selectedRadioToggleTemplate, action: clickElem },
			{ name: 'selected-space-radio-toggle', template: selectedRadioToggleTemplate, action: elem => sendKeysElem(elem, 'press', 'Space') },
		].forEach(({ name, template, action }) => {
			it(name, async() => {
				const elem = await fixture(template);
				const input = elem.querySelector('d2l-selection-input');
				if (action) await action(input);
				await expect(input).to.be.golden();
			});
		});
	});

	describe('select all', () => {
		const defaultTemplate = html`<d2l-test-selection><d2l-selection-select-all ></d2l-selection-select-all></d2l-test-selection>`;

		[
			{ name: 'default', template: defaultTemplate },
			{ name: 'disabled', template: html`<d2l-test-selection><d2l-selection-select-all disabled></d2l-selection-select-all></d2l-test-selection>` },
			{ name: 'focus', template: defaultTemplate, action: focusElem },
			{ name: 'none-selected', template: defaultTemplate, action: elem => elem.selectionInfo = { state: 'none', keys: [] } },
			{ name: 'some-selected', template: defaultTemplate, action: elem => elem.selectionInfo = { state: 'some', keys: [] } },
			{ name: 'all-selected', template: defaultTemplate, action: elem => elem.selectionInfo = { state: 'all', keys: [] } }
		].forEach(({ name, template, action }) => {
			it(name, async() => {
				const elem = await fixture(template);
				const selectAll = elem.querySelector('d2l-selection-select-all');
				if (action) await action(selectAll);
				await expect(selectAll).to.be.golden();
			});
		});
	});

	describe('select-all-pages', () => {
		function createSelectionTemplate(numInputs, selected) {
			return html`
				<d2l-test-selection item-count="50">
					<d2l-selection-summary></d2l-selection-summary>
					<d2l-selection-select-all-pages></d2l-selection-select-all-pages>
					${createInputList(numInputs, selected)}
				</d2l-test-selection>
			`;
		}

		[
			{ name: 'none-selected', template: createSelectionTemplate(3, [false, false, false]) },
			{ name: 'some-selected', template: createSelectionTemplate(3, [true, true, false]) },
			{ name: 'all-selected', template: createSelectionTemplate(3, [true, true, true]) },
			{ name: 'select-all-pages', template: createSelectionTemplate(3, [true, true, true]), action: elem => clickElem(elem.querySelector('d2l-selection-select-all-pages')) },
			{ name: 'add-item', template: createSelectionTemplate(3, [true, true, true]), action: async(elem) => {
				await clickElem(elem.querySelector('d2l-selection-select-all-pages'));
				const item = document.createElement('li');
				const input = document.createElement('d2l-selection-input');
				input.key = 'key4';
				input.label = 'Item 4';
				input.style.marginRight = '10px';
				item.appendChild(input);
				item.appendChild(document.createTextNode('Item 4'));
				elem.querySelector('ul').appendChild(item);
			} },
			{ name: 'unselect-item', template: createSelectionTemplate(4, [true, true, true, true]), action: elem => clickElem(elem.querySelector('d2l-selection-input')) }
		].forEach(({ name, template, action }) => {
			it(name, async() => {
				const elem = await fixture(template, { viewport });
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('summary', () => {
		[
			{ name: 'none-selected' },
			{ name: 'some-selected', action: elem => elem.selectionInfo = { state: 'some', keys: ['1', '2', '3'] } },
			{ name: 'all-selected', action: elem => elem.selectionInfo = { state: 'all', keys: ['1', '2', '3', '4'] } },
			{ name: 'no-selection-text', noSelectionText: 'custom no selection text' },
			{ name: 'no-selection-text-selected', noSelectionText: 'custom no selection text', action: elem => elem.selectionInfo = { state: 'some', keys: ['1', '2', '3'] } }
		].forEach(({ name, noSelectionText, action }) => {
			it(name, async() => {
				const elem = await fixture(html`<d2l-selection-summary no-selection-text="${ifDefined(noSelectionText)}"></d2l-selection-summary>`);
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});
});

describe('selection-mixin', () => {
	function createTemplate(opts) {
		const { external, singleSelection, selected } = { external: false, singleSelection: false, selected: [false, false, false], ...opts };
		return html`
			<div>
				${external ? html`
					<div style="align-items: center; display: flex;">
						<div style="flex: auto;">
							<d2l-selection-select-all selection-for="selection"></d2l-selection-select-all>
							<d2l-selection-action selection-for="selection" text="Action 1" icon="tier1:bookmark-hollow" requires-selection></d2l-selection-action>
							<d2l-selection-action selection-for="selection" text="Action 2" icon="tier1:gear"></d2l-selection-action>
						</div>
						<d2l-selection-summary selection-for="selection" style="flex: none;"></d2l-selection-summary>
					</div>
				` : nothing}
				<d2l-test-selection id="selection" ?selection-single="${singleSelection}">
					${ !external ? html`
						<div style="align-items: center; display: flex;">
							<div style="flex: auto;">
								<d2l-selection-select-all></d2l-selection-select-all>
								<d2l-selection-action text="Action 1" icon="tier1:bookmark-hollow" requires-selection></d2l-selection-action>
								<d2l-selection-action text="Action 2" icon="tier1:gear"></d2l-selection-action>
								<d2l-selection-action-dropdown text="Dropdown 1" requires-selection></d2l-selection-action-dropdown>
								<d2l-selection-action-dropdown text="Dropdown 2"></d2l-selection-action-dropdown>
							</div>
							<d2l-selection-summary style="flex: none;"></d2l-selection-summary>
						</div>
					` : nothing}
					${createInputList(3, selected)}
				</d2l-test-selection>
			</div>
		`;
	}

	[true, false].forEach((external) => {
		[
			{ name: 'multiple-none-selected', template: createTemplate({ external }) },
			{ name: 'multiple-some-selected', template: createTemplate({ selected: [false, true, false], external }) },
			{ name: 'multiple-all-selected', template: createTemplate({ selected: [true, true, true], external }) },
			{ name: 'multiple-select-all', template: createTemplate({ external }), action: elem => clickElem(elem.querySelector('d2l-selection-select-all')) },
			{ name: 'multiple-select-none', template: createTemplate({ selected: [true, true, true], external }), action: elem => clickElem(elem.querySelector('d2l-selection-select-all')) },
			{ name: 'multiple-select-all-from-some', template: createTemplate({ selected: [false, true, false], external }), action: elem => clickElem(elem.querySelector('d2l-selection-select-all')) },
			{ name: 'single-none-selected', template: createTemplate({ singleSelection: true, external }) },
			{ name: 'single-one-selected', template: createTemplate({ singleSelection: true, selected: [false, true, false], external }) },
			{ name: 'single-select', template: createTemplate({ singleSelection: true, external }), action: elem => elem.querySelector('[key="key1"]').selected = true }
		].forEach(({ name, template, action }) => {
			it(`${external ? 'external-' : ''}${name}`, async() => {
				const elem = await fixture(template, { viewport: external ? viewport : { width: 676 } });
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});

	[
		{ name: 'single-right-arrow', action: elem => sendKeysElem(elem, 'press', 'ArrowRight') },
		{ name: 'single-left-arrow', action: elem => sendKeysElem(elem, 'press', 'ArrowLeft') },
		{ name: 'single-right-arrow-rtl', rtl: true, action: elem => sendKeysElem(elem, 'press', 'ArrowRight') },
		{ name: 'single-left-arrow-rtl', rtl: true, action: elem => sendKeysElem(elem, 'press', 'ArrowLeft') },
		{ name: 'single-down-arrow', action: elem => sendKeysElem(elem, 'press', 'ArrowDown') },
		{ name: 'single-up-arrow', action: elem => sendKeysElem(elem, 'press', 'ArrowUp') },
		{ name: 'single-down-arrow-no-keyup-behavior', action: elem => sendKeysElem(elem, 'press', 'ArrowDown'), noKeyUpBehavior: true },
		{ name: 'single-up-arrow-no-keyup-behavior', action: elem => sendKeysElem(elem, 'press', 'ArrowUp'), noKeyUpBehavior: true },
		{ name: 'single-wrap-first', selected: [false, false, true], action: elem => sendKeysElem(elem, 'press', 'ArrowDown') },
		{ name: 'single-wrap-last', selected: [true, false, false], action: elem => sendKeysElem(elem, 'press', 'ArrowUp') }
	].forEach(({ name, rtl, selected, action, noKeyUpBehavior }) => {
		it(name, async() => {
			const elem = await fixture(html`<d2l-test-selection selection-single ?selection-no-input-arrow-key-behavior="${noKeyUpBehavior}">${createInputList(3, selected || [false, true, false])}</d2l-test-selection>`, { rtl, viewport });
			const input = elem.querySelector('d2l-selection-input[selected]');
			if (action) await action(input);
			await expect(elem).to.be.golden();
		});
	});
});

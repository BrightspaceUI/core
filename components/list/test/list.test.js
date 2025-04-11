import '../../button/button.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-button.js';
import '../list-item-content.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
import { listSelectionStates } from '../list.js';

const clickItemInput = async item => {
	const selectionInput = item.shadowRoot.querySelector('d2l-selection-input');
	const inputCheckbox = selectionInput.shadowRoot.querySelector('d2l-input-checkbox');
	const input = inputCheckbox.shadowRoot.querySelector('input');
	return clickElem(input);
};

const expectSelectionInfo = (list, nested, state, keys) => {
	const info = list.getSelectionInfo(nested);
	expect(info.state).to.equal(state);
	expect(JSON.stringify(info.keys)).to.equal(JSON.stringify(keys));
};

describe('d2l-list', () => {

	describe('constructor', () => {

		it('should construct list', () => {
			runConstructor('d2l-list');
		});

	});

	describe('label', () => {

		it('should set aria-label on list when label is defined', async() => {
			const elem = await fixture(html`<d2l-list label="Test Label"></d2l-list>`);
			const list = elem.shadowRoot.querySelector('[role="list"]');
			expect(list.getAttribute('aria-label')).to.equal('Test Label');
		});

		it('should not set aria-label on list when label is not defined', async() => {
			const elem = await fixture(html`<d2l-list></d2l-list>`);
			const list = elem.shadowRoot.querySelector('[role="list"]');
			expect(list.hasAttribute('aria-label')).to.be.false;
		});

		it('should not set aria-label on nested lists', async() => {
			const elem = await fixture(html`
					<d2l-list id="L1" grid>
						<d2l-list-item label="item">
							<d2l-list id="L2" slot="nested" grid label="Test Label">
								<d2l-list-item label="item"></d2l-list-item>
							</d2l-list>
						</d2l-list-item>
					</d2l-list>
				`);
			const nestedList = elem.querySelector('#L2').shadowRoot.querySelector('[role="application"]');
			expect(nestedList.hasAttribute('aria-label')).to.be.false;
		});

	});

	describe('navigation', () => {

		[
			{ keyPress: 'ArrowUp' },
			{ keyPress: 'ArrowDown' }
		].forEach(testCase => {
			it(`Focus stays inside the list when in grid mode after "${testCase.keyPress}" is pressed`, async() => {
				const elem = await fixture(html`
					<div>
						<d2l-list id="L1">
							<d2l-list-item selectable key="L1-1" label="L1-1"></d2l-list-item>
						</d2l-list>
						<d2l-list id="L2" grid>
							<d2l-list-item key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item selectable key="L2-2" label="L2-2"></d2l-list-item>
							<d2l-list-item key="L2-3" label="L2-3"></d2l-list-item>
						</d2l-list>
						<d2l-list id="L3">
							<d2l-list-item selectable key="L3-1" label="L3-1"></d2l-list-item>
						</d2l-list>
					</div>
				`);

				const listItem = elem.querySelector('[key="L2-2"]');

				await sendKeysElem(listItem, 'down', testCase.keyPress);

				expect(elem.querySelector('[_focusing]')).to.equal(listItem);
			});
		});

		[
			{ name: 'Previous', keyPress: 'ArrowUp', initialFocus: 'L1-2' },
			{ name: 'Next', keyPress: 'ArrowDown', initialFocus: 'L2-2' }
		].forEach(({ name, keyPress, initialFocus }) => {
			it(`Focus navigates to ${name.toLowerCase()} list items when in grid mode after "${keyPress}" is pressed`, async() => {
				const elem = await fixture(html`
					<d2l-list id="L1" grid>
						<d2l-list-item selectable key="L1-1" label="item">
							<d2l-list id="L2" slot="nested" grid>
								<d2l-list-item key="L2-1" label="item"></d2l-list-item>
								<d2l-list-item selectable key="L2-2" label="item">
									<d2l-list id="L3" slot="nested" grid>
										<d2l-list-item key="L3-1" label="item"></d2l-list-item>
										<d2l-list-item selectable key="L3-2" label="item"></d2l-list-item>
										<d2l-list-item key="L3-3" label="item"></d2l-list-item>
									</d2l-list>
								</d2l-list-item>
							</d2l-list>
						</d2l-list-item>
						<d2l-list-item selectable key="L1-2" label="item"></d2l-list-item>
					</d2l-list>
				`);

				const listItem = elem.querySelector(`[key="${initialFocus}"]`);
				listItem.focus();

				await sendKeysElem(listItem, 'down', keyPress);

				expect(document.activeElement).to.equal(elem.querySelector('[key="L3-2'));
			});
		});

		it('Focus does not move to list controls when up arrow is pressed in grid mode', async() => {
			const elem = await fixture(html`
				 <d2l-list grid>
					<d2l-list-controls slot="controls"></d2l-list-controls>
					<d2l-list-item key="L1-1" label="L1-1"></d2l-list-item>
					<d2l-list-item selectable key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);

			const listItem = elem.querySelector('[key="L1-2"]');

			await sendKeysElem(listItem, 'down', 'ArrowUp');
			const focusedElement = elem.querySelector('[_focusing]');

			expect(focusedElement).to.equal(listItem);
		});

	});

	describe('flat', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable key="L1-1" label="L1-1"></d2l-list-item>
					<d2l-list-item selectable key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
		});

		it('dispatches d2l-list-selection-changes event when selectable item is clicked', async() => {
			clickItemInput(elem.querySelector('[key="L1-1"]'));
			const e = await oneEvent(elem, 'd2l-list-selection-changes');
			expect(e.detail.length).to.equal(1);
		});

		it('dispatches d2l-list-selection-changes event with batched changes', async() => {
			clickItemInput(elem.querySelector('[key="L1-1"]'));
			clickItemInput(elem.querySelector('[key="L1-2"]'));
			const e = await oneEvent(elem, 'd2l-list-selection-changes');
			expect(e.detail.length).to.equal(2);
		});

		it('getSelectedListItems returns empty array when no items selected', async() => {
			expect(elem.getSelectedListItems().length).to.equal(0);
		});

		it('getSelectedListItems returns array including selected items', async() => {
			clickItemInput(elem.querySelector('[key="L1-1"]'));
			await oneEvent(elem, 'd2l-list-selection-changes');
			expect(elem.getSelectedListItems().length).to.equal(1);
		});

		it('dispatches d2l-list-add-button-click event when add button clicked', async() => {
			const el = await fixture(html`<d2l-list add-button><d2l-list-item label="item" key="L1-1"></d2l-list-item></d2l-list>`);
			const item = el.querySelector('d2l-list-item');
			clickElem(item.shadowRoot.querySelector('d2l-button-add'));
			const e = await oneEvent(el, 'd2l-list-add-button-click');
			expect(e.detail.key).to.equal('L1-1');
			expect(e.detail.position).to.equal('before');
		});

		it('dispatches d2l-list-item-add-button-click event when second add button on first item clicked', async() => {
			const el = await fixture(html`
				<d2l-list add-button>
					<d2l-list-item label="item" key="L1-1"></d2l-list-item>
					<d2l-list-item label="item 2" key="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			const item = el.querySelector('d2l-list-item');
			clickElem(item.shadowRoot.querySelectorAll('d2l-button-add')[1]);
			const e = await oneEvent(el, 'd2l-list-add-button-click');
			expect(e.detail.key).to.equal('L1-1');
			expect(e.detail.position).to.equal('after');
		});

		it('dispatches d2l-list-item-add-button-click event when add button on second item clicked', async() => {
			const el = await fixture(html`
				<d2l-list add-button>
					<d2l-list-item label="item" key="L1-1"></d2l-list-item>
					<d2l-list-item label="item 2" key="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			const item = el.querySelectorAll('d2l-list-item')[1];
			clickElem(item.shadowRoot.querySelector('d2l-button-add'));
			const e = await oneEvent(el, 'd2l-list-add-button-click');
			expect(e.detail.key).to.equal('L1-2');
			expect(e.detail.position).to.equal('after');
		});

		it('getSelectionInfo returns state:notSet and no keys when there are no selectables', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item key="L1-1" label="L1-1"></d2l-list-item>
					<d2l-list-item key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.notSet, []);
		});

		it('getSelectionInfo returns state:none and no keys', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable key="L1-1" label="L1-1"></d2l-list-item>
					<d2l-list-item selectable key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.none, []);
		});

		it('getSelectionInfo returns state:some with selected keys', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable selected key="L1-1" label="L1-1"></d2l-list-item>
					<d2l-list-item selectable key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.some, ['L1-1']);
		});

		it('getSelectionInfo returns state:all with selected keys', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable selected key="L1-1" label="L1-1"></d2l-list-item>
					<d2l-list-item selectable selected key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.all, ['L1-1', 'L1-2']);
		});

	});

	describe('nested', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable key="L1-1" label="L1-1">
						<d2l-list slot="nested">
							<d2l-list-item selectable key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item selectable key="L2-2" label="L2-2"></d2l-list-item>
							<d2l-list-item selectable selection-disabled key="L2-3" label="L2-3"></d2l-list-item>
						</d2l-list>
					</d2l-list-item>
				</d2l-list>
			`);
		});

		it('dispatches d2l-list-selection-changes event when selectable leaf item is clicked', async() => {
			clickItemInput(elem.querySelector('[key="L2-1"]'));
			const e = await oneEvent(elem, 'd2l-list-selection-changes');
			expect(e.detail.length).to.equal(1);
		});

		it('dispatches d2l-list-selection-changes event with batched changes when leaf items clicked', async() => {
			clickItemInput(elem.querySelector('[key="L2-1"]'));
			clickItemInput(elem.querySelector('[key="L2-2"]'));
			const e = await oneEvent(elem, 'd2l-list-selection-changes');
			expect(e.detail.length).to.equal(2);
		});

		it('dispatches d2l-list-selection-changes event with batched changes when root item clicked', async() => {
			clickItemInput(elem.querySelector('[key="L1-1"]'));
			const e = await oneEvent(elem, 'd2l-list-selection-changes');
			expect(e.detail.length).to.equal(4);
		});

		it('getSelectedListItems returns empty array when no items selected', async() => {
			expect(elem.getSelectedListItems().length).to.equal(0);
		});

		it('getSelectedListItems returns array with root selected items only', async() => {
			elem.querySelector('[key="L2-3"]').selected = true;
			clickItemInput(elem.querySelector('[key="L1-1"]'));
			await oneEvent(elem, 'd2l-list-selection-changes');
			expect(elem.getSelectedListItems().length).to.equal(1);
		});

		it('getSelectedListItems returns array including nested selectable items', async() => {
			elem.querySelector('[key="L2-3"]').selected = true;
			clickItemInput(elem.querySelector('[key="L1-1"]'));
			await oneEvent(elem, 'd2l-list-selection-changes');
			expect(elem.getSelectedListItems(true).length).to.equal(4);
		});

		it('getSelectedListItems returns array excluding indeterminate items', async() => {
			clickItemInput(elem.querySelector('[key="L2-1"]'));
			clickItemInput(elem.querySelector('[key="L2-2"]'));
			clickItemInput(elem.querySelector('[key="L2-3"]'));
			await oneEvent(elem, 'd2l-list-selection-changes');
			expect(elem.getSelectedListItems(true).length).to.equal(2);
		});

		it('getSelectionInfo returns correct state when no items are selected', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable key="L1-1" label="L1-1">
						<d2l-list slot="nested">
							<d2l-list-item selectable key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item selectable key="L2-2" label="L2-2"></d2l-list-item>
						</d2l-list>
					</d2l-list-item>
					<d2l-list-item selectable key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.none, []);
			expectSelectionInfo(list, true, listSelectionStates.none, []);
			expectSelectionInfo(list.querySelector('d2l-list'), false, listSelectionStates.none, []);
		});

		it('getSelectionInfo returns correct state when some items selected', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable key="L1-1" label="L1-1">
						<d2l-list slot="nested">
							<d2l-list-item selectable key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item selectable key="L2-2" label="L2-2"></d2l-list-item>
						</d2l-list>
					</d2l-list-item>
					<d2l-list-item selectable selected key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.some, ['L1-2']);
			expectSelectionInfo(list, true, listSelectionStates.some, ['L1-2']);
			expectSelectionInfo(list.querySelector('d2l-list'), false, listSelectionStates.none, []);
		});

		it('getSelectionInfo returns correct state when subtree selected but siblings are not', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable selected key="L1-1" label="L1-1">
						<d2l-list slot="nested">
							<d2l-list-item selectable selected key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item selectable selected key="L2-2" label="L2-2"></d2l-list-item>
						</d2l-list>
					</d2l-list-item>
					<d2l-list-item selectable key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.some, ['L1-1']);
			expectSelectionInfo(list, true, listSelectionStates.some, ['L1-1', 'L2-1', 'L2-2']);
			expectSelectionInfo(list.querySelector('d2l-list'), false, listSelectionStates.all, ['L2-1', 'L2-2']);
		});

		it('getSelectionInfo returns correct state when all items are selected', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable selected key="L1-1" label="L1-1">
						<d2l-list slot="nested">
							<d2l-list-item selectable selected key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item selectable selected key="L2-2" label="L2-2"></d2l-list-item>
						</d2l-list>
					</d2l-list-item>
					<d2l-list-item selectable selected key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.all, ['L1-1', 'L1-2']);
			expectSelectionInfo(list, true, listSelectionStates.all, ['L1-1', 'L1-2', 'L2-1', 'L2-2']);
			expectSelectionInfo(list.querySelector('d2l-list'), false, listSelectionStates.all, ['L2-1', 'L2-2']);
		});

		it('getSelectionInfo returns correct state when root list is not selectable and no nested items are selected', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item key="L1-1" label="L1-1">
						<d2l-list slot="nested">
							<d2l-list-item selectable key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item selectable key="L2-2" label="L2-2"></d2l-list-item>
						</d2l-list>
					</d2l-list-item>
					<d2l-list-item key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.notSet, []);
			expectSelectionInfo(list, true, listSelectionStates.none, []);
			expectSelectionInfo(list.querySelector('d2l-list'), false, listSelectionStates.none, []);
		});

		it('getSelectionInfo returns correct state when root list is not selectable and some nested items are selected', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item key="L1-1" label="L1-1">
						<d2l-list slot="nested">
							<d2l-list-item selectable selected key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item selectable key="L2-2" label="L2-2"></d2l-list-item>
						</d2l-list>
					</d2l-list-item>
					<d2l-list-item key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.notSet, []);
			expectSelectionInfo(list, true, listSelectionStates.some, ['L2-1']);
			expectSelectionInfo(list.querySelector('d2l-list'), false, listSelectionStates.some, ['L2-1']);
		});

		it('getSelectionInfo returns correct state when root list is not selectable and all nested items are selected', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item key="L1-1" label="L1-1">
						<d2l-list slot="nested">
							<d2l-list-item selectable selected key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item selectable selected key="L2-2" label="L2-2"></d2l-list-item>
						</d2l-list>
					</d2l-list-item>
					<d2l-list-item key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.notSet, []);
			expectSelectionInfo(list, true, listSelectionStates.all, ['L2-1', 'L2-2']);
			expectSelectionInfo(list.querySelector('d2l-list'), false, listSelectionStates.all, ['L2-1', 'L2-2']);
		});

		it('getSelectionInfo returns correct state when no root items are selected and nested list is not selectable', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable key="L1-1" label="L1-1">
						<d2l-list slot="nested">
							<d2l-list-item key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item key="L2-2" label="L2-2"></d2l-list-item>
						</d2l-list>
					</d2l-list-item>
					<d2l-list-item selectable key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.none, []);
			expectSelectionInfo(list, true, listSelectionStates.none, []);
			expectSelectionInfo(list.querySelector('d2l-list'), false, listSelectionStates.notSet, []);
		});

		it('getSelectionInfo returns correct state when some root items are selected and nested list is not selectable', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable selected key="L1-1" label="L1-1">
						<d2l-list slot="nested">
							<d2l-list-item key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item key="L2-2" label="L2-2"></d2l-list-item>
						</d2l-list>
					</d2l-list-item>
					<d2l-list-item selectable key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.some, ['L1-1']);
			expectSelectionInfo(list, true, listSelectionStates.some, ['L1-1']);
			expectSelectionInfo(list.querySelector('d2l-list'), false, listSelectionStates.notSet, []);
		});

		it('getSelectionInfo returns correct state when all root items are selected and nested list is not selectable', async() => {
			const list = await fixture(html`
				<d2l-list>
					<d2l-list-item selectable selected key="L1-1" label="L1-1">
						<d2l-list slot="nested">
							<d2l-list-item key="L2-1" label="L2-1"></d2l-list-item>
							<d2l-list-item key="L2-2" label="L2-2"></d2l-list-item>
						</d2l-list>
					</d2l-list-item>
					<d2l-list-item selectable selected key="L1-2" label="L1-2"></d2l-list-item>
				</d2l-list>
			`);
			expectSelectionInfo(list, false, listSelectionStates.all, ['L1-1', 'L1-2']);
			expectSelectionInfo(list, true, listSelectionStates.all, ['L1-1', 'L1-2']);
			expectSelectionInfo(list.querySelector('d2l-list'), false, listSelectionStates.notSet, []);
		});

	});

});

describe('d2l-list-controls', () => {

	it('should construct', () => {
		runConstructor('d2l-list-controls');
	});

	it('should override default SelectionControls label', async() => {
		const el = await fixture(html`<d2l-list-controls></d2l-list-controls>`);
		const section = el.shadowRoot.querySelector('section');
		expect(section.getAttribute('aria-label')).to.equal('Actions for list');
	});

});

describe('d2l-list-item', () => {

	describe('constructor', () => {

		it('should construct list-item', () => {
			runConstructor('d2l-list-item');
		});

	});

	it('has clickable drag arrows', async() => {
		const list = await fixture(html`
		<d2l-list>
			<d2l-list-item draggable key="1">Item 1</d2l-list-item>
			<d2l-list-item draggable key="2">Item 2</d2l-list-item>
		</d2l-list>`);

		const item = list.children[0];
		expect(item.innerText).to.equal('Item 1');
		const handle = item.shadowRoot.querySelector('d2l-list-item-drag-handle');
		let handleRealClicks = 0;
		handle.addEventListener('click', () => ++handleRealClicks);
		await clickElem(handle.shadowRoot.querySelector('button')); // focus drag handle
		expect(handleRealClicks).to.equal(0);
		await clickElem(handle.shadowRoot.querySelector('button')); // enable keyboard mode
		const downArrow = handle.shadowRoot.querySelector('d2l-button-move').shadowRoot.querySelector('.down-layer');
		expect(downArrow).to.exist;
		clickElem(downArrow);
		await oneEvent(item, 'd2l-list-item-position-change');
		expect(handleRealClicks).to.equal(0);
	});

	describe('events', () => {

		it('dispatches d2l-list-item-link-click event when clicked', async() => {
			const el = await fixture(html`<d2l-list-item action-href="javascript:void(0)" label="item"></d2l-list-item>`);
			clickElem(el.shadowRoot.querySelector('a'));
			await oneEvent(el, 'd2l-list-item-link-click');
		});

		it('dispatches d2l-list-item-link-click event when clicked with interactive content', async() => {
			const el = await fixture(html`
				<d2l-list-item action-href="javascript:void(0)" label="item">
					<div>Item 1</div>
					<div slot="secondary"><d2l-button>Button</d2l-button></div>
				</d2l-list-item>`);
			clickElem(el.shadowRoot.querySelector('a'));
			await oneEvent(el, 'd2l-list-item-link-click');
		});

		it('dispatches d2l-list-item-link-click event when non-interactive content clicked', async() => {
			const el = await fixture(html`
				<d2l-list-item action-href="javascript:void(0)" label="item">
					<div>Item 1</div>
					<div slot="secondary"><d2l-button>Button</d2l-button></div>
				</d2l-list-item>`);
			clickElem(el.querySelector('div'));
			await oneEvent(el, 'd2l-list-item-link-click');
		});

		it('does not dispatch d2l-list-item-link-click event interactive content clicked', async() => {
			let dispatched = false;
			const el = await fixture(html`
				<d2l-list-item action-href="javascript:void(0)" label="item">
					<div>Item 1</div>
					<div slot="secondary"><d2l-button>Button</d2l-button></div>
				</d2l-list-item>`);

			el.addEventListener('d2l-list-item-link-click', () => dispatched = true);
			await clickElem(el.querySelector('d2l-button'));
			expect(dispatched).to.equal(false);
		});
	});

});

describe('d2l-list-item-button', () => {

	describe('constructor', () => {

		it('should construct list-item-button', () => {
			runConstructor('d2l-list-item-button');
		});

	});

	describe('events', () => {

		it('dispatches d2l-list-item-button-click event when clicked', async() => {
			const el = await fixture(html`<d2l-list-item-button label="item"></d2l-list-item-button>`);
			clickElem(el.shadowRoot.querySelector('button'));
			await oneEvent(el, 'd2l-list-item-button-click');
		});

		it('dispatches d2l-list-item-button-click event when clicked with interactive content', async() => {
			const el = await fixture(html`
				<d2l-list-item-button label="item">
					<div>Item 1</div>
					<div slot="secondary"><d2l-button>Button</d2l-button></div>
				</d2l-list-item-button>`);
			clickElem(el.shadowRoot.querySelector('button'));
			await oneEvent(el, 'd2l-list-item-button-click');
		});

		it('dispatches d2l-list-item-button-click event when non-interactive content clicked', async() => {
			const el = await fixture(html`
				<d2l-list-item-button label="item">
					<div>Item 1</div>
					<div slot="secondary"><d2l-button>Button</d2l-button></div>
				</d2l-list-item-button>`);
			clickElem(el.querySelector('div'));
			await oneEvent(el, 'd2l-list-item-button-click');
		});

		it('does not dispatch d2l-list-item-button-click event interactive content clicked', async() => {
			let dispatched = false;
			const el = await fixture(html`
				<d2l-list-item-button label="item">
					<div>Item 1</div>
					<div slot="secondary"><d2l-button>Button</d2l-button></div>
				</d2l-list-item-button>`);
			el.addEventListener('d2l-list-item-button-click', () => dispatched = true);
			await clickElem(el.querySelector('d2l-button'));
			expect(dispatched).to.equal(false);
		});

		it('dispatches d2l-list-item-add-button-click event when first add button clicked', async() => {
			const el = await fixture(html`<d2l-list add-button><d2l-list-item label="item"></d2l-list-item></d2l-list>`);
			const item = el.querySelector('d2l-list-item');
			clickElem(item.shadowRoot.querySelector('d2l-button-add'));
			const e = await oneEvent(item, 'd2l-list-item-add-button-click');
			expect(e.detail.position).to.equal('before');
		});

		it('dispatches d2l-list-item-add-button-click event when second add button on first item clicked', async() => {
			const el = await fixture(html`
				<d2l-list add-button>
					<d2l-list-item label="item"></d2l-list-item>
					<d2l-list-item label="item 2"></d2l-list-item>
				</d2l-list>
			`);
			const item = el.querySelector('d2l-list-item');
			clickElem(item.shadowRoot.querySelectorAll('d2l-button-add')[1]);
			const e = await oneEvent(item, 'd2l-list-item-add-button-click');
			expect(e.detail.position).to.equal('after');
		});

		it('dispatches d2l-list-item-add-button-click event when add button on second item clicked', async() => {
			const el = await fixture(html`
				<d2l-list add-button>
					<d2l-list-item label="item"></d2l-list-item>
					<d2l-list-item label="item 2"></d2l-list-item>
				</d2l-list>
			`);
			const item = el.querySelectorAll('d2l-list-item')[1];
			clickElem(item.shadowRoot.querySelector('d2l-button-add'));
			const e = await oneEvent(item, 'd2l-list-item-add-button-click');
			expect(e.detail.position).to.equal('after');
		});

	});

});

describe('d2l-list-item-content', () => {

	describe('constructor', () => {

		it('should construct list-item-content', () => {
			runConstructor('d2l-list-item-content');
		});

	});

});

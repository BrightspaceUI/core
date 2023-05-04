import '../list.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-button.js';
import '../list-item-content.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const keyCodes = Object.freeze({
	UP: { name: 'up arrow', key: 'ArrowUp' },
	DOWN: { name: 'down arrow', cokeyde: 'ArrowDown' }
});

const selectionInputRendering = async item => {
	return new Promise(resolve => {
		const intervalId = setInterval(() => {
			const selectionInput = item.shadowRoot.querySelector('d2l-selection-input');
			const inputCheckbox = selectionInput.shadowRoot.querySelector('d2l-input-checkbox');
			if (inputCheckbox) {
				clearInterval(intervalId);
				resolve();
			}
		}, 10);
	});
};

const clickItemInput = async item => {
	await selectionInputRendering(item);
	const selectionInput = item.shadowRoot.querySelector('d2l-selection-input');
	const inputCheckbox = selectionInput.shadowRoot.querySelector('d2l-input-checkbox');
	const input = inputCheckbox.shadowRoot.querySelector('input');
	input.click();
};

describe('d2l-list', () => {

	describe('constructor', () => {

		it('should construct list', () => {
			runConstructor('d2l-list');
		});

	});

	describe('navigation', () => {

		[
			{ keyPress: keyCodes.UP },
			{ keyPress: keyCodes.DOWN }
		].forEach(testCase => {
			it(`Focus stays inside the list when in grid mode after ${testCase.keyPress.name} is pressed`, async() => {
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
				await elem.updateComplete;
				await elem.querySelector('#L1').updateComplete;
				await elem.querySelector('#L2').updateComplete;
				await elem.querySelector('#L3').updateComplete;
				await elem.querySelector('[key="L1-1"]').updateComplete;
				await elem.querySelector('[key="L2-1"]').updateComplete;
				await elem.querySelector('[key="L2-2"]').updateComplete;
				await elem.querySelector('[key="L2-3"]').updateComplete;
				await elem.querySelector('[key="L3-1"]').updateComplete;
				await new Promise(resolve => requestAnimationFrame(resolve));  // US143322: Needed by Firefox

				const listItem = elem.querySelector('[key="L2-2"]');
				const listItemLayout = elem.querySelector('[key="L2-2"]').shadowRoot.querySelector('d2l-list-item-generic-layout');
				listItem.focus();

				const event = new KeyboardEvent('keydown', { key: testCase.keyPress.key });
				setTimeout(() => listItemLayout.dispatchEvent(event));
				await oneEvent(listItemLayout, 'keydown');
				expect(listItem.hasAttribute('_focusing')).to.be.true;
			});
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
			await elem.updateComplete;
			await elem.querySelector('[key="L1-1"]').updateComplete;
			await elem.querySelector('[key="L1-2"]').updateComplete;
			await new Promise(resolve => requestAnimationFrame(resolve));  // US143322: Needed by Firefox
		});

		it('dispatches d2l-list-selection-changes event when selectable item is clicked', async() => {
			setTimeout(() => clickItemInput(elem.querySelector('[key="L1-1"]')));
			const e = await oneEvent(elem, 'd2l-list-selection-changes');
			expect(e.detail.length).to.equal(1);
		});

		it('dispatches d2l-list-selection-changes event with batched changes', async() => {
			setTimeout(() => {
				clickItemInput(elem.querySelector('[key="L1-1"]'));
				clickItemInput(elem.querySelector('[key="L1-2"]'));
			});
			const e = await oneEvent(elem, 'd2l-list-selection-changes');
			expect(e.detail.length).to.equal(2);
		});

		it('getSelectedListItems returns empty array when no items selected', async() => {
			expect(elem.getSelectedListItems().length).to.equal(0);
		});

		it('getSelectedListItems returns array including selected items', async() => {
			setTimeout(() => clickItemInput(elem.querySelector('[key="L1-1"]')));
			await oneEvent(elem, 'd2l-list-selection-changes');
			expect(elem.getSelectedListItems().length).to.equal(1);
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
						</d2l-list>
					</d2l-list-item>
				</d2l-list>
			`);
			await elem.updateComplete;
			await elem.querySelector('[key="L1-1"]').updateComplete;
			await elem.querySelector('[slot="nested"]').updateComplete;
			await elem.querySelector('[key="L2-1"]').updateComplete;
			await elem.querySelector('[key="L2-2"]').updateComplete;
			await new Promise(resolve => requestAnimationFrame(resolve)); // US143322: Needed by Firefox
		});

		it('dispatches d2l-list-selection-changes event when selectable leaf item is clicked', async() => {
			setTimeout(() => clickItemInput(elem.querySelector('[key="L2-1"]')));
			const e = await oneEvent(elem, 'd2l-list-selection-changes');
			expect(e.detail.length).to.equal(1);
		});

		it('dispatches d2l-list-selection-changes event with batched changes when leaf items clicked', async() => {
			setTimeout(() => {
				clickItemInput(elem.querySelector('[key="L2-1"]'));
				clickItemInput(elem.querySelector('[key="L2-2"]'));
			});
			const e = await oneEvent(elem, 'd2l-list-selection-changes');
			expect(e.detail.length).to.equal(3);
		});

		it('dispatches d2l-list-selection-changes event with batched changes when root item clicked', async() => {
			setTimeout(() => clickItemInput(elem.querySelector('[key="L1-1"]')));
			const e = await oneEvent(elem, 'd2l-list-selection-changes');
			expect(e.detail.length).to.equal(3);
		});

		it('getSelectedListItems returns empty array when no items selected', async() => {
			expect(elem.getSelectedListItems().length).to.equal(0);
		});

		it('getSelectedListItems returns array with root selected items only', async() => {
			setTimeout(() => clickItemInput(elem.querySelector('[key="L1-1"]')));
			await oneEvent(elem, 'd2l-list-selection-changes');
			expect(elem.getSelectedListItems().length).to.equal(1);
		});

		it('getSelectedListItems returns array including nested selected items', async() => {
			setTimeout(() => clickItemInput(elem.querySelector('[key="L1-1"]')));
			await oneEvent(elem, 'd2l-list-selection-changes');
			expect(elem.getSelectedListItems(true).length).to.equal(3);
		});

		it('getSelectedListItems returns array excluding indeterminate items', async() => {
			setTimeout(() => clickItemInput(elem.querySelector('[key="L2-1"]')));
			await oneEvent(elem, 'd2l-list-selection-changes');
			expect(elem.getSelectedListItems(true).length).to.equal(1);
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

});

describe('d2l-list-item-button', () => {

	describe('constructor', () => {

		it('should construct list-item-button', () => {
			runConstructor('d2l-list-item-button');
		});

	});

	describe('events', () => {

		it('dispatches d2l-list-item-link-click event when clicked', async() => {
			const el = await fixture(html`<d2l-list-item action-href="javascript:void(0)"></d2l-list-item>`);
			setTimeout(() => el.shadowRoot.querySelector('a').click());
			await oneEvent(el, 'd2l-list-item-link-click');
		});

		it('dispatches d2l-list-item-button-click event when clicked', async() => {
			const el = await fixture(html`<d2l-list-item-button></d2l-list-item-button>`);
			setTimeout(() => el.shadowRoot.querySelector('button').click());
			await oneEvent(el, 'd2l-list-item-button-click');
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

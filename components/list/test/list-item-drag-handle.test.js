import { DOWN, END, ENTER, ESC, HOME, LEFT, RIGHT, SPACE, TAB, UP } from '../../../helpers/keyCodes.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { dragActions } from '../list-item-drag-handle.js';

describe('ListItemDragHandle', () => {

	describe('Events to activate keyboard mode', () => {
		let element;
		beforeEach(async() => {
			element = await fixture(html`<d2l-list-item-drag-handle></d2l-list-item-drag-handle>`);
			element.focus();
		});

		it(`Expect ${dragActions.active} event results when clicked`, async() => {
			let action;
			element.addEventListener('d2l-list-item-drag-handle-action', (e) => action = e.detail.action);
			const actionArea = element.shadowRoot.querySelector('button');
			setTimeout(() => {
				actionArea.dispatchEvent(new Event('click'));
			});
			await oneEvent(actionArea, 'click');

			expect(action).to.equal(dragActions.active);
		});

		[
			{ keyPress: ENTER },
			{ keyPress: SPACE },
			{ keyPress: LEFT }
		].forEach(testCase => {
			it(`Expect event response ${dragActions.active} from keycode ${testCase.keyPress}`, async() => {
				let action;
				element.addEventListener('d2l-list-item-drag-handle-action', (e) => action = e.detail.action);
				const actionArea = element.shadowRoot.querySelector('button');
				setTimeout(() => {
					actionArea.dispatchEvent(new KeyboardEvent('keyup', {key: testCase.keyPress, shiftKey: !!testCase.shift}));
				});
				await oneEvent(actionArea, 'keyup');

				expect(action).to.equal(dragActions.active);
			});
		});
	});

	describe('Events in keyboard mode', () => {
		let element;
		beforeEach(async() => {
			element = await fixture(html`<d2l-list-item-drag-handle></d2l-list-item-drag-handle>`);
			element.focus();
			const actionArea = element.shadowRoot.querySelector('button');
			setTimeout(() => {
				actionArea.dispatchEvent(new Event('click'));
			});
			await oneEvent(actionArea, 'click');
			await element.updateComplete;
		});

		[
			{keyPress: UP, result: dragActions.up},
			{keyPress: DOWN, result: dragActions.down},
			{keyPress: HOME, result: dragActions.first},
			{keyPress: END, result: dragActions.last},
			{keyPress: TAB, result: dragActions.previousElement, shift: true},
			{keyPress: TAB, result: dragActions.nextElement},
			{keyPress: ESC, result: dragActions.cancel},
			{keyPress: ENTER, result: dragActions.save},
			{keyPress: SPACE, result: dragActions.save},
			{keyPress: RIGHT, result: dragActions.save}
		].forEach(testCase => {
			it(`Expect event response ${testCase.result} from keycode ${testCase.keyPress}`, async() => {
				let action;
				element.addEventListener('d2l-list-item-drag-handle-action', (e) => action = e.detail.action);
				const actionArea = element.shadowRoot.querySelector('button');
				setTimeout(() => {
					actionArea.dispatchEvent(new KeyboardEvent('keyup', {key: testCase.keyPress, shiftKey: !!testCase.shift}));
				});
				await oneEvent(actionArea, 'keyup');

				expect(action).to.equal(testCase.result);
			});
		});

		it(`Expect event response ${dragActions.save} on blur`, async() => {
			let action;
			element.addEventListener('d2l-list-item-drag-handle-action', (e) => action = e.detail.action);
			const actionArea = element.shadowRoot.querySelector('button');
			setTimeout(() => {
				actionArea.dispatchEvent(new Event('blur'));
			});
			await oneEvent(actionArea, 'blur');

			expect(action).to.equal(dragActions.save);
		});
	});
});

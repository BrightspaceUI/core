import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { dragActions } from '../list-item-drag-handle.js';

const keyCodes = Object.freeze({
	END: 35,
	HOME: 36,
	UP: 38,
	DOWN: 40,
	SPACE: 32,
	ENTER: 13,
	ESC: 27,
	TAB: 9,
	LEFT: 37,
	RIGHT: 39,

});

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
			{ keyPress: keyCodes.ENTER },
			{ keyPress: keyCodes.SPACE },
			{ keyPress: keyCodes.LEFT }
		].forEach(testCase => {
			it(`Expect event response ${dragActions.active} from keycode ${testCase.keyPress}`, async() => {
				let action;
				element.addEventListener('d2l-list-item-drag-handle-action', (e) => action = e.detail.action);
				const actionArea = element.shadowRoot.querySelector('button');
				setTimeout(() => {
					actionArea.dispatchEvent(new KeyboardEvent('keydown', {keyCode: testCase.keyPress, shiftKey: !!testCase.shift}));
				});
				await oneEvent(actionArea, 'keydown');

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
		});

		[
			{keyPress: keyCodes.UP, result: dragActions.up},
			{keyPress: keyCodes.DOWN, result: dragActions.down},
			{keyPress: keyCodes.HOME, result: dragActions.first},
			{keyPress: keyCodes.END, result: dragActions.last},
			{keyPress: keyCodes.TAB, result: dragActions.previousElement, shift: true},
			{keyPress: keyCodes.TAB, result: dragActions.nextElement},
			{keyPress: keyCodes.ESC, result: dragActions.cancel},
			{keyPress: keyCodes.ENTER, result: dragActions.save},
			{keyPress: keyCodes.SPACE, result: dragActions.save},
			{keyPress: keyCodes.RIGHT, result: dragActions.save}
		].forEach(testCase => {
			it(`Expect event response ${testCase.result} from keycode ${testCase.keyPress}`, async() => {
				let action;
				element.addEventListener('d2l-list-item-drag-handle-action', (e) => action = e.detail.action);
				const actionArea = element.shadowRoot.querySelector('button');
				setTimeout(() => {
					actionArea.dispatchEvent(new KeyboardEvent('keydown', {keyCode: testCase.keyPress, shiftKey: !!testCase.shift}));
				});
				await oneEvent(actionArea, 'keydown');

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

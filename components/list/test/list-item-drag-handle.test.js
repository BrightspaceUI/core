import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { dragActions } from '../list-item-drag-handle.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const keyCodes = Object.freeze({
	END: { key: 'end', code: 35 },
	HOME: { key: 'home', code: 36 },
	UP: { key: 'up arrow', code: 38 },
	DOWN: { key: 'down arrow', code: 40 },
	SPACE: { key: 'space', code: 32 },
	ENTER: { key: 'enter', code: 13 },
	ESC: { key: 'escape', code: 27 },
	TAB: { key: 'tab', code: 9 },
	LEFT: { key: 'left arrow', code: 37 },
	RIGHT: { key: 'right arrow', code: 39 }
});

describe('ListItemDragHandle', () => {

	it('should construct d2l-list-item-drag-handle', () => {
		runConstructor('d2l-list-item-drag-handle');
	});

	describe('Events to activate keyboard mode.', () => {
		let element;
		beforeEach(async() => {
			element = await fixture(html`<d2l-list-item-drag-handle></d2l-list-item-drag-handle>`);
			element.focus();
		});

		it(`Dispatch drag handle action event for ${dragActions.active} event when clicked.`, async() => {
			const actionArea = element.shadowRoot.querySelector('button');
			setTimeout(() => actionArea.dispatchEvent(new Event('click')));
			const e = await oneEvent(element, 'd2l-list-item-drag-handle-action');
			expect(e.detail.action).to.equal(dragActions.active);
		});

		[
			{ keyPress: keyCodes.ENTER },
			{ keyPress: keyCodes.SPACE }
		].forEach(testCase => {
			it(`Dispatch drag handle action event for ${dragActions.active} when ${testCase.keyPress.key} is pressed.`, async() => {
				const actionArea = element.shadowRoot.querySelector('button');
				setTimeout(() => dispatchKeyEvent(actionArea, testCase.keyPress.code));
				const e = await oneEvent(element, 'd2l-list-item-drag-handle-action');
				expect(e.detail.action).to.equal(dragActions.active);
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
			{ keyPress: keyCodes.UP, result: dragActions.up },
			{ keyPress: keyCodes.DOWN, result: dragActions.down },
			{ keyPress: keyCodes.HOME, result: dragActions.first },
			{ keyPress: keyCodes.END, result: dragActions.last },
			{ keyPress: keyCodes.RIGHT, result: dragActions.nest },
			{ keyPress: keyCodes.LEFT, result: dragActions.unnest }
		].forEach(testCase => {
			it(`Dispatch drag handle action event for ${testCase.result} when ${testCase.keyPress.key} is pressed.`, async() => {
				const actionArea = element.shadowRoot.querySelector('d2l-button-move').shadowRoot.querySelector('button');
				setTimeout(() => dispatchKeyEvent(actionArea, testCase.keyPress.code, !!testCase.shift));
				const e = await oneEvent(element, 'd2l-list-item-drag-handle-action');
				expect(e.detail.action).to.equal(testCase.result);
			});
		});

		[
			{ keyPress: keyCodes.TAB, result: dragActions.previousElement, shift: true },
			{ keyPress: keyCodes.TAB, result: dragActions.nextElement },
			{ keyPress: keyCodes.ESC, result: dragActions.cancel },
			{ keyPress: keyCodes.ENTER, result: dragActions.save },
			{ keyPress: keyCodes.SPACE, result: dragActions.save }
		].forEach(testCase => {
			it(`Dispatch drag handle action event for ${testCase.result} when ${testCase.keyPress.key} is pressed.`, async() => {
				const actionArea = element.shadowRoot.querySelector('d2l-button-move');
				setTimeout(() => dispatchKeyEvent(actionArea, testCase.keyPress.code, !!testCase.shift));
				const e = await oneEvent(element, 'd2l-list-item-drag-handle-action');
				expect(e.detail.action).to.equal(testCase.result);
			});
		});

		it(`Dispatch drag handle action event for ${dragActions.save} when element is focus out.`, async() => {
			const actionArea = element.shadowRoot.querySelector('d2l-button-move');
			setTimeout(() => actionArea.dispatchEvent(new Event('focusout')));
			const e = await oneEvent(element, 'd2l-list-item-drag-handle-action');
			expect(e.detail.action).to.equal(dragActions.save);

		});
	});

	function dispatchKeyEvent(el, key, shiftKey = false) {
		const eventObj = document.createEvent('Events');
		eventObj.initEvent('keydown', true, true);
		eventObj.which = key;
		eventObj.keyCode = key;
		eventObj.shiftKey = shiftKey;
		el.dispatchEvent(eventObj);
	}

});

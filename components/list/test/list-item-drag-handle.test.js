import { clickElem, expect, fixture, focusElem, html, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
import { dragActions } from '../list-item-drag-handle.js';

describe('ListItemDragHandle', () => {

	it('should construct d2l-list-item-drag-handle', () => {
		runConstructor('d2l-list-item-drag-handle');
	});

	describe('Events to activate keyboard mode.', () => {
		let element;
		beforeEach(async() => {
			element = await fixture(html`<d2l-list-item-drag-handle></d2l-list-item-drag-handle>`);
			await focusElem(element);
		});

		it(`Dispatch drag handle action event for ${dragActions.active} event when clicked.`, async() => {
			const actionArea = element.shadowRoot.querySelector('button');
			setTimeout(() => clickElem(actionArea));
			const e = await oneEvent(element, 'd2l-list-item-drag-handle-action');
			expect(e.detail.action).to.equal(dragActions.active);
		});

		[
			{ keyPress: 'Enter' },
			{ keyPress: ' ' }
		].forEach(testCase => {
			it(`Dispatch drag handle action event for "${dragActions.active}" when "${testCase.keyPress}" is pressed.`, async() => {
				const actionArea = element.shadowRoot.querySelector('button');
				setTimeout(() => dispatchKeyEvent(actionArea, testCase.keyPress));
				const e = await oneEvent(element, 'd2l-list-item-drag-handle-action');
				expect(e.detail.action).to.equal(dragActions.active);
			});
		});
	});

	describe('Events in keyboard mode', () => {

		let element;
		beforeEach(async() => {
			element = await fixture(html`<d2l-list-item-drag-handle></d2l-list-item-drag-handle>`);
			element.activateKeyboardMode();
			await element.updateComplete;
		});

		[
			{ keyPress: 'ArrowUp', result: dragActions.up },
			{ keyPress: 'ArrowDown', result: dragActions.down },
			{ keyPress: 'Home', result: dragActions.first },
			{ keyPress: 'End', result: dragActions.last },
			{ keyPress: 'ArrowRight', result: dragActions.nest },
			{ keyPress: 'ArrowLeft', result: dragActions.unnest }
		].forEach(testCase => {
			it(`Dispatch drag handle action event for "${testCase.result}" when "${testCase.keyPress}" is pressed.`, async() => {
				const actionArea = element.shadowRoot.querySelector('d2l-button-move').shadowRoot.querySelector('button');
				setTimeout(() => dispatchKeyEvent(actionArea, testCase.keyPress));
				const e = await oneEvent(element, 'd2l-list-item-drag-handle-action');
				expect(e.detail.action).to.equal(testCase.result);
			});
		});

		[
			{ keyPress: 'Tab', result: dragActions.previousElement, shift: true },
			{ keyPress: 'Tab', result: dragActions.nextElement },
			{ keyPress: 'Escape', result: dragActions.cancel },
			{ keyPress: 'Enter', result: dragActions.save },
			{ keyPress: ' ', result: dragActions.save }
		].forEach(testCase => {
			it(`Dispatch drag handle action event for "${testCase.result}" when "${testCase.keyPress}" is pressed.`, async() => {
				const actionArea = element.shadowRoot.querySelector('d2l-button-move');
				setTimeout(() => dispatchKeyEvent(actionArea, testCase.keyPress, !!testCase.shift));
				const e = await oneEvent(element, 'd2l-list-item-drag-handle-action');
				expect(e.detail.action).to.equal(testCase.result);
			});
		});

		it(`Dispatch drag handle action event for "${dragActions.save}" when element is focus out.`, async() => {
			const actionArea = element.shadowRoot.querySelector('d2l-button-move');
			setTimeout(() => actionArea.dispatchEvent(new Event('focusout')));
			const e = await oneEvent(element, 'd2l-list-item-drag-handle-action');
			expect(e.detail.action).to.equal(dragActions.save);

		});
	});

	async function dispatchKeyEvent(el, key, shiftKey = false) {
		if (shiftKey) {
			await sendKeysElem(el, 'press', `Shift+${key}`);
		} else {
			await sendKeysElem(el, 'press', key);
		}
	}

});

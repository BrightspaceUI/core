import { expect, fixture, html, oneEvent, sendKeysElem } from '@brightspace-ui/testing';
import { moveActions } from '../button-move.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-button-move', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-move');
		});

	});

	describe('events', () => {

		[
			{ name: 'up icon clicked', action: el => el.shadowRoot.querySelector('.up-layer').click(), expectedAction: moveActions.up },
			{ name: 'down icon clicked', action: el => el.shadowRoot.querySelector('.down-layer').click(), expectedAction: moveActions.down },
			{ name: 'up key pressed', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'ArrowUp'), expectedAction: moveActions.up },
			{ name: 'down key pressed', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'ArrowDown'), expectedAction: moveActions.down },
			{ name: 'left key pressed', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'ArrowLeft'), expectedAction: moveActions.left },
			{ name: 'right key pressed', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'ArrowRight'), expectedAction: moveActions.right },
			{ name: 'home key pressed', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'Home'), expectedAction: moveActions.home },
			{ name: 'ctrl-home key pressed', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'Control+Home'), expectedAction: moveActions.rootHome },
			{ name: 'end key pressed', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'End'), expectedAction: moveActions.end },
			{ name: 'ctrl-end key pressed', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'Control+End'), expectedAction: moveActions.rootEnd }
		].forEach(info => {
			it(`dispatches d2l-button-move-action event when ${info.name}`, async() => {
				const el = await fixture(html`<d2l-button-move text="Reorder"></d2l-button-move>`);
				setTimeout(() => info.action(el));
				const e = await oneEvent(el, 'd2l-button-move-action');
				expect(e.detail.action).to.equal(info.expectedAction);
			});
		});

	});

});

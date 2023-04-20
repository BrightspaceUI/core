import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { keyDown } from '../../../tools/dom-test-helpers.js';
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
			{ name: 'up key pressed', action: el => keyDown(el.shadowRoot.querySelector('button'), 38), expectedAction: moveActions.up },
			{ name: 'down key pressed', action: el => keyDown(el.shadowRoot.querySelector('button'), 40), expectedAction: moveActions.down },
			{ name: 'left key pressed', action: el => keyDown(el.shadowRoot.querySelector('button'), 37), expectedAction: moveActions.left },
			{ name: 'right key pressed', action: el => keyDown(el.shadowRoot.querySelector('button'), 39), expectedAction: moveActions.right },
			{ name: 'home key pressed', action: el => keyDown(el.shadowRoot.querySelector('button'), 36), expectedAction: moveActions.home },
			{ name: 'ctrl-home key pressed', action: el => keyDown(el.shadowRoot.querySelector('button'), 36, true), expectedAction: moveActions.rootHome },
			{ name: 'end key pressed', action: el => keyDown(el.shadowRoot.querySelector('button'), 35), expectedAction: moveActions.end },
			{ name: 'ctrl-end key pressed', action: el => keyDown(el.shadowRoot.querySelector('button'), 35, true), expectedAction: moveActions.rootEnd }
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

import { aTimeout, clickElem, expect, fixture, html, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
import { moveActions } from '../button-move.js';

describe('d2l-button-move', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-move');
		});

	});

	describe('events', () => {

		[
			{ name: 'up icon clicked', action: el => clickElem(el.shadowRoot.querySelector('.up-layer')), expectedAction: moveActions.up },
			{ name: 'down icon clicked', action: el => clickElem(el.shadowRoot.querySelector('.down-layer')), expectedAction: moveActions.down },
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
				info.action(el);
				const e = await oneEvent(el, 'd2l-button-move-action');
				expect(e.detail.action).to.equal(info.expectedAction);
			});
		});

		it('does not bubble events', async() => {
			const el = await fixture(html`<div><d2l-button-move text="Reorder"></d2l-button-move></div>`);
			const button = el.querySelector('d2l-button-move');
			let bubbledEvent = false;
			el.addEventListener('d2l-button-move-action', () => bubbledEvent = true);
			await clickElem(button.shadowRoot.querySelector('.up-layer'));
			expect(bubbledEvent).to.be.false;
		});

	});

	describe('disabled states prevent events', () => {

		[
			{ name: 'disabled-up prevents up click', disabledProp: 'disabledUp', action: el => clickElem(el.shadowRoot.querySelector('.up-layer')) },
			{ name: 'disabled-down prevents down click', disabledProp: 'disabledDown', action: el => clickElem(el.shadowRoot.querySelector('.down-layer')) },
			{ name: 'disabled-up prevents up key', disabledProp: 'disabledUp', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'ArrowUp') },
			{ name: 'disabled-down prevents down key', disabledProp: 'disabledDown', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'ArrowDown') },
			{ name: 'disabled-left prevents left key', disabledProp: 'disabledLeft', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'ArrowLeft') },
			{ name: 'disabled-right prevents right key', disabledProp: 'disabledRight', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'ArrowRight') },
			{ name: 'disabled-home prevents home key', disabledProp: 'disabledHome', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'Home') },
			{ name: 'disabled-home prevents ctrl-home key', disabledProp: 'disabledHome', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'Control+Home') },
			{ name: 'disabled-end prevents end key', disabledProp: 'disabledEnd', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'End') },
			{ name: 'disabled-end prevents ctrl-end key', disabledProp: 'disabledEnd', action: el => sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'Control+End') }
		].forEach(info => {
			it(`${info.name}`, async() => {
				const el = await fixture(html`<d2l-button-move text="Reorder"></d2l-button-move>`);
				el[info.disabledProp] = true;
				await el.updateComplete;
				let eventDispatched = false;
				el.addEventListener('d2l-button-move-action', () => eventDispatched = true);
				await info.action(el);
				await aTimeout(50); // wait to ensure event is not dispatched
				expect(eventDispatched).to.be.false;
			});
		});

	});

	describe('properties', () => {

		it('button is disabled when all directions are disabled', async() => {
			const el = await fixture(html`<d2l-button-move text="Reorder" disabled-up disabled-down disabled-left disabled-right disabled-home disabled-end></d2l-button-move>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.disabled).to.be.true;
		});

		it('button is not disabled when only some directions are disabled', async() => {
			const el = await fixture(html`<d2l-button-move text="Reorder" disabled-up disabled-down></d2l-button-move>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.disabled).to.be.false;
		});

	});

	describe('focus', () => {

		it('focus() method focuses the button', async() => {
			const el = await fixture(html`<d2l-button-move text="Reorder"></d2l-button-move>`);
			el.focus();
			const button = el.shadowRoot.querySelector('button');
			expect(document.activeElement).to.equal(el);
			expect(el.shadowRoot.activeElement).to.equal(button);
		});

		it('autofocus property focuses button on render', async() => {
			const el = await fixture(html`<d2l-button-move text="Reorder" autofocus></d2l-button-move>`);
			await el.updateComplete;
			const button = el.shadowRoot.querySelector('button');
			expect(button.hasAttribute('autofocus')).to.be.true;
		});

	});

});

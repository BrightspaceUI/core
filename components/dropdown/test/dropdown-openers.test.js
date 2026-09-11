import '../dropdown-button-subtle.js';
import '../dropdown-button.js';
import '../dropdown-context-menu.js';
import '../dropdown-more.js';
import { expect, fixture, focusElem, hoverElem, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { asyncDropdownTag } from './dropdown-fixtures.js';
import { asyncStates } from '../../popover/popover-mixin.js';

describe('d2l-dropdown-openers', () => {

	describe('constructor', () => {

		it('should construct dropdown-button-subtle', () => {
			runConstructor('d2l-dropdown-button-subtle');
		});

		it('should construct dropdown-button', () => {
			runConstructor('d2l-dropdown-button');
		});

		it('should construct dropdown-context-menu', () => {
			runConstructor('d2l-dropdown-context-menu');
		});

		it('should construct dropdown-more', () => {
			runConstructor('d2l-dropdown-more');
		});

	});

	describe('events', () => {

		it('should fire "d2l-dropdown-opener-click" event when opener is clicked', async() => {
			const elem = await fixture(html`<d2l-dropdown-button></d2l-dropdown-button>`);
			setTimeout(() => elem.getOpenerElement().dispatchEvent(new MouseEvent('mouseup', { composed: true })));
			await oneEvent(elem, 'd2l-dropdown-opener-click');
		});

		it('should fire "d2l-dropdown-opener-click" event even when no-auto-open is enabled', async() => {
			const elem = await fixture(html`<d2l-dropdown-button no-auto-open></d2l-dropdown-button>`);
			setTimeout(() => elem.getOpenerElement().dispatchEvent(new MouseEvent('mouseup', { composed: true })));
			await oneEvent(elem, 'd2l-dropdown-opener-click');
		});

		it('should fire "d2l-dropdown-opener-click" event when ENTER is pressed', async() => {
			const elem = await fixture(html`<d2l-dropdown-button></d2l-dropdown-button>`);
			setTimeout(() => {
				const event = new CustomEvent('keypress', { composed: true });
				event.keyCode = 13;
				event.code = 13;
				elem.getOpenerElement().dispatchEvent(event);
			});
			await oneEvent(elem, 'd2l-dropdown-opener-click');
		});

	});

	describe('async', () => {
		[
			{ action: 'focus', openerType: 'button', cb: focusElem },
			{ action: 'focus', openerType: 'dropdown-button', cb: focusElem },
			{ action: 'hover', openerType: 'dropdown-button', cb: hoverElem }
		].forEach(({ action, openerType, cb }) => {
			it(`should start loading on "${action}" with opener type "${openerType}"`, async() => {
				const elem = await fixture(`<${asyncDropdownTag} opener-type="${openerType}"></${asyncDropdownTag}>`);
				const contentElem = elem.getContent();
				expect(contentElem._asyncState).to.equal(asyncStates.unloaded);
				await cb(elem.getOpener());
				expect(contentElem._asyncState).to.equal(asyncStates.loading);
			});
		});

	});

	it('should not throw when hovering and content is missing', async() => {
		const elem = await fixture(html`<d2l-dropdown><button class="d2l-dropdown-opener">Open</button></d2l-dropdown>`);
		const opener = elem.querySelector('.d2l-dropdown-opener');
		await hoverElem(opener);
	});

});

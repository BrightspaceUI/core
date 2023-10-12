import '../dropdown-button-subtle.js';
import '../dropdown-button.js';
import '../dropdown-context-menu.js';
import '../dropdown-more.js';
import { fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

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

});

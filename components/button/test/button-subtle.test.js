import '../button-subtle.js';
import { fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-button-subtle', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-subtle');
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
			setTimeout(() => el.click());
			await oneEvent(el, 'click');
		});

	});

});

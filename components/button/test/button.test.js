import '../button.js';
import { fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-button', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button');
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button>Normal Button</d2l-button>`);
			setTimeout(() => el.click());
			await oneEvent(el, 'click');
		});

	});

});

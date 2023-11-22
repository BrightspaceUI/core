import '../button-add.js';
import { clickElem, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-button-add', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-add');
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-add></d2l-button-add>`);
			setTimeout(() => clickElem(el));
			await oneEvent(el, 'click');
		});

	});

});

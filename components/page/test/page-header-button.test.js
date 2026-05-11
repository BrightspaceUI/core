import { fixture, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { pageHeaderButtonFixtures } from './page-header-button-fixtures.js';

describe('d2l-page-header-button', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-page-header-button');
		});
	});

	describe('events', () => {
		it('should trigger click event', async() => {
			const el = await fixture(pageHeaderButtonFixtures.iconText);
			setTimeout(() => el.shadowRoot.querySelector('button').click());
			await oneEvent(el, 'click');
		});
	});

});

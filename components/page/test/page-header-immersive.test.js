import { clickElem, fixture, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getBackLink, pageHeaderImmersiveFixtures } from './page-header-immersive-fixtures.js';

describe('d2l-page-header-immersive', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-page-header-immersive');
		});
	});

	describe('events', () => {

		it('should fire back click event', async() => {
			const elem = await fixture(pageHeaderImmersiveFixtures.backOnly);
			clickElem(getBackLink(elem));
			await oneEvent(elem.querySelector('d2l-page-header-immersive'), 'd2l-page-header-immersive-back-click');
		});

	});

});

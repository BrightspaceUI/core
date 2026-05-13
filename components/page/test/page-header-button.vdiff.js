import { expect, fixture, focusElem, hoverElem, oneEvent } from '@brightspace-ui/testing';
import { pageHeaderButtonFixtures } from './page-header-button-fixtures.js';

describe('d2l-page-header-button', () => {

	[
		{ name: 'icon-text', template: pageHeaderButtonFixtures.iconText },
		{ name: 'disabled', template: pageHeaderButtonFixtures.disabled },
		{ name: 'flip', template: pageHeaderButtonFixtures.flipIcon },
		{ name: 'text-hidden', template: pageHeaderButtonFixtures.textHidden, tooltip: true },
		{ name: 'text-hidden-disabled', template: pageHeaderButtonFixtures.textHiddenDisabled },
	].forEach(({ name, template, tooltip }) => {
		describe(name, () => {

			let elem;
			beforeEach(async() => {
				elem = await fixture(template);
			});

			it('normal', async() => {
				await expect(elem).to.be.golden();
			});

			it('hover', async() => {
				if (tooltip) {
					hoverElem(elem);
					await oneEvent(elem, 'd2l-tooltip-show');
				} else {
					await hoverElem(elem);
				}
				await expect(elem).to.be.golden();
			});

			it('focus', async() => {
				if (tooltip) {
					focusElem(elem);
					await oneEvent(elem, 'd2l-tooltip-show');
				} else {
					await focusElem(elem);
				}
				await expect(elem).to.be.golden();
			});

		});
	});

});

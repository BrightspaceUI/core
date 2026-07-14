import { expect, fixture, focusElem, hoverElem } from '@brightspace-ui/testing';
import { getDivider, pageDividerFixtures } from './page-divider-internal-fixtures.js';

describe('page-divider-internal', () => {

	describe('hover', () => {
		[
			{ name: 'side-nav', divider: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'supporting-immersive', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 550 } });
				await hoverElem(getDivider(elem, test.divider));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('focus', () => {
		[
			{ name: 'side-nav', divider: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeadersFooter },
			{ name: 'side-nav-immersive', divider: 'side-nav', fixture: pageDividerFixtures.sideNavImmersiveFooter },
			{ name: 'side-nav-long-no-scroll', divider: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
			{ name: 'supporting', divider: 'supporting', fixture: pageDividerFixtures.supportingLongFooter },
			{ name: 'supporting-immersive', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveBothHeaders },
			{ name: 'supporting-immersive-long-no-scroll', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMain }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 550 } });
				await focusElem(getDivider(elem, test.divider));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('focus-scrolled', () => {
		[
			{ name: 'main', divider: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
			{ name: 'panel', divider: 'supporting', fixture: pageDividerFixtures.supportingLongFooter },
			{ name: 'immersive-main', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMain },
			{ name: 'immersive-panel', divider: 'side-nav', fixture: pageDividerFixtures.sideNavImmersiveLongFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 550 } });
				await focusElem(getDivider(elem, test.divider));
				window.scrollTo(0, document.body.scrollHeight);
				const panel = elem.shadowRoot.querySelector(`.${test.divider}-panel`);
				panel.scrollTop = panel.scrollHeight;
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('keyboard', () => {
		// TO DO once arrow visuals added
	});

	describe('mouse', () => {
		// TO DO
	});

});

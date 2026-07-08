import { expect, fixture } from '@brightspace-ui/testing';
import { pageFixtures } from './page-fixtures.js';

describe('page', () => {
	describe('layout', () => {
		[
			// Non-sticky header
			{ name: 'short', fixture: pageFixtures.main },
			{ name: 'short-header', fixture: pageFixtures.mainHeader },
			{ name: 'short-footer', fixture: pageFixtures.mainFooter },
			{ name: 'short-header-footer', fixture: pageFixtures.mainHeaderFooter },
			{ name: 'long', fixture: pageFixtures.mainLong },
			{ name: 'long-header', fixture: pageFixtures.mainLongHeader },
			{ name: 'long-footer', fixture: pageFixtures.mainLongFooter },
			{ name: 'long-header-footer', fixture: pageFixtures.mainLongHeaderFooter },

			// With short main panel
			{ name: 'side-nav', fixture: pageFixtures.sideNav },
			{ name: 'side-nav-header', fixture: pageFixtures.sideNavHeader },
			{ name: 'side-nav-footer', fixture: pageFixtures.sideNavFooter },
			{ name: 'side-nav-header-footer', fixture: pageFixtures.sideNavHeaderFooter },
			{ name: 'side-nav-both-headers', fixture: pageFixtures.sideNavBothHeaders },
			{ name: 'side-nav-both-headers-footer', fixture: pageFixtures.sideNavBothHeadersFooter },
			{ name: 'side-nav-long', fixture: pageFixtures.sideNavLong },
			{ name: 'side-nav-long-header', fixture: pageFixtures.sideNavLongHeader },
			{ name: 'side-nav-long-footer', fixture: pageFixtures.sideNavLongFooter },
			{ name: 'side-nav-long-header-footer', fixture: pageFixtures.sideNavLongHeaderFooter },

			// With long main panel
			{ name: 'supporting', fixture: pageFixtures.supporting },
			{ name: 'supporting-header', fixture: pageFixtures.supportingHeader },
			{ name: 'supporting-footer', fixture: pageFixtures.supportingFooter },
			{ name: 'supporting-header-footer', fixture: pageFixtures.supportingHeaderFooter },
			{ name: 'supporting-both-headers', fixture: pageFixtures.supportingBothHeaders },
			{ name: 'supporting-both-headers-footer', fixture: pageFixtures.supportingBothHeadersFooter },
			{ name: 'supporting-long', fixture: pageFixtures.supportingLong },
			{ name: 'supporting-long-header', fixture: pageFixtures.supportingLongHeader },
			{ name: 'supporting-long-footer', fixture: pageFixtures.supportingLongFooter },
			{ name: 'supporting-long-header-footer', fixture: pageFixtures.supportingLongHeaderFooter },
			{ name: 'supporting-long-both-headers', fixture: pageFixtures.supportingLongBothHeaders },
			{ name: 'supporting-long-both-headers-footer', fixture: pageFixtures.supportingLongBothHeadersFooter },

			// Sticky header
			{ name: 'immersive-short', fixture: pageFixtures.mainImmersive },
			{ name: 'immersive-short-header', fixture: pageFixtures.mainImmersiveHeader },
			{ name: 'immersive-short-footer', fixture: pageFixtures.mainImmersiveFooter },
			{ name: 'immersive-short-header-footer', fixture: pageFixtures.mainImmersiveHeaderFooter },
			{ name: 'immersive-long', fixture: pageFixtures.mainImmersiveLong },
			{ name: 'immersive-long-header', fixture: pageFixtures.mainImmersiveLongHeader },
			{ name: 'immersive-long-footer', fixture: pageFixtures.mainImmersiveLongFooter },
			{ name: 'immersive-long-header-footer', fixture: pageFixtures.mainImmersiveLongHeaderFooter },

			// With long main panel
			{ name: 'immersive-side-nav', fixture: pageFixtures.sideNavImmersive },
			{ name: 'immersive-side-nav-header', fixture: pageFixtures.sideNavImmersiveHeader },
			{ name: 'immersive-side-nav-footer', fixture: pageFixtures.sideNavImmersiveFooter },
			{ name: 'immersive-side-nav-header-footer', fixture: pageFixtures.sideNavImmersiveHeaderFooter },
			{ name: 'immersive-side-nav-both-headers', fixture: pageFixtures.sideNavImmersiveBothHeaders },
			{ name: 'immersive-side-nav-both-headers-footer', fixture: pageFixtures.sideNavImmersiveBothHeadersFooter },
			{ name: 'immersive-side-nav-long', fixture: pageFixtures.sideNavImmersiveLong },
			{ name: 'immersive-side-nav-long-header', fixture: pageFixtures.sideNavImmersiveLongHeader },
			{ name: 'immersive-side-nav-long-footer', fixture: pageFixtures.sideNavImmersiveLongFooter },
			{ name: 'immersive-side-nav-long-header-footer', fixture: pageFixtures.sideNavImmersiveLongHeaderFooter },
			{ name: 'immersive-side-nav-long-both-headers', fixture: pageFixtures.sideNavImmersiveLongBothHeaders },
			{ name: 'immersive-side-nav-long-both-headers-footer', fixture: pageFixtures.sideNavImmersiveLongBothHeadersFooter },

			// With short main panel
			{ name: 'immersive-supporting', fixture: pageFixtures.supportingImmersive },
			{ name: 'immersive-supporting-header', fixture: pageFixtures.supportingImmersiveHeader },
			{ name: 'immersive-supporting-footer', fixture: pageFixtures.supportingImmersiveFooter },
			{ name: 'immersive-supporting-header-footer', fixture: pageFixtures.supportingImmersiveHeaderFooter },
			{ name: 'immersive-supporting-both-headers', fixture: pageFixtures.supportingImmersiveBothHeaders },
			{ name: 'immersive-supporting-both-headers-footer', fixture: pageFixtures.supportingImmersiveBothHeadersFooter },
			{ name: 'immersive-supporting-long', fixture: pageFixtures.supportingImmersiveLong },
			{ name: 'immersive-supporting-long-header', fixture: pageFixtures.supportingImmersiveLongHeader },
			{ name: 'immersive-supporting-long-footer', fixture: pageFixtures.supportingImmersiveLongFooter },
			{ name: 'immersive-supporting-long-header-footer', fixture: pageFixtures.supportingImmersiveLongHeaderFooter },
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 550 } });
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		describe('rtl', () => {
			[
				// Non-sticky header
				{ name: 'short-header-footer', fixture: pageFixtures.mainHeaderFooter },
				{ name: 'long-header-footer', fixture: pageFixtures.mainLongHeaderFooter },
				{ name: 'side-nav-both-headers-footer', fixture: pageFixtures.sideNavBothHeadersFooter },
				{ name: 'supporting-both-headers-footer', fixture: pageFixtures.supportingBothHeadersFooter },

				// Sticky header
				{ name: 'immersive-short-header-footer', fixture: pageFixtures.mainImmersiveHeaderFooter },
				{ name: 'immersive-long-header-footer', fixture: pageFixtures.mainImmersiveLongHeaderFooter },
				{ name: 'immersive-side-nav-both-headers-footer', fixture: pageFixtures.sideNavImmersiveBothHeadersFooter },
				{ name: 'immersive-supporting-both-headers-footer', fixture: pageFixtures.supportingImmersiveBothHeadersFooter },
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, { rtl: true, pagePadding: false, viewport: { width: 1300, height: 550 } });
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});
	});

	describe('scroll', () => {

		describe('body', () => {
			const noScroll = [
				// Non-sticky header with short main panel
				{ name: 'short', fixture: pageFixtures.main },
				{ name: 'short-header', fixture: pageFixtures.mainHeader },
				{ name: 'short-footer', fixture: pageFixtures.mainFooter },
				{ name: 'short-header-footer', fixture: pageFixtures.mainHeaderFooter },
				{ name: 'side-nav', fixture: pageFixtures.sideNav },
				{ name: 'side-nav-footer', fixture: pageFixtures.sideNavFooter },
				{ name: 'side-nav-both-headers', fixture: pageFixtures.sideNavBothHeaders },
				{ name: 'side-nav-both-headers-footer', fixture: pageFixtures.sideNavBothHeadersFooter },
				// Sticky header with short main panel
				{ name: 'immersive-short', fixture: pageFixtures.mainImmersive },
				{ name: 'immersive-short-header', fixture: pageFixtures.mainImmersiveHeader },
				{ name: 'immersive-short-footer', fixture: pageFixtures.mainImmersiveFooter },
				{ name: 'immersive-short-header-footer', fixture: pageFixtures.mainImmersiveHeaderFooter },
				{ name: 'immersive-supporting', fixture: pageFixtures.supportingImmersive },
				{ name: 'immersive-supporting-footer', fixture: pageFixtures.supportingImmersiveFooter },
				{ name: 'immersive-supporting-both-headers', fixture: pageFixtures.supportingImmersiveBothHeaders },
				{ name: 'immersive-supporting-both-headers-footer', fixture: pageFixtures.supportingImmersiveBothHeadersFooter },
				{ name: 'immersive-supporting-long-header', fixture: pageFixtures.supportingImmersiveLongHeader },
				{ name: 'immersive-supporting-long-header-footer', fixture: pageFixtures.supportingImmersiveLongHeaderFooter },
			];

			const nonStickyHeaderScrollsAway = [
				// With long main panel
				{ name: 'long', fixture: pageFixtures.mainLong },
				{ name: 'long-header', fixture: pageFixtures.mainLongHeader },
				{ name: 'long-footer', fixture: pageFixtures.mainLongFooter },
				{ name: 'long-header-footer', fixture: pageFixtures.mainLongHeaderFooter },
				{ name: 'supporting', fixture: pageFixtures.supporting },
				{ name: 'supporting-footer', fixture: pageFixtures.supportingFooter },
				{ name: 'supporting-both-headers', fixture: pageFixtures.supportingBothHeaders },
				{ name: 'supporting-both-headers-footer', fixture: pageFixtures.supportingBothHeadersFooter },
				// With long side panel
				{ name: 'side-nav-long', fixture: pageFixtures.sideNavLong },
				{ name: 'side-nav-long-header', fixture: pageFixtures.sideNavLongHeader },
				{ name: 'side-nav-long-footer', fixture: pageFixtures.sideNavLongFooter },
				{ name: 'side-nav-long-header-footer', fixture: pageFixtures.sideNavLongHeaderFooter },
				// With long main and side panel
				{ name: 'supporting-long-header', fixture: pageFixtures.supportingLongHeader },
				{ name: 'supporting-long-header-footer', fixture: pageFixtures.supportingLongHeaderFooter },
			];

			const stickyHeader = [
				// With long main panel
				{ name: 'immersive-long', fixture: pageFixtures.mainImmersiveLong },
				{ name: 'immersive-long-header', fixture: pageFixtures.mainImmersiveLongHeader },
				{ name: 'immersive-long-footer', fixture: pageFixtures.mainImmersiveLongFooter },
				{ name: 'immersive-long-header-footer', fixture: pageFixtures.mainImmersiveLongHeaderFooter },
				{ name: 'immersive-side-nav', fixture: pageFixtures.sideNavImmersive },
				{ name: 'immersive-side-nav-footer', fixture: pageFixtures.sideNavImmersiveFooter },
				{ name: 'immersive-side-nav-both-headers', fixture: pageFixtures.sideNavImmersiveBothHeaders },
				{ name: 'immersive-side-nav-both-headers-footer', fixture: pageFixtures.sideNavImmersiveBothHeadersFooter },
				{ name: 'immersive-side-nav-long-header', fixture: pageFixtures.sideNavImmersiveLongHeader },
				{ name: 'immersive-side-nav-long-header-footer', fixture: pageFixtures.sideNavImmersiveLongHeaderFooter },
			];

			[
				{ name: 'no-scroll', tests: noScroll },
				{ name: 'header-scrolls-away', tests: nonStickyHeaderScrollsAway },
				{ name: 'header-sticks', tests: stickyHeader }
			].forEach(category => {
				describe(category.name, () => {
					category.tests.forEach(test => {
						it(test.name, async() => {
							const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 550 } });
							window.scrollTo(0, document.body.scrollHeight);
							await expect(elem).to.be.golden({ margin: 0 });
						});
					});
				});
			});
		});

		describe('panel', () => {
			const noScrollSideNav = [
				{ name: 'side-nav', fixture: pageFixtures.sideNav },
				{ name: 'side-nav-footer', fixture: pageFixtures.sideNavFooter },
				{ name: 'side-nav-both-headers', fixture: pageFixtures.sideNavBothHeaders },
				{ name: 'side-nav-both-headers-footer', fixture: pageFixtures.sideNavBothHeadersFooter },
				{ name: 'immersive-side-nav', fixture: pageFixtures.sideNavImmersive },
				{ name: 'immersive-side-nav-footer', fixture: pageFixtures.sideNavImmersiveFooter },
				{ name: 'immersive-side-nav-both-headers', fixture: pageFixtures.sideNavImmersiveBothHeaders },
				{ name: 'immersive-side-nav-both-headers-footer', fixture: pageFixtures.sideNavImmersiveBothHeadersFooter },
			];

			const scrollsSideNav = [
				{ name: 'side-nav-long', fixture: pageFixtures.sideNavLong },
				{ name: 'side-nav-long-header', fixture: pageFixtures.sideNavLongHeader },
				{ name: 'side-nav-long-footer', fixture: pageFixtures.sideNavLongFooter },
				{ name: 'side-nav-long-header-footer', fixture: pageFixtures.sideNavLongHeaderFooter },
				{ name: 'immersive-side-nav-long', fixture: pageFixtures.sideNavImmersiveLong },
				{ name: 'immersive-side-nav-long-header', fixture: pageFixtures.sideNavImmersiveLongHeader },
				{ name: 'immersive-side-nav-long-footer', fixture: pageFixtures.sideNavImmersiveLongFooter },
				{ name: 'immersive-side-nav-long-header-footer', fixture: pageFixtures.sideNavImmersiveLongHeaderFooter },
			];

			const noScrollSupporting = [
				{ name: 'supporting', fixture: pageFixtures.supporting },
				{ name: 'supporting-header', fixture: pageFixtures.supportingHeader },
				{ name: 'supporting-footer', fixture: pageFixtures.supportingFooter },
				{ name: 'supporting-header-footer', fixture: pageFixtures.supportingHeaderFooter },
				{ name: 'immersive-supporting', fixture: pageFixtures.supportingImmersive },
				{ name: 'immersive-supporting-header', fixture: pageFixtures.supportingImmersiveHeader },
				{ name: 'immersive-supporting-footer', fixture: pageFixtures.supportingImmersiveFooter },
				{ name: 'immersive-supporting-header-footer', fixture: pageFixtures.supportingImmersiveHeaderFooter },
			];

			const scrollsSupporting = [
				{ name: 'supporting-long', fixture: pageFixtures.supportingLong },
				{ name: 'supporting-long-header', fixture: pageFixtures.supportingLongHeader },
				{ name: 'supporting-long-footer', fixture: pageFixtures.supportingLongFooter },
				{ name: 'supporting-long-header-footer', fixture: pageFixtures.supportingLongHeaderFooter },
				{ name: 'immersive-supporting-long', fixture: pageFixtures.supportingImmersiveLong },
				{ name: 'immersive-supporting-long-header', fixture: pageFixtures.supportingImmersiveLongHeader },
				{ name: 'immersive-supporting-long-footer', fixture: pageFixtures.supportingImmersiveLongFooter },
				{ name: 'immersive-supporting-long-header-footer', fixture: pageFixtures.supportingImmersiveLongHeaderFooter },
			];

			[
				{ name: 'no-scroll', panel: '.side-nav-panel', tests: noScrollSideNav },
				{ name: 'scrolls', panel: '.side-nav-panel', tests: scrollsSideNav },
				{ name: 'no-scroll', panel: '.supporting-panel', tests: noScrollSupporting },
				{ name: 'scrolls', panel: '.supporting-panel', tests: scrollsSupporting },
			].forEach(category => {
				describe(category.name, () => {
					category.tests.forEach(test => {
						it(test.name, async() => {
							const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 550 } });
							const panel = elem.shadowRoot.querySelector(category.panel);
							panel.scrollTop = panel.scrollHeight;
							await expect(elem).to.be.golden({ margin: 0 });
						});
					});
				});
			});
		});

		describe('both', () => {
			const sideNav = [
				{ name: 'immersive-side-nav-long', fixture: pageFixtures.sideNavImmersiveLong },
				{ name: 'immersive-side-nav-long-header', fixture: pageFixtures.sideNavImmersiveLongHeader },
				{ name: 'immersive-side-nav-long-footer', fixture: pageFixtures.sideNavImmersiveLongFooter },
				{ name: 'immersive-side-nav-long-header-footer', fixture: pageFixtures.sideNavImmersiveLongHeaderFooter },
				{ name: 'immersive-side-nav-long-both-headers', fixture: pageFixtures.sideNavImmersiveLongBothHeaders },
				{ name: 'immersive-side-nav-long-both-headers-footer', fixture: pageFixtures.sideNavImmersiveLongBothHeadersFooter },
			];

			const supporting = [
				{ name: 'supporting-long', fixture: pageFixtures.supportingLong },
				{ name: 'supporting-long-header', fixture: pageFixtures.supportingLongHeader },
				{ name: 'supporting-long-footer', fixture: pageFixtures.supportingLongFooter },
				{ name: 'supporting-long-header-footer', fixture: pageFixtures.supportingLongHeaderFooter },
				{ name: 'supporting-long-both-headers', fixture: pageFixtures.supportingLongBothHeaders },
				{ name: 'supporting-long-both-headers-footer', fixture: pageFixtures.supportingLongBothHeadersFooter },
			];

			[
				{ name: 'header-scrolls-away', panel: '.side-nav-panel', tests: sideNav },
				{ name: 'header-sticks', panel: '.supporting-panel', tests: supporting },
			].forEach(category => {
				describe(category.name, () => {
					category.tests.forEach(test => {
						it(test.name, async() => {
							const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 550 } });
							window.scrollTo(0, document.body.scrollHeight);
							const panel = elem.shadowRoot.querySelector(category.panel);
							panel.scrollTop = panel.scrollHeight;
							await expect(elem).to.be.golden({ margin: 0 });
						});
					});
				});
			});
		});
	});

	describe('width-type', () => {
		[
			// Non-sticky header
			{ name: 'normal-short-header-footer', fixture: pageFixtures.mainHeaderFooter },
			{ name: 'normal-long-header-footer', fixture: pageFixtures.mainLongHeaderFooter },
			{ name: 'normal-side-nav-both-headers-footer', fixture: pageFixtures.sideNavBothHeadersFooter },
			{ name: 'normal-supporting-both-headers-footer', fixture: pageFixtures.supportingBothHeadersFooter },
			{ name: 'wide-short-header-footer', fixture: pageFixtures.mainHeaderFooterWide },
			{ name: 'wide-long-header-footer', fixture: pageFixtures.mainLongHeaderFooterWide },
			{ name: 'wide-side-nav-both-headers-footer', fixture: pageFixtures.sideNavBothHeadersFooterWide },
			{ name: 'wide-supporting-both-headers-footer', fixture: pageFixtures.supportingBothHeadersFooterWide },
			{ name: 'fullscreen-short-header-footer', fixture: pageFixtures.mainHeaderFooterFullscreen },
			{ name: 'fullscreen-long-header-footer', fixture: pageFixtures.mainLongHeaderFooterFullscreen },
			{ name: 'fullscreen-side-nav-both-headers-footer', fixture: pageFixtures.sideNavBothHeadersFooterFullscreen },
			{ name: 'fullscreen-supporting-both-headers-footer', fixture: pageFixtures.supportingBothHeadersFooterFullscreen },

			// Sticky header
			{ name: 'normal-immersive-short-header-footer', fixture: pageFixtures.mainImmersiveHeaderFooter },
			{ name: 'normal-immersive-long-header-footer', fixture: pageFixtures.mainImmersiveLongHeaderFooter },
			{ name: 'normal-immersive-side-nav-both-headers-footer', fixture: pageFixtures.sideNavImmersiveBothHeadersFooter },
			{ name: 'normal-immersive-supporting-both-headers-footer', fixture: pageFixtures.supportingImmersiveBothHeadersFooter },
			{ name: 'wide-immersive-short-header-footer', fixture: pageFixtures.mainImmersiveHeaderFooterWide },
			{ name: 'wide-immersive-long-header-footer', fixture: pageFixtures.mainImmersiveLongHeaderFooterWide },
			{ name: 'wide-immersive-side-nav-both-headers-footer', fixture: pageFixtures.sideNavImmersiveBothHeadersFooterWide },
			{ name: 'wide-immersive-supporting-both-headers-footer', fixture: pageFixtures.supportingImmersiveBothHeadersFooterWide },
			{ name: 'fullscreen-immersive-short-header-footer', fixture: pageFixtures.mainImmersiveHeaderFooterFullscreen },
			{ name: 'fullscreen-immersive-long-header-footer', fixture: pageFixtures.mainImmersiveLongHeaderFooterFullscreen },
			{ name: 'fullscreen-immersive-side-nav-both-headers-footer', fixture: pageFixtures.sideNavImmersiveBothHeadersFooterFullscreen },
			{ name: 'fullscreen-immersive-supporting-both-headers-footer', fixture: pageFixtures.supportingImmersiveBothHeadersFooterFullscreen },
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1600, height: 550 } });
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});
});

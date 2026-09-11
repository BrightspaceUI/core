import { addMarkers, clearStoredPanelState, openPanel, pageFixtures, scrollBody, scrollPanel, setStoredPanelState } from './page-fixtures.js';
import { clickElemAt, expect, fixture } from '@brightspace-ui/testing';
import { DIVIDER_GUTTER_WIDTH, MAIN_MIN_WIDTH, PANEL_MIN_WIDTH, SIDE_NAV_DEFAULT_WIDTH, supportingDefaultWidth, supportingOverlayDefaultWidth } from '../page.js';
import { DIVIDER_WIDTH } from '../page-divider-internal.js';

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
							scrollBody();
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
				{ name: 'no-scroll', panel: 'side-nav', tests: noScrollSideNav },
				{ name: 'scrolls', panel: 'side-nav', tests: scrollsSideNav },
				{ name: 'no-scroll', panel: 'supporting', tests: noScrollSupporting },
				{ name: 'scrolls', panel: 'supporting', tests: scrollsSupporting },
			].forEach(category => {
				describe(category.name, () => {
					category.tests.forEach(test => {
						it(test.name, async() => {
							const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 550 } });
							scrollPanel(elem, category.panel);
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
				{ name: 'header-sticks', panel: 'side-nav', tests: sideNav },
				{ name: 'header-scrolls-away', panel: 'supporting', tests: supporting },
			].forEach(category => {
				describe(category.name, () => {
					category.tests.forEach(test => {
						it(test.name, async() => {
							const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 550 } });
							scrollBody();
							scrollPanel(elem, category.panel);
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

	describe('panel', () => {
		afterEach(() => {
			clearStoredPanelState();
		});

		describe('collapsed', () => {
			[
				// Non-sticky header
				{ name: 'normal-side-nav-header', fixture: pageFixtures.sideNavHeaderStorageKey },
				{ name: 'normal-supporting-footer', fixture: pageFixtures.supportingFooterStorageKey },
				{ name: 'wide-side-nav-both-headers-footer', fixture: pageFixtures.sideNavBothHeadersFooterWideStorageKey },
				{ name: 'wide-supporting-both-headers-footer', fixture: pageFixtures.supportingBothHeadersFooterWideStorageKey },
				{ name: 'fullscreen-side-nav-both-headers-footer', fixture: pageFixtures.sideNavBothHeadersFooterFullscreenStorageKey },
				{ name: 'fullscreen-supporting-both-headers-footer', fixture: pageFixtures.supportingBothHeadersFooterFullscreenStorageKey },

				// Sticky header
				{ name: 'normal-immersive-side-nav-header-footer', fixture: pageFixtures.sideNavImmersiveHeaderFooterStorageKey },
				{ name: 'normal-immersive-supporting-both-headers', fixture: pageFixtures.supportingImmersiveBothHeadersStorageKey },
				{ name: 'wide-immersive-side-nav-both-headers-footer', fixture: pageFixtures.sideNavImmersiveBothHeadersFooterWideStorageKey },
				{ name: 'wide-immersive-supporting-both-headers-footer', fixture: pageFixtures.supportingImmersiveBothHeadersFooterWideStorageKey },
				{ name: 'fullscreen-immersive-side-nav-both-headers-footer', fixture: pageFixtures.sideNavImmersiveBothHeadersFooterFullscreenStorageKey },
				{ name: 'fullscreen-immersive-supporting-both-headers-footer', fixture: pageFixtures.supportingImmersiveBothHeadersFooterFullscreenStorageKey },

				// RTL
				{ name: 'rtl-normal-side-nav-header', rtl: true, fixture: pageFixtures.sideNavHeaderStorageKey },
				{ name: 'rtl-normal-supporting-footer', rtl: true, fixture: pageFixtures.supportingFooterStorageKey },
				{ name : 'rtl-normal-immersive-side-nav-header-footer', rtl: true, fixture: pageFixtures.sideNavImmersiveHeaderFooterStorageKey },
				{ name: 'rtl-normal-immersive-supporting-both-headers', rtl: true, fixture: pageFixtures.supportingImmersiveBothHeadersStorageKey },
			].forEach(test => {
				it(test.name, async() => {
					setStoredPanelState({
						'side-nav': { collapsed: true, size: 300 },
						'supporting': { collapsed: true, size: 300 }
					});
					const elem = await fixture(test.fixture, { pagePadding: false, rtl: test.rtl, viewport: { width: 1600, height: 550 } });
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		// Grey marker is default size
		// Blue marker is stored size
		// Green marker is the expected resulting position
		describe('restored', () => {
			const width = 1200;
			const maxPanelSize = width - MAIN_MIN_WIDTH - DIVIDER_WIDTH;
			const minPanelSize = PANEL_MIN_WIDTH;
			const sideNavDefault = SIDE_NAV_DEFAULT_WIDTH;
			const supportingDefault = supportingDefaultWidth(width);

			[
				{ name: 'side-nav-larger', position: 'start', fixture: pageFixtures.sideNavHeaderStorageKey, default: sideNavDefault, stored: 500, expected: 500 },
				{ name: 'side-nav-smaller', position: 'start', fixture: pageFixtures.sideNavHeaderStorageKey, default: sideNavDefault, stored: 325, expected: 325 },
				{ name: 'side-nav-max', position: 'start', fixture: pageFixtures.sideNavHeaderStorageKey, default: sideNavDefault, stored: maxPanelSize + 200, expected: maxPanelSize },
				{ name: 'side-nav-min', position: 'start', fixture: pageFixtures.sideNavHeaderStorageKey, default: sideNavDefault, stored: minPanelSize - 120, expected: minPanelSize },
				{ name: 'rtl-side-nav-larger', rtl: true, position: 'start', fixture: pageFixtures.sideNavHeaderStorageKey, default: sideNavDefault, stored: 500, expected: 500 },

				{ name: 'supporting-larger', position: 'end', fixture: pageFixtures.supportingFooterStorageKey, default: supportingDefault, stored: 500, expected: 500 },
				{ name: 'supporting-smaller', position: 'end', fixture: pageFixtures.supportingFooterStorageKey, default: supportingDefault, stored: 350, expected: 350 },
				{ name: 'supporting-max', position: 'end', fixture: pageFixtures.supportingFooterStorageKey, default: supportingDefault, stored: maxPanelSize + 200, expected: maxPanelSize },
				{ name: 'supporting-min', position: 'end', fixture: pageFixtures.supportingFooterStorageKey, default: supportingDefault, stored: minPanelSize - 120, expected: minPanelSize },
				{ name: 'rtl-supporting-larger', rtl: true, position: 'end', fixture: pageFixtures.supportingFooterStorageKey, default: supportingDefault, stored: 500, expected: 500 },
			].forEach(test => {
				it(test.name, async() => {
					setStoredPanelState({
						'side-nav': { collapsed: false, size: test.stored },
						'supporting': { collapsed: false, size: test.stored }
					});
					const elem = await fixture(test.fixture, { pagePadding: false, rtl: test.rtl, viewport: { width: width, height: 450 } });
					addMarkers(elem, test.position, [
						{ color: 'grey', size: test.default },
						{ color: 'green', size: test.expected },
						...(test.stored !== test.expected ? [{ color: 'blue', size: test.stored }] : [])
					]);
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});
	});

	describe('overlay', () => {
		describe('layout', () => {
			const singlePanel = [
				// Non-sticky header
				{ name: 'short', fixture: pageFixtures.mainHeaderFooter },
				{ name: 'long', fixture: pageFixtures.mainLongHeaderFooter },

				// Sticky header
				{ name: 'immersive-short', fixture: pageFixtures.mainImmersiveHeaderFooter },
				{ name: 'immersive-long', fixture: pageFixtures.mainImmersiveLongHeaderFooter },
			];

			const sideNav = [
				// With short main panel
				{ name: 'side-nav', fixture: pageFixtures.sideNav },
				{ name: 'side-nav-long-header', fixture: pageFixtures.sideNavLongHeader },
				{ name: 'side-nav-footer', fixture: pageFixtures.sideNavFooter },
				{ name: 'side-nav-long-header-footer', fixture: pageFixtures.sideNavLongHeaderFooter },
				{ name: 'side-nav-both-headers', fixture: pageFixtures.sideNavBothHeaders },
				{ name: 'side-nav-both-headers-footer', fixture: pageFixtures.sideNavBothHeadersFooter },

				// With long main panel
				{ name: 'immersive-side-nav', fixture: pageFixtures.sideNavImmersive },
				{ name: 'immersive-side-nav-long-header', fixture: pageFixtures.sideNavImmersiveLongHeader },
				{ name: 'immersive-side-nav-footer', fixture: pageFixtures.sideNavImmersiveFooter },
				{ name: 'immersive-side-nav-long-header-footer', fixture: pageFixtures.sideNavImmersiveLongHeaderFooter },
				{ name: 'immersive-side-nav-both-headers', fixture: pageFixtures.sideNavImmersiveBothHeaders },
				{ name: 'immersive-side-nav-both-headers-footer', fixture: pageFixtures.sideNavImmersiveBothHeadersFooter },
			];

			const supporting = [
				// With long main panel
				{ name: 'supporting', fixture: pageFixtures.supporting },
				{ name: 'supporting-long-header', fixture: pageFixtures.supportingLongHeader },
				{ name: 'supporting-footer', fixture: pageFixtures.supportingFooter },
				{ name: 'supporting-long-header-footer', fixture: pageFixtures.supportingLongHeaderFooter },
				{ name: 'supporting-both-headers', fixture: pageFixtures.supportingBothHeaders },
				{ name: 'supporting-both-headers-footer', fixture: pageFixtures.supportingBothHeadersFooter },

				// With short main panel
				{ name: 'immersive-supporting', fixture: pageFixtures.supportingImmersive },
				{ name: 'immersive-supporting-long-header', fixture: pageFixtures.supportingImmersiveLongHeader },
				{ name: 'immersive-supporting-footer', fixture: pageFixtures.supportingImmersiveFooter },
				{ name: 'immersive-supporting-long-header-footer', fixture: pageFixtures.supportingImmersiveLongHeaderFooter },
				{ name: 'immersive-supporting-both-headers', fixture: pageFixtures.supportingImmersiveBothHeaders },
				{ name: 'immersive-supporting-both-headers-footer', fixture: pageFixtures.supportingImmersiveBothHeadersFooter },
			];

			[
				{ tests: singlePanel },
				{ tests: sideNav, panelKey: 'side-nav-overlay' },
				{ tests: supporting, panelKey: 'supporting-overlay' }
			].forEach(category => {
				category.tests.forEach(test => {
					it(test.name, async() => {
						const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 800, height: 550 } });
						if (category.panelKey) {
							await openPanel(elem, category.panelKey);
						}
						await expect(elem).to.be.golden({ margin: 0 });
					});
				});
			});

			describe('rtl', () => {
				[
					// Non-sticky header
					{ name: 'side-nav-both-headers-footer', panelKey: 'side-nav-overlay', fixture: pageFixtures.sideNavBothHeadersFooter },
					{ name: 'supporting-both-headers-footer', panelKey: 'supporting-overlay', fixture: pageFixtures.supportingBothHeadersFooter },

					// Sticky header
					{ name: 'immersive-side-nav-both-headers-footer', panelKey: 'side-nav-overlay', fixture: pageFixtures.sideNavImmersiveBothHeadersFooter },
					{ name: 'immersive-supporting-both-headers-footer', panelKey: 'supporting-overlay', fixture: pageFixtures.supportingImmersiveBothHeadersFooter },
				].forEach(test => {
					it(test.name, async() => {
						const elem = await fixture(test.fixture, { rtl: true, pagePadding: false, viewport: { width: 800, height: 550 } });
						await openPanel(elem, test.panelKey);
						await expect(elem).to.be.golden({ margin: 0 });
					});
				});
			});
		});

		describe('scroll', () => {

			describe('body', () => {
				const noScroll = [
					// Non-sticky header with short main panel
					{ name: 'short', fixture: pageFixtures.mainHeaderFooter },
					{ name: 'side-nav', panelKey: 'side-nav-overlay', fixture: pageFixtures.sideNavBothHeadersFooter },
					// Sticky header with short main panel
					{ name: 'immersive-short', fixture: pageFixtures.mainImmersiveHeaderFooter },
					{ name: 'immersive-supporting', panelKey: 'supporting-overlay', fixture: pageFixtures.supportingImmersiveBothHeaders },
					{ name: 'immersive-supporting-long', panelKey: 'supporting-overlay', fixture: pageFixtures.supportingImmersiveLongHeaderFooter },
				];

				const nonStickyHeaderScrollsAway = [
					// With long main panel
					{ name: 'long', fixture: pageFixtures.mainLongHeaderFooter },
					{ name: 'supporting', panelKey: 'supporting-overlay', fixture: pageFixtures.supportingBothHeadersFooter },
					// With long side panel
					{ name: 'side-nav-long', panelKey: 'side-nav-overlay', fixture: pageFixtures.sideNavLong },
					{ name: 'side-nav-long-header-footer', panelKey: 'side-nav-overlay', fixture: pageFixtures.sideNavLongHeaderFooter },
					// With long main and side panel
					{ name: 'supporting-long', panelKey: 'supporting-overlay', fixture: pageFixtures.supportingLongHeader },
				];

				const stickyHeader = [
					// With long main panel
					{ name: 'immersive-long', fixture: pageFixtures.mainImmersiveLongHeaderFooter },
					{ name: 'immersive-side-nav', panelKey: 'side-nav-overlay', fixture: pageFixtures.sideNavImmersiveBothHeaders },
					// With long main and side panel
					{ name: 'immersive-side-nav-long', panelKey: 'side-nav-overlay', fixture: pageFixtures.sideNavImmersiveLongHeaderFooter },
				];

				[
					{ name: 'no-scroll', tests: noScroll },
					{ name: 'header-scrolls-away', tests: nonStickyHeaderScrollsAway },
					{ name: 'header-sticks', tests: stickyHeader }
				].forEach(category => {
					describe(category.name, () => {
						category.tests.forEach(test => {
							it(test.name, async() => {
								const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 800, height: 550 } });
								if (test.panelKey) {
									await openPanel(elem, test.panelKey);
								}
								scrollBody();
								await expect(elem).to.be.golden({ margin: 0 });
							});
						});
					});
				});
			});

			describe('panel', () => {
				const noScrollSideNav = [
					{ name: 'side-nav', fixture: pageFixtures.sideNavBothHeadersFooter },
					{ name: 'immersive-side-nav', fixture: pageFixtures.sideNavImmersiveBothHeadersFooter },
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
					{ name: 'supporting', fixture: pageFixtures.supportingHeaderFooter },
					{ name: 'immersive-supporting', fixture: pageFixtures.supportingImmersiveHeaderFooter },
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
					{ name: 'no-scroll', panel: 'side-nav', panelKey: 'side-nav-overlay', tests: noScrollSideNav },
					{ name: 'scrolls', panel: 'side-nav', panelKey: 'side-nav-overlay', tests: scrollsSideNav },
					{ name: 'no-scroll', panel: 'supporting', panelKey: 'supporting-overlay', tests: noScrollSupporting },
					{ name: 'scrolls', panel: 'supporting', panelKey: 'supporting-overlay', tests: scrollsSupporting },
				].forEach(category => {
					describe(category.name, () => {
						category.tests.forEach(test => {
							it(test.name, async() => {
								const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 800, height: 550 } });
								await openPanel(elem, category.panelKey);
								scrollPanel(elem, category.panel);
								await expect(elem).to.be.golden({ margin: 0 });
							});
						});
					});
				});
			});

			describe('both', () => {
				const sideNav = [
					{ name: 'immersive-side-nav-long-footer', fixture: pageFixtures.sideNavImmersiveLongFooter },
					{ name: 'immersive-side-nav-long-header-footer', fixture: pageFixtures.sideNavImmersiveLongHeaderFooter },
					{ name: 'immersive-side-nav-long-both-headers', fixture: pageFixtures.sideNavImmersiveLongBothHeaders },
				];

				const supporting = [
					{ name: 'supporting-long-header', fixture: pageFixtures.supportingLongHeader },
					{ name: 'supporting-long-footer', fixture: pageFixtures.supportingLongFooter },
					{ name: 'supporting-long-both-headers-footer', fixture: pageFixtures.supportingLongBothHeadersFooter },
				];

				[
					{ name: 'header-sticks', panel: 'side-nav', panelKey: 'side-nav-overlay', tests: sideNav },
					{ name: 'header-scrolls-away', panel: 'supporting', panelKey: 'supporting-overlay', tests: supporting },
				].forEach(category => {
					describe(category.name, () => {
						category.tests.forEach(test => {
							it(test.name, async() => {
								const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 800, height: 550 } });
								await openPanel(elem, category.panelKey);
								scrollBody();
								scrollPanel(elem, category.panel);
								await expect(elem).to.be.golden({ margin: 0 });
							});
						});
					});
				});
			});
		});

		describe('panel', () => {
			afterEach(() => {
				clearStoredPanelState();
			});

			describe('collapsed', () => {
				[
					// Non-sticky header
					{ name: 'side-nav-header', fixture: pageFixtures.sideNavHeaderStorageKey },
					{ name: 'supporting-footer', fixture: pageFixtures.supportingFooterStorageKey },

					// Sticky header
					{ name: 'immersive-side-nav-header-footer', fixture: pageFixtures.sideNavImmersiveHeaderFooterStorageKey },
					{ name: 'immersive-supporting-both-headers', fixture: pageFixtures.supportingImmersiveBothHeadersStorageKey },

					// RTL
					{ name: 'rtl-side-nav-header', rtl: true, fixture: pageFixtures.sideNavHeaderStorageKey },
					{ name: 'rtl-supporting-footer', rtl: true, fixture: pageFixtures.supportingFooterStorageKey },
					{ name: 'rtl-immersive-side-nav-header-footer', rtl: true, fixture: pageFixtures.sideNavImmersiveHeaderFooterStorageKey },
					{ name: 'rtl-immersive-supporting-both-headers', rtl: true, fixture: pageFixtures.supportingImmersiveBothHeadersStorageKey },
				].forEach(test => {
					it(test.name, async() => {
						const elem = await fixture(test.fixture, { pagePadding: false, rtl: test.rtl, viewport: { width: 800, height: 550 } });
						await expect(elem).to.be.golden({ margin: 0 });
					});
				});
			});

			// Grey marker is default size
			// Blue marker is stored size
			// Green marker is the expected resulting position
			describe('restored', () => {
				const width = 800;
				const maxPanelSize = width - DIVIDER_WIDTH - DIVIDER_GUTTER_WIDTH;
				const minPanelSize = PANEL_MIN_WIDTH;
				const sideNavDefault = SIDE_NAV_DEFAULT_WIDTH;
				const supportingDefault = supportingOverlayDefaultWidth(width);

				const sideNav = [
					{ name: 'side-nav-larger', stored: 500, expected: 500 },
					{ name: 'side-nav-smaller', stored: 325, expected: 325 },
					{ name: 'side-nav-max', stored: maxPanelSize + 200, expected: maxPanelSize },
					{ name: 'side-nav-min', stored: minPanelSize - 120, expected: minPanelSize },
					{ name: 'rtl-side-nav-larger', rtl: true, stored: 500, expected: 500 },
				];

				const supporting = [
					{ name: 'supporting-larger', stored: 500, expected: 500 },
					{ name: 'supporting-smaller', stored: 350, expected: 350 },
					{ name: 'supporting-max', stored: maxPanelSize + 200, expected: maxPanelSize },
					{ name: 'supporting-min', stored: minPanelSize - 120, expected: minPanelSize },
					{ name: 'rtl-supporting-larger', rtl: true, stored: 500, expected: 500 },
				];

				[
					{ tests: sideNav, panelKey: 'side-nav-overlay', position: 'start', fixture: pageFixtures.sideNavHeaderStorageKey, default: sideNavDefault },
					{ tests: supporting, panelKey: 'supporting-overlay', position: 'end', fixture: pageFixtures.supportingFooterStorageKey, default: supportingDefault },
				].forEach(category => {
					category.tests.forEach(test => {
						it(test.name, async() => {
							setStoredPanelState({
								[category.panelKey]: { collapsed: false, size: test.stored }
							});
							const elem = await fixture(category.fixture, { pagePadding: false, rtl: test.rtl, viewport: { width: width, height: 450 } });
							await openPanel(elem, category.panelKey);
							addMarkers(elem, category.position, [
								{ color: 'grey', size: category.default },
								{ color: 'green', size: test.expected },
								...(test.stored !== test.expected ? [{ color: 'blue', size: test.stored }] : [])
							]);
							await expect(elem).to.be.golden({ margin: 0 });
						});
					});
				});
			});
		});

		describe('scrim click', () => {
			it('closes-side-nav', async() => {
				const elem = await fixture(pageFixtures.sideNavImmersiveBothHeaders, { pagePadding: false, viewport: { width: 450, height: 550 } });
				await openPanel(elem, 'side-nav-overlay');
				await clickElemAt(elem.querySelector('d2l-page-main'), 30, 30);
				await expect(elem).to.be.golden({ margin: 0 });
			});

			it('closes-supporting', async() => {
				const elem = await fixture(pageFixtures.supportingFooter, { pagePadding: false, viewport: { width: 800, height: 550 } });
				await openPanel(elem, 'supporting-overlay');
				await clickElemAt(elem.querySelector('d2l-page-main'), 30, 30);
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('mobile', () => {
		// TO DO
	});
});

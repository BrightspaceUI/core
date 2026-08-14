import { addMarkers, clearStoredPanelState, openPanel, scrollBody, scrollPanel, setStoredPanelState } from './page-fixtures.js';
import { clickElem, expect, fixture, focusElem, hoverElem, nextFrame, sendKeysElem } from '@brightspace-ui/testing';
import { DIVIDER_GUTTER_WIDTH, MAIN_MIN_WIDTH, PANEL_MIN_WIDTH, SIDE_NAV_DEFAULT_WIDTH, supportingDefaultWidth, supportingOverlayDefaultWidth } from '../page.js';
import { DIVIDER_WIDTH, KEYBOARD_STEP, KEYBOARD_STEP_LARGE } from '../page-divider-internal.js';
import { getDivider, getDividerArrow, getSlider, pageDividerFixtures } from './page-divider-internal-fixtures.js';

describe('page-divider-internal', () => {

	describe('hover', () => {
		[
			{ name: 'side-nav', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'supporting-immersive', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				await hoverElem(getDivider(elem, test.panelKey));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		[
			{ name: 'handle-side-nav', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'handle-supporting-immersive', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				const divider = getDivider(elem, test.panelKey);
				await hoverElem(getSlider(divider));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		[
			{ name: 'arrow-start-side-nav', arrow: 'start', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'arrow-end-side-nav', arrow: 'end', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'arrow-start-supporting-immersive', arrow: 'start', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter },
			{ name: 'arrow-end-supporting-immersive', arrow: 'end', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				const divider = getDivider(elem, test.panelKey);
				await focusElem(divider);
				await hoverElem(getDividerArrow(divider, test.arrow));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		[
			{ name: 'arrow-short-viewport', height: 175, arrow: 'start', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'arrow-short-viewport-immersive', height: 200, arrow: 'end', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMain }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: test.height } });
				const header = elem.querySelector('d2l-page-header-custom div');
				if (header) header.style.height = '50px'; // Shorten full header so arrows are on screen
				const divider = getDivider(elem, test.panelKey);
				await focusElem(divider);
				await hoverElem(getDividerArrow(divider, test.arrow));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('hover-collapsed', () => {
		afterEach(() => {
			clearStoredPanelState();
		});

		[
			{ name: 'side-nav', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeadersFooterStorageKey },
			{ name: 'supporting-immersive', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey }
		].forEach(test => {
			it(test.name, async() => {
				setStoredPanelState({ [test.panelKey]: { size: 400, collapsed: true } });
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				await hoverElem(getDivider(elem, test.panelKey));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		[
			{ name: 'handle-side-nav', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeadersFooterStorageKey },
			{ name: 'handle-supporting-immersive', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey }
		].forEach(test => {
			it(test.name, async() => {
				setStoredPanelState({ [test.panelKey]: { size: 400, collapsed: true } });
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				const divider = getDivider(elem, test.panelKey);
				await hoverElem(getSlider(divider));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('focus', () => {
		[
			{ name: 'side-nav', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeadersFooter },
			{ name: 'side-nav-immersive', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavImmersiveFooter },
			{ name: 'side-nav-long-no-scroll', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
			{ name: 'supporting', panelKey: 'supporting', fixture: pageDividerFixtures.supportingLongFooter },
			{ name: 'supporting-immersive', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveBothHeaders },
			{ name: 'supporting-immersive-long-no-scroll', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMain }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				await focusElem(getDivider(elem, test.panelKey));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('focus-scrolled', () => {
		[
			{ name: 'main', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
			{ name: 'panel', panelKey: 'supporting', fixture: pageDividerFixtures.supportingLongFooter },
			{ name: 'immersive-main', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMain },
			{ name: 'immersive-panel', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavImmersiveLongFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				await focusElem(getDivider(elem, test.panelKey));
				scrollBody();
				scrollPanel(elem, test.panelKey);
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('focus-stay-scrolled', () => {
		[
			{ name: 'main', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
			{ name: 'panel', panelKey: 'supporting', fixture: pageDividerFixtures.supportingLongFooter },
			{ name: 'immersive-main', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMain },
			{ name: 'immersive-panel', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavImmersiveLongFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				scrollBody();
				scrollPanel(elem, test.panelKey);
				await focusElem(getDivider(elem, test.panelKey));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('collapse-stay-scrolled', () => {
		[
			{ name: 'main', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
			{ name: 'immersive-main', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMain }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				scrollBody();
				await sendKeysElem(getDivider(elem, test.panelKey), 'press', 'Enter');
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('expand-stay-scrolled', () => {
		[
			{ name: 'panel', panelKey: 'supporting', fixture: pageDividerFixtures.supportingLongFooter },
			{ name: 'both', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainLongFooter },
			{ name: 'immersive-panel', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavImmersiveLongFooter },
			{ name: 'immersive-both', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMainLongBothHeaders },
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				scrollPanel(elem, test.panelKey);
				scrollBody();

				const divider = getDivider(elem, test.panelKey);
				await sendKeysElem(divider, 'press', 'Enter');
				await nextFrame();

				await sendKeysElem(divider, 'press', ' ');
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('expand-not-scrolled', () => {
		[
			{ name: 'panel', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainLongFooter },
			{ name: 'immersive-panel', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMainLongBothHeaders }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				const divider = getDivider(elem, test.panelKey);
				await clickElem(getSlider(divider));
				await nextFrame();

				scrollBody();
				await sendKeysElem(divider, 'press', ' ');
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	// Grey marker is default size
	// Blue marker is requested step size
	// Green marker is the expected resulting position
	describe('keyboard', () => {
		const width = 1250;
		const maxPanelSize = width - MAIN_MIN_WIDTH - DIVIDER_WIDTH;
		const minPanelSize = PANEL_MIN_WIDTH;
		const sideNavDefault = SIDE_NAV_DEFAULT_WIDTH;
		const supportingDefault = supportingDefaultWidth(width);

		[
			{ name: 'side-nav', position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersWide, panelKey: 'side-nav', grow: 'ArrowRight', shrink: 'ArrowLeft', default: sideNavDefault },
			{ name: 'supporting', position: 'end', fixture: pageDividerFixtures.supportingLongFooterWide, panelKey: 'supporting', grow: 'ArrowLeft', shrink: 'ArrowRight', default: supportingDefault },
			{ name: 'rtl-side-nav', rtl: true, position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersWide, panelKey: 'side-nav', grow: 'ArrowLeft', shrink: 'ArrowRight', default: sideNavDefault },
			{ name: 'rtl-supporting', rtl: true, position: 'end', fixture: pageDividerFixtures.supportingLongFooterWide, panelKey: 'supporting', grow: 'ArrowRight', shrink: 'ArrowLeft', default: supportingDefault }
		].forEach(test => {
			describe(test.name, () => {
				[
					{ action: 'grow-small', key: test.grow, requested: test.default + KEYBOARD_STEP, expected: Math.min(test.default + KEYBOARD_STEP, maxPanelSize) },
					{ action: 'shrink-small', key: test.shrink, requested: test.default - KEYBOARD_STEP, expected: Math.max(test.default - KEYBOARD_STEP, minPanelSize) },
					{ action: 'grow-large', key: 'PageUp', requested: test.default + KEYBOARD_STEP_LARGE, expected: Math.min(test.default + KEYBOARD_STEP_LARGE, maxPanelSize) },
					{ action: 'shrink-large', key: 'PageDown', requested: test.default - KEYBOARD_STEP_LARGE, expected: Math.max(test.default - KEYBOARD_STEP_LARGE, minPanelSize) },
					{ action: 'max', key: 'End', requested: maxPanelSize, expected: maxPanelSize },
					{ action: 'min', key: 'Home', requested: minPanelSize, expected: minPanelSize },
				].forEach(({ action, key, requested, expected }) => {
					it(action, async() => {
						const elem = await fixture(test.fixture, { pagePadding: false, rtl: test.rtl, viewport: { height: 325, width: width } });
						addMarkers(elem, test.position, [
							{ color: 'grey', size: test.default },
							{ color: 'green', size: expected },
							...(requested !== expected ? [{ color: 'blue', size: requested }] : [])
						]);

						const divider = getDivider(elem, test.panelKey);
						await sendKeysElem(divider, 'press', key);
						await expect(elem).to.be.golden({ margin: 0 });
					});
				});
			});
		});
	});

	describe('click', () => {
		describe('handle', () => {
			[
				{ name: 'collapse-side-nav', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
				{ name: 'collapse-supporting-immersive', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
					const divider = getDivider(elem, test.panelKey);
					await clickElem(getSlider(divider));
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});

			[
				{ name: 'expand-side-nav-immersive', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavImmersiveFooter },
				{ name: 'expand-supporting', panelKey: 'supporting', fixture: pageDividerFixtures.supportingLongFooter }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
					const divider = getDivider(elem, test.panelKey);
					await clickElem(getSlider(divider));
					await clickElem(getSlider(divider));
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		describe('divider line', () => {
			it('no-collapse-side-nav', async() => {
				const elem = await fixture(pageDividerFixtures.sideNavBothHeaders, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				const divider = getDivider(elem, 'side-nav');
				await clickElem(divider);
				await expect(elem).to.be.golden({ margin: 0 });
			});

			it('expand-supporting-immersive', async() => {
				const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				const divider = getDivider(elem, 'supporting');
				await clickElem(getSlider(divider));
				await clickElem(divider);
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		// Grey marker is starting position
		// Green marker is the expected resulting position
		describe('arrow', () => {
			const stored = 400;

			afterEach(() => {
				clearStoredPanelState();
			});

			[
				{ name: 'side-nav', position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, panelKey: 'side-nav', grow: 'end', shrink: 'start' },
				{ name: 'supporting', position: 'end', fixture: pageDividerFixtures.supportingLongFooterStorageKey, panelKey: 'supporting', grow: 'start', shrink: 'end' },
				{ name: 'rtl-side-nav', rtl: true, position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, panelKey: 'side-nav', grow: 'end', shrink: 'start' },
				{ name: 'rtl-supporting', rtl: true, position: 'end', fixture: pageDividerFixtures.supportingLongFooterStorageKey, panelKey: 'supporting', grow: 'start', shrink: 'end' }
			].forEach(test => {
				describe(test.name, () => {
					[
						{ action: 'grow', arrow: test.grow, startingSize: stored, expected: stored + KEYBOARD_STEP },
						{ action: 'shrink', arrow: test.shrink, startingSize: stored, expected: stored - KEYBOARD_STEP }
					].forEach(({ action, arrow, startingSize, expected }) => {
						it(action, async() => {
							setStoredPanelState({
								'side-nav': { collapsed: false, size: stored },
								'supporting': { collapsed: false, size: stored }
							});
							const elem = await fixture(test.fixture, { pagePadding: false, rtl: test.rtl, viewport: { height: 325, width: 1100 } });
							addMarkers(elem, test.position, [
								{ color: 'grey', size: startingSize },
								{ color: 'green', size: expected }
							]);

							const divider = getDivider(elem, test.panelKey);
							await focusElem(divider);
							await clickElem(getDividerArrow(divider, arrow));
							await expect(elem).to.be.golden({ margin: 0 });
						});
					});
				});
			});
		});
	});

	describe('overlay', () => {
		const fixtureOptions = (panelKey) => ({ pagePadding: false, viewport: { width: panelKey === 'side-nav-overlay' ? 450 : 800, height: 400 } });

		afterEach(() => {
			clearStoredPanelState();
		});

		describe('hover', () => {
			[
				{ name: 'side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavBothHeaders },
				{ name: 'supporting-immersive', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveFooter }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					await openPanel(elem, test.panelKey);
					await hoverElem(getDivider(elem, test.panelKey));
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});

			[
				{ name: 'handle-side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavBothHeaders },
				{ name: 'handle-supporting-immersive', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveFooter }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					await openPanel(elem, test.panelKey);
					const divider = getDivider(elem, test.panelKey);
					await hoverElem(getSlider(divider));
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});

			[
				{ name: 'arrow-start-side-nav', arrow: 'start', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavLongMainLongFooter },
				{ name: 'arrow-end-side-nav', arrow: 'end', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavLongMainLongFooter },
				{ name: 'arrow-start-supporting-immersive', arrow: 'start', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey },
				{ name: 'arrow-end-supporting-immersive', arrow: 'end', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					await openPanel(elem, test.panelKey);
					const divider = getDivider(elem, test.panelKey);
					await focusElem(divider);
					await hoverElem(getDividerArrow(divider, test.arrow));
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		describe('hover-collapsed', () => {
			[
				{ name: 'side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavBothHeadersFooterStorageKey },
				{ name: 'supporting-immersive', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					await hoverElem(getDivider(elem, test.panelKey));
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});

			[
				{ name: 'handle-side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavBothHeadersFooterStorageKey },
				{ name: 'handle-supporting-immersive', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					const divider = getDivider(elem, test.panelKey);
					await hoverElem(getSlider(divider));
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		describe('focus', () => {
			[
				{ name: 'side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavBothHeadersFooter },
				{ name: 'side-nav-immersive', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavImmersiveFooter },
				{ name: 'side-nav-long-no-scroll', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
				{ name: 'supporting', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingLongFooterStorageKey },
				{ name: 'supporting-immersive', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey },
				{ name: 'supporting-immersive-long-no-scroll', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveLongMain }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					await openPanel(elem, test.panelKey);
					await focusElem(getDivider(elem, test.panelKey));
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		describe('focus-scrolled', () => {
			[
				{ name: 'main', panel: 'side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
				{ name: 'panel', panel: 'supporting', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingLongFooter },
				{ name: 'immersive-main', panel: 'supporting', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveLongMain },
				{ name: 'immersive-panel', panel: 'side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavImmersiveLongFooter }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					await openPanel(elem, test.panelKey);
					await focusElem(getDivider(elem, test.panelKey));
					scrollBody();
					scrollPanel(elem, test.panel);
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		describe('focus-stay-scrolled', () => {
			[
				{ name: 'main', panel: 'side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
				{ name: 'panel', panel: 'supporting', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingLongFooter },
				{ name: 'immersive-main', panel: 'supporting', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveLongMain },
				{ name: 'immersive-panel', panel: 'side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavImmersiveLongFooter }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					await openPanel(elem, test.panelKey);
					scrollBody();
					scrollPanel(elem, test.panel);
					await focusElem(getDivider(elem, test.panelKey));
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		describe('collapse-stay-scrolled', () => {
			[
				{ name: 'main', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
				{ name: 'immersive-main', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveLongMain }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					await openPanel(elem, test.panelKey);
					scrollBody();
					await sendKeysElem(getDivider(elem, test.panelKey), 'press', 'Enter');
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		describe('expand-stay-scrolled', () => {
			[
				{ name: 'panel', panel: 'supporting', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingLongFooter },
				{ name: 'both', panel: 'side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavLongMainLongFooter },
				{ name: 'immersive-panel', panel: 'side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavImmersiveLongFooter },
				{ name: 'immersive-both', panel: 'supporting', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveLongMainLongBothHeaders },
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					await openPanel(elem, test.panelKey);
					scrollPanel(elem, test.panel);
					scrollBody();

					const divider = getDivider(elem, test.panelKey);
					await sendKeysElem(divider, 'press', 'Enter');
					await nextFrame();

					await sendKeysElem(divider, 'press', ' ');
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		describe('expand-not-scrolled', () => {
			[
				{ name: 'panel', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavLongMainLongFooter },
				{ name: 'immersive-panel', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveLongMainLongBothHeaders }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					scrollBody();

					const divider = getDivider(elem, test.panelKey);
					await sendKeysElem(divider, 'press', ' ');
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		// Grey marker is default size
		// Blue marker is requested step size
		// Green marker is the expected resulting position
		describe('keyboard', () => {
			const sideNavTests = [
				{ name: 'side-nav', position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersWide, panelKey: 'side-nav-overlay', grow: 'ArrowRight', shrink: 'ArrowLeft' },
				{ name: 'rtl-side-nav', rtl: true, position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersWide, panelKey: 'side-nav-overlay', grow: 'ArrowLeft', shrink: 'ArrowRight' },
			];

			const supportingTests =	[
				{ name: 'supporting', position: 'end', fixture: pageDividerFixtures.supportingLongFooterWide, panelKey: 'supporting-overlay', grow: 'ArrowLeft', shrink: 'ArrowRight' },
				{ name: 'rtl-supporting', rtl: true, position: 'end', fixture: pageDividerFixtures.supportingLongFooterWide, panelKey: 'supporting-overlay', grow: 'ArrowRight', shrink: 'ArrowLeft' }
			];

			[
				{ tests: sideNavTests, width: 450, maxPanelSize: 450 - DIVIDER_WIDTH - DIVIDER_GUTTER_WIDTH, defaultSize: SIDE_NAV_DEFAULT_WIDTH },
				{ tests: supportingTests, width: 800, maxPanelSize: 800 - DIVIDER_WIDTH - DIVIDER_GUTTER_WIDTH, defaultSize: supportingOverlayDefaultWidth(800) },
			].forEach(({ tests, width, maxPanelSize, defaultSize }) => {
				tests.forEach(test => {
					describe(test.name, () => {
						[
							{ action: 'grow-small', key: test.grow, requested: defaultSize + KEYBOARD_STEP, expected: Math.min(defaultSize + KEYBOARD_STEP, maxPanelSize) },
							{ action: 'shrink-small', key: test.shrink, requested: defaultSize - KEYBOARD_STEP, expected: Math.max(defaultSize - KEYBOARD_STEP, PANEL_MIN_WIDTH) },
							{ action: 'grow-large', key: 'PageUp', requested: defaultSize + KEYBOARD_STEP_LARGE, expected: Math.min(defaultSize + KEYBOARD_STEP_LARGE, maxPanelSize) },
							{ action: 'shrink-large', key: 'PageDown', requested: defaultSize - KEYBOARD_STEP_LARGE, expected: Math.max(defaultSize - KEYBOARD_STEP_LARGE, PANEL_MIN_WIDTH) },
							{ action: 'max', key: 'End', requested: maxPanelSize, expected: maxPanelSize },
							{ action: 'min', key: 'Home', requested: PANEL_MIN_WIDTH, expected: PANEL_MIN_WIDTH },
						].forEach(({ action, key, requested, expected }) => {
							it(action, async() => {
								const elem = await fixture(test.fixture, { pagePadding: false, rtl: test.rtl, viewport: { height: 325, width: width } });
								await openPanel(elem, test.panelKey);
								addMarkers(elem, test.position, [
									{ color: 'grey', size: defaultSize },
									{ color: 'green', size: expected },
									...(requested !== expected ? [{ color: 'blue', size: requested }] : [])
								]);

								const divider = getDivider(elem, test.panelKey);
								await sendKeysElem(divider, 'press', key);
								await expect(elem).to.be.golden({ margin: 0 });
							});
						});
					});
				});
			});
		});

		describe('click', () => {
			describe('handle', () => {
				[
					{ name: 'collapse-side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavBothHeaders },
					{ name: 'collapse-supporting-immersive', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveFooter }
				].forEach(test => {
					it(test.name, async() => {
						const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
						await openPanel(elem, test.panelKey);
						const divider = getDivider(elem, test.panelKey);
						await clickElem(getSlider(divider));
						await expect(elem).to.be.golden({ margin: 0 });
					});
				});

				[
					{ name: 'expand-side-nav-immersive', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavImmersiveFooter },
					{ name: 'expand-supporting', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingLongFooter }
				].forEach(test => {
					it(test.name, async() => {
						const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
						const divider = getDivider(elem, test.panelKey);
						await clickElem(getSlider(divider));
						await expect(elem).to.be.golden({ margin: 0 });
					});
				});
			});

			describe('divider line', () => {
				it('no-collapse-side-nav', async() => {
					const elem = await fixture(pageDividerFixtures.sideNavBothHeaders, fixtureOptions('side-nav-overlay'));
					await openPanel(elem, 'side-nav-overlay');
					const divider = getDivider(elem, 'side-nav-overlay');
					await clickElem(divider);
					await expect(elem).to.be.golden({ margin: 0 });
				});

				it('expand-supporting-immersive', async() => {
					const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, fixtureOptions('supporting-overlay'));
					const divider = getDivider(elem, 'supporting-overlay');
					await clickElem(divider);
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});

			// Grey marker is starting position
			// Green marker is the expected resulting position
			describe('arrow', () => {
				const sideNavTests = [
					{ name: 'side-nav', position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, panelKey: 'side-nav-overlay', grow: 'end', shrink: 'start' },
					{ name: 'rtl-side-nav', rtl: true, position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, panelKey: 'side-nav-overlay', grow: 'end', shrink: 'start' },
				];

				const supportingTests =	[
					{ name: 'supporting', position: 'end', fixture: pageDividerFixtures.supportingLongFooterStorageKey, panelKey: 'supporting-overlay', grow: 'start', shrink: 'end' },
					{ name: 'rtl-supporting', rtl: true, position: 'end', fixture: pageDividerFixtures.supportingLongFooterStorageKey, panelKey: 'supporting-overlay', grow: 'start', shrink: 'end' }
				];

				[
					{ tests: sideNavTests, width: 450, stored: 375 },
					{ tests: supportingTests, width: 800, stored: 500 },
				].forEach(({ tests, width, stored }) => {
					tests.forEach(test => {
						describe(test.name, () => {
							[
								{ action: 'grow', arrow: test.grow, startingSize: stored, expected: stored + KEYBOARD_STEP },
								{ action: 'shrink', arrow: test.shrink, startingSize: stored, expected: stored - KEYBOARD_STEP }
							].forEach(({ action, arrow, startingSize, expected }) => {
								it(action, async() => {
									setStoredPanelState({
										[test.panelKey]: { size: stored }
									});
									const elem = await fixture(test.fixture, { pagePadding: false, rtl: test.rtl, viewport: { height: 325, width: width } });
									await openPanel(elem, test.panelKey);
									addMarkers(elem, test.position, [
										{ color: 'grey', size: startingSize },
										{ color: 'green', size: expected }
									]);

									const divider = getDivider(elem, test.panelKey);
									await focusElem(divider);
									await clickElem(getDividerArrow(divider, arrow));
									await expect(elem).to.be.golden({ margin: 0 });
								});
							});
						});
					});
				});
			});
		});
	});

	describe('drawer', () => {
		// TO DO
	});

});

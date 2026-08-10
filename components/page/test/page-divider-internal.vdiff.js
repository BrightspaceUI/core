import { addMarkers, clearStoredPanelState, scrollBody, scrollPanel, setStoredPanelState } from './page-fixtures.js';
import { clickElem, expect, fixture, focusElem, hoverElem, nextFrame, sendKeysElem } from '@brightspace-ui/testing';
import { DIVIDER_WIDTH, KEYBOARD_STEP, KEYBOARD_STEP_LARGE } from '../page-divider-internal.js';
import { getDivider, getDividerArrow, getSlider, pageDividerFixtures } from './page-divider-internal-fixtures.js';
import { MAIN_MIN_WIDTH, PANEL_MIN_WIDTH, SIDE_NAV_DEFAULT_WIDTH, supportingDefaultWidth } from '../page.js';

describe('page-divider-internal', () => {

	describe('hover', () => {
		[
			{ name: 'side-nav', divider: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'supporting-immersive', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				await hoverElem(getDivider(elem, test.divider));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		[
			{ name: 'handle-side-nav', divider: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'handle-supporting-immersive', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				const divider = getDivider(elem, test.divider);
				await hoverElem(getSlider(divider));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		[
			{ name: 'arrow-start-side-nav', arrow: 'start', divider: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'arrow-end-side-nav', arrow: 'end', divider: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'arrow-start-supporting-immersive', arrow: 'start', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter },
			{ name: 'arrow-end-supporting-immersive', arrow: 'end', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				const divider = getDivider(elem, test.divider);
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
			{ name: 'side-nav', divider: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeadersFooterStorageKey },
			{ name: 'supporting-immersive', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey }
		].forEach(test => {
			it(test.name, async() => {
				setStoredPanelState({ [test.divider]: { size: 400, collapsed: true } });
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				await hoverElem(getDivider(elem, test.divider));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		[
			{ name: 'handle-side-nav', divider: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeadersFooterStorageKey },
			{ name: 'handle-supporting-immersive', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey }
		].forEach(test => {
			it(test.name, async() => {
				setStoredPanelState({ [test.divider]: { size: 400, collapsed: true } });
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				const divider = getDivider(elem, test.divider);
				await hoverElem(getSlider(divider));
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
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
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
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				await focusElem(getDivider(elem, test.divider));
				scrollBody();
				scrollPanel(elem, test.divider);
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('focus-stay-scrolled', () => {
		[
			{ name: 'main', divider: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
			{ name: 'panel', divider: 'supporting', fixture: pageDividerFixtures.supportingLongFooter },
			{ name: 'immersive-main', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMain },
			{ name: 'immersive-panel', divider: 'side-nav', fixture: pageDividerFixtures.sideNavImmersiveLongFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				scrollBody();
				scrollPanel(elem, test.divider);
				await focusElem(getDivider(elem, test.divider));
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('collapse-stay-scrolled', () => {
		[
			{ name: 'main', divider: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainBothHeaders },
			{ name: 'immersive-main', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMain }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				scrollBody();
				await sendKeysElem(getDivider(elem, test.divider), 'press', 'Enter');
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('expand-stay-scrolled', () => {
		[
			{ name: 'panel', divider: 'supporting', fixture: pageDividerFixtures.supportingLongFooter },
			{ name: 'both', divider: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainLongFooter },
			{ name: 'immersive-panel', divider: 'side-nav', fixture: pageDividerFixtures.sideNavImmersiveLongFooter },
			{ name: 'immersive-both', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMainLongBothHeaders },
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				scrollPanel(elem, test.divider);
				scrollBody();

				const divider = getDivider(elem, test.divider);
				await sendKeysElem(divider, 'press', 'Enter');
				await nextFrame();

				await sendKeysElem(divider, 'press', ' ');
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('expand-not-scrolled', () => {
		[
			{ name: 'panel', divider: 'side-nav', fixture: pageDividerFixtures.sideNavLongMainLongFooter },
			{ name: 'immersive-panel', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveLongMainLongBothHeaders }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				const divider = getDivider(elem, test.divider);
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
			{ name: 'side-nav', position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersWide, divider: 'side-nav', grow: 'ArrowRight', shrink: 'ArrowLeft', default: sideNavDefault },
			{ name: 'supporting', position: 'end', fixture: pageDividerFixtures.supportingLongFooterWide, divider: 'supporting', grow: 'ArrowLeft', shrink: 'ArrowRight', default: supportingDefault },
			{ name: 'rtl-side-nav', rtl: true, position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersWide, divider: 'side-nav', grow: 'ArrowLeft', shrink: 'ArrowRight', default: sideNavDefault },
			{ name: 'rtl-supporting', rtl: true, position: 'end', fixture: pageDividerFixtures.supportingLongFooterWide, divider: 'supporting', grow: 'ArrowRight', shrink: 'ArrowLeft', default: supportingDefault }
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

						const divider = getDivider(elem, test.divider);
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
				{ name: 'collapse-side-nav', divider: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
				{ name: 'collapse-supporting-immersive', divider: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
					const divider = getDivider(elem, test.divider);
					await clickElem(getSlider(divider));
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});

			[
				{ name: 'expand-side-nav-immersive', divider: 'side-nav', fixture: pageDividerFixtures.sideNavImmersiveFooter },
				{ name: 'expand-supporting', divider: 'supporting', fixture: pageDividerFixtures.supportingLongFooter }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
					const divider = getDivider(elem, test.divider);
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
				{ name: 'side-nav', position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, divider: 'side-nav', grow: 'end', shrink: 'start' },
				{ name: 'supporting', position: 'end', fixture: pageDividerFixtures.supportingLongFooterStorageKey, divider: 'supporting', grow: 'start', shrink: 'end' },
				{ name: 'rtl-side-nav', rtl: true, position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, divider: 'side-nav', grow: 'end', shrink: 'start' },
				{ name: 'rtl-supporting', rtl: true, position: 'end', fixture: pageDividerFixtures.supportingLongFooterStorageKey, divider: 'supporting', grow: 'start', shrink: 'end' }
			].forEach(test => {
				describe(test.name, () => {
					[
						{ action: 'grow', arrow: test.grow, collapsed: false, startingSize: stored, expected: stored + KEYBOARD_STEP },
						{ action: 'shrink', arrow: test.shrink, collapsed: false, startingSize: stored, expected: stored - KEYBOARD_STEP }
					].forEach(({ action, arrow, collapsed, startingSize, expected }) => {
						it(action, async() => {
							setStoredPanelState({
								'side-nav': { collapsed: collapsed, size: stored },
								'supporting': { collapsed: collapsed, size: stored }
							});
							const elem = await fixture(test.fixture, { pagePadding: false, rtl: test.rtl, viewport: { height: 325, width: 1100 } });
							addMarkers(elem, test.position, [
								{ color: 'grey', size: startingSize },
								{ color: 'green', size: expected }
							]);

							const divider = getDivider(elem, test.divider);
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

import { addMarkers, clearStoredPanelState, openPanel, scrollBody, scrollPanel, setStoredPanelState } from './page-fixtures.js';
import { AUTO_COLLAPSE_WIDTH_FACTOR, AUTO_EXPAND_WIDTH_FACTOR, DIVIDER_WIDTH, KEYBOARD_STEP, KEYBOARD_STEP_LARGE } from '../page-divider-internal.js';
import { clickAt, expect, fixture, nextFrame } from '@brightspace-ui/testing';
import { clickDivider, clickDividerArrow, clickDividerHandle, dragDividerBy, dragDividerHandleBy, focusDivider, forceDividerActive, hoverDivider, hoverDividerArrow, hoverDividerHandle, pageDividerFixtures, pressKeyDivider } from './page-divider-internal-fixtures.js';
import { DIVIDER_GUTTER_WIDTH, HIDE_ARROWS_BREAKPOINT, MAIN_MIN_WIDTH, PANEL_MIN_WIDTH, SIDE_NAV_DEFAULT_WIDTH, supportingDefaultWidth, supportingOverlayDefaultWidth } from '../page.js';

describe('page-divider-internal', () => {

	describe('hover', () => {
		[
			{ name: 'side-nav', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'supporting-immersive', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				await hoverDivider(elem, test.panelKey);
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		[
			{ name: 'handle-side-nav', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeaders },
			{ name: 'handle-supporting-immersive', panelKey: 'supporting', fixture: pageDividerFixtures.supportingImmersiveFooter }
		].forEach(test => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				await hoverDividerHandle(elem, test.panelKey);
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
				await hoverDividerArrow(elem, test.panelKey, test.arrow);
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
				await hoverDividerArrow(elem, test.panelKey, test.arrow);
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
				await hoverDivider(elem, test.panelKey);
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
				await hoverDividerHandle(elem, test.panelKey);
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});
	});

	describe('active', () => {
		it('on', async() => {
			const elem = await fixture(pageDividerFixtures.sideNavBothHeadersFooter, { pagePadding: false, viewport: { width: 1000, height: 400 } });
			await forceDividerActive(elem, 'side-nav');

			await expect(elem).to.be.golden({ margin: 0 });
		});

		it('off', async() => {
			const elem = await fixture(pageDividerFixtures.supportingImmersiveLongMain, { pagePadding: false, viewport: { width: 1000, height: 400 } });
			await forceDividerActive(elem, 'supporting');

			await clickAt(0, 0);
			await expect(elem).to.be.golden({ margin: 0 });
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
				await focusDivider(elem, test.panelKey);
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
				await focusDivider(elem, test.panelKey);
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
				await focusDivider(elem, test.panelKey);
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
				await pressKeyDivider(elem, test.panelKey, 'Enter');
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

				await pressKeyDivider(elem, test.panelKey, 'Enter');
				await nextFrame();

				await pressKeyDivider(elem, test.panelKey, ' ');
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
				await clickDividerHandle(elem, test.panelKey);
				await nextFrame();

				scrollBody();
				await pressKeyDivider(elem, test.panelKey, ' ');
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

						await pressKeyDivider(elem, test.panelKey, key);
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
					await clickDividerHandle(elem, test.panelKey);
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});

			[
				{ name: 'expand-side-nav-immersive', panelKey: 'side-nav', fixture: pageDividerFixtures.sideNavImmersiveFooter },
				{ name: 'expand-supporting', panelKey: 'supporting', fixture: pageDividerFixtures.supportingLongFooter }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: 1000, height: 400 } });
					await clickDividerHandle(elem, test.panelKey);
					await clickDividerHandle(elem, test.panelKey);
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		describe('divider line', () => {
			it('no-collapse-side-nav', async() => {
				const elem = await fixture(pageDividerFixtures.sideNavBothHeaders, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				await clickDivider(elem, 'side-nav');
				await expect(elem).to.be.golden({ margin: 0 });
			});

			it('expand-supporting-immersive', async() => {
				const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, { pagePadding: false, viewport: { width: 1000, height: 400 } });
				await clickDividerHandle(elem, 'supporting');
				await clickDivider(elem, 'supporting');
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

							await clickDividerArrow(elem, test.panelKey, arrow);
							await expect(elem).to.be.golden({ margin: 0 });
						});
					});
				});
			});
		});
	});

	// Grey marker is starting position
	// Blue marker is the where the divider is dragged to
	// Green marker is the expected size the panel will be upon completing the drag
	describe('drag', () => {
		const defaultStart = 400;
		const dragSize = 100;
		const width = 1200;
		const maxPanelSize = width - MAIN_MIN_WIDTH - DIVIDER_WIDTH;
		const minPanelSize = PANEL_MIN_WIDTH;
		const autoCollapseDistance = minPanelSize - Math.ceil(minPanelSize * AUTO_COLLAPSE_WIDTH_FACTOR);
		const autoExpandDistance = Math.floor(minPanelSize * AUTO_EXPAND_WIDTH_FACTOR) - DIVIDER_GUTTER_WIDTH;

		afterEach(() => {
			clearStoredPanelState();
		});

		[
			{ name: 'side-nav', position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, panelKey: 'side-nav', growSign: 1 },
			{ name: 'supporting', position: 'end', fixture: pageDividerFixtures.supportingLongFooterStorageKey, panelKey: 'supporting', growSign: -1 },
			{ name: 'rtl-side-nav', rtl: true, position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, panelKey: 'side-nav', growSign: -1 },
			{ name: 'rtl-supporting', rtl: true, position: 'end', fixture: pageDividerFixtures.supportingLongFooterStorageKey, panelKey: 'supporting', growSign: 1 }
		].forEach(test => {
			describe(test.name, () => {

				[
					{ action: 'grow', grows: true, start: defaultStart, drag: dragSize, expected: defaultStart + dragSize },
					{ action: 'shrink', grows: false, start: defaultStart, drag: dragSize, expected: defaultStart - dragSize },
					{ action: 'max', grows: true, start: maxPanelSize - 50, drag: dragSize, expected: maxPanelSize },
					{ action: 'min', grows: false, start: minPanelSize + 50, drag: dragSize, expected: minPanelSize },
					{ action: 'snap-to-min', grows: false, start: minPanelSize, drag: autoCollapseDistance, expected: minPanelSize },
					{ action: 'auto-collapse', grows: false, start: minPanelSize, drag: autoCollapseDistance + 1, expected: DIVIDER_GUTTER_WIDTH },
					{ action: 'snap-to-collapsed', collapsed: true, grows: true, start: DIVIDER_GUTTER_WIDTH, drag: autoExpandDistance, expected: DIVIDER_GUTTER_WIDTH },
					{ action: 'auto-expand', collapsed: true, grows: true, start: DIVIDER_GUTTER_WIDTH, drag: autoExpandDistance + 1, expected: minPanelSize },
				].forEach(({ action, collapsed = false, grows, start, drag, expected }) => {
					it(action, async() => {
						setStoredPanelState({ [test.panelKey]: { collapsed, size: start } });
						const elem = await fixture(test.fixture, { pagePadding: false, rtl: test.rtl, viewport: { height: 325, width: width } });
						const dragDelta = grows ? drag : -drag;
						const requested = start + dragDelta;
						addMarkers(elem, test.position, [
							{ color: 'grey', size: start },
							{ color: 'green', size: expected },
							...(requested !== expected ? [{ color: 'blue', size: requested }] : [])
						]);

						await dragDividerBy(elem, test.panelKey, { x: dragDelta * test.growSign });
						await expect(elem).to.be.golden({ margin: 0 });
					});
				});
			});
		});
	});

	describe('dragging', () => {
		afterEach(() => {
			clearStoredPanelState();
		});

		// Drag divider handle
		[
			{ name: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, panelKey: 'side-nav', growSign: 1 },
			{ name: 'supporting-immersive', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey, panelKey: 'supporting', growSign: -1 },
			{ name: 'rtl-side-nav-immersive', rtl: true, fixture: pageDividerFixtures.sideNavImmersiveLongMainLongFooterStorageKey, panelKey: 'side-nav', growSign: -1 },
			{ name: 'rtl-supporting', rtl: true, fixture: pageDividerFixtures.supportingLongFooterStorageKey, panelKey: 'supporting', growSign: 1 }
		].forEach(test => {
			describe(test.name, () => {

				[
					{ action: 'closing', grows: false, drag: 200 },
					{ action: 'opening', collapsed: true, grows: true, drag: 100 },
				].forEach(({ action, collapsed = false, grows, drag }) => {
					it(action, async() => {
						setStoredPanelState({ [test.panelKey]: { collapsed, size: 400 } });
						const elem = await fixture(test.fixture, { pagePadding: false, rtl: test.rtl, viewport: { height: 400, width: 1000 } });

						await dragDividerHandleBy(elem, test.panelKey, { x: (grows ? drag : -drag) * test.growSign, completeDrag: false });
						await expect(elem).to.be.golden({ margin: 0 });
					});
				});
			});
		});

		// Wider viewport, drag divider line
		[
			{ name: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeadersFooterStorageKey, panelKey: 'side-nav', growSign: 1 },
			{ name: 'supporting-immersive', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey, panelKey: 'supporting', growSign: -1 },
		].forEach(test => {
			describe(test.name, () => {

				[
					{ action: 'closing-wide', grows: false, drag: 200 },
					{ action: 'opening-wide', collapsed: true, grows: true, drag: 100 },
					{ action: 'past-max', grows: true, drag: 500 },
					{ action: 'past-collapsed', grows: false, drag: 500 },
				].forEach(({ action, collapsed = false, grows, drag }) => {
					it(action, async() => {
						setStoredPanelState({ [test.panelKey]: { collapsed, size: 400 } });
						const elem = await fixture(test.fixture, { pagePadding: false, viewport: { height: 400, width: 1400 } });

						await dragDividerBy(elem, test.panelKey, { x: (grows ? drag : -drag) * test.growSign, completeDrag: false });
						await expect(elem).to.be.golden({ margin: 0 });
					});
				});
			});
		});

		// Scrollable content, drag divider line
		[
			{ name: 'side-nav-immersive', fixture: pageDividerFixtures.sideNavImmersiveLongMainLongFooterStorageKey, panelKey: 'side-nav', growSign: 1 },
			{ name: 'supporting', fixture: pageDividerFixtures.supportingLongMainLongBothHeadersStorageKey, panelKey: 'supporting', growSign: -1 },
		].forEach(test => {
			describe(test.name, () => {

				[
					{ action: 'closing-panel-scrolled', scroll: { panel: true }, grows: false, drag: 200 },
					{ action: 'opening-panel-scrolled', collapsed: true, scroll: { panel: true }, grows: true, drag: 100 },
					{ action: 'closing-both-scrolled', scroll: { body: true, panel: true }, grows: false, drag: 200 },
					{ action: 'opening-both-scrolled', collapsed: true, scroll: { body: true, panel: true }, grows: true, drag: 100 },
				].forEach(({ action, collapsed = false, scroll = {}, grows, drag }) => {
					it(action, async() => {
						setStoredPanelState({ [test.panelKey]: { size: 400 } });
						const elem = await fixture(test.fixture, { pagePadding: false, viewport: { height: 400, width: 1000 } });
						if (scroll.panel) scrollPanel(elem, test.panelKey);
						if (collapsed) await clickDividerHandle(elem, test.panelKey);
						if (scroll.body) scrollBody(elem);

						await dragDividerBy(elem, test.panelKey, { x: (grows ? drag : -drag) * test.growSign, completeDrag: false });
						await expect(elem).to.be.golden({ margin: 0 });
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
					await hoverDivider(elem, test.panelKey);
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
					await hoverDividerHandle(elem, test.panelKey);
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
					await hoverDividerArrow(elem, test.panelKey, test.arrow);
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
					await hoverDivider(elem, test.panelKey);
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});

			[
				{ name: 'handle-side-nav', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavBothHeadersFooterStorageKey },
				{ name: 'handle-supporting-immersive', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey }
			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
					await hoverDividerHandle(elem, test.panelKey);
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
					await focusDivider(elem, test.panelKey);
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
					await focusDivider(elem, test.panelKey);
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
					await focusDivider(elem, test.panelKey);
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
					await pressKeyDivider(elem, test.panelKey, 'Enter');
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

					await pressKeyDivider(elem, test.panelKey, 'Enter');
					await nextFrame();

					await pressKeyDivider(elem, test.panelKey, ' ');
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

					await pressKeyDivider(elem, test.panelKey, ' ');
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

								await pressKeyDivider(elem, test.panelKey, key);
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
						await clickDividerHandle(elem, test.panelKey);
						await expect(elem).to.be.golden({ margin: 0 });
					});
				});

				[
					{ name: 'expand-side-nav-immersive', panelKey: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavImmersiveFooter },
					{ name: 'expand-supporting', panelKey: 'supporting-overlay', fixture: pageDividerFixtures.supportingLongFooter }
				].forEach(test => {
					it(test.name, async() => {
						const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
						await clickDividerHandle(elem, test.panelKey);
						await expect(elem).to.be.golden({ margin: 0 });
					});
				});
			});

			describe('divider line', () => {
				it('no-collapse-side-nav', async() => {
					const elem = await fixture(pageDividerFixtures.sideNavBothHeaders, fixtureOptions('side-nav-overlay'));
					await openPanel(elem, 'side-nav-overlay');
					await clickDivider(elem, 'side-nav-overlay');
					await expect(elem).to.be.golden({ margin: 0 });
				});

				it('expand-supporting-immersive', async() => {
					const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, fixtureOptions('supporting-overlay'));
					await clickDivider(elem, 'supporting-overlay');
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

									await clickDividerArrow(elem, test.panelKey, arrow);
									await expect(elem).to.be.golden({ margin: 0 });
								});
							});
						});
					});
				});
			});
		});

		describe('smaller side-nav', () => {
			[
				{ name: 'hide-arrows', fixture: pageDividerFixtures.sideNavBothHeaders },
				{ name: 'immersive-hide-arrows', fixture: pageDividerFixtures.sideNavImmersiveFooter },

			].forEach(test => {
				it(test.name, async() => {
					const elem = await fixture(test.fixture, { pagePadding: false, viewport: { width: HIDE_ARROWS_BREAKPOINT - 1, height: 400 } });
					await openPanel(elem, 'side-nav-overlay');
					await focusDivider(elem, 'side-nav-overlay');
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});

		// Grey marker is starting position
		// Blue marker is the where the divider is dragged to
		// Green marker is the expected size the panel will be upon completing the drag
		describe('drag', () => {
			const minPanelSize = PANEL_MIN_WIDTH;
			const autoCollapseDistance = minPanelSize - Math.ceil(minPanelSize * AUTO_COLLAPSE_WIDTH_FACTOR);
			const autoExpandDistance = Math.floor(minPanelSize * AUTO_EXPAND_WIDTH_FACTOR) - DIVIDER_GUTTER_WIDTH;

			afterEach(() => {
				clearStoredPanelState();
			});

			const sideNavTests = [
				{ name: 'side-nav', position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, panelKey: 'side-nav-overlay', growSign: 1 },
				{ name: 'rtl-side-nav', rtl: true, position: 'start', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, panelKey: 'side-nav-overlay', growSign: -1 },
			];

			const supportingTests =	[
				{ name: 'supporting', position: 'end', fixture: pageDividerFixtures.supportingLongFooterStorageKey, panelKey: 'supporting-overlay', growSign: -1 },
				{ name: 'rtl-supporting', rtl: true, position: 'end', fixture: pageDividerFixtures.supportingLongFooterStorageKey, panelKey: 'supporting-overlay', growSign: 1 }
			];

			[
				{ tests: sideNavTests, width: 450, dragSize: 50, defaultStart: 375, maxPanelSize: 450 - DIVIDER_WIDTH - DIVIDER_GUTTER_WIDTH, },
				{ tests: supportingTests, width: 800, dragSize: 100, defaultStart: 500, maxPanelSize: 800 - DIVIDER_WIDTH - DIVIDER_GUTTER_WIDTH, },
			].forEach(({ tests, width, dragSize, defaultStart, maxPanelSize }) => {
				tests.forEach(test => {
					describe(test.name, () => {

						[
							{ action: 'grow', grows: true, start: defaultStart, drag: dragSize, expected: defaultStart + dragSize },
							{ action: 'shrink', grows: false, start: defaultStart, drag: dragSize, expected: defaultStart - dragSize },
							{ action: 'max', grows: true, start: maxPanelSize - dragSize + 15, drag: dragSize, expected: maxPanelSize },
							{ action: 'min', grows: false, start: minPanelSize + dragSize - 25, drag: dragSize, expected: minPanelSize },
							{ action: 'snap-to-min', grows: false, start: minPanelSize, drag: autoCollapseDistance, expected: minPanelSize },
							{ action: 'auto-collapse', grows: false, start: minPanelSize, drag: autoCollapseDistance + 1, expected: DIVIDER_GUTTER_WIDTH },
							{ action: 'snap-to-collapsed', collapsed: true, grows: true, start: DIVIDER_GUTTER_WIDTH, drag: autoExpandDistance, expected: DIVIDER_GUTTER_WIDTH },
							{ action: 'auto-expand', collapsed: true, grows: true, start: DIVIDER_GUTTER_WIDTH, drag: autoExpandDistance + 1, expected: minPanelSize },
						].forEach(({ action, collapsed = false, grows, start, drag, expected }) => {
							it(action, async() => {
								setStoredPanelState({ [test.panelKey]: { size: start } });
								const elem = await fixture(test.fixture, { pagePadding: false, rtl: test.rtl, viewport: { height: 325, width: width } });
								if (!collapsed) await openPanel(elem, test.panelKey);

								const dragDelta = grows ? drag : -drag;
								const requested = start + dragDelta;
								addMarkers(elem, test.position, [
									{ color: 'grey', size: start },
									{ color: 'green', size: expected },
									...(requested !== expected ? [{ color: 'blue', size: requested }] : [])
								]);

								await dragDividerBy(elem, test.panelKey, { x: dragDelta * test.growSign });
								await expect(elem).to.be.golden({ margin: 0 });
							});
						});
					});
				});
			});
		});

		describe('dragging', () => {
			afterEach(() => {
				clearStoredPanelState();
			});

			// Drag divider handle
			[
				{ name: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeadersStorageKey, panelKey: 'side-nav-overlay', growSign: 1 },
				{ name: 'supporting-immersive', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey, panelKey: 'supporting-overlay', growSign: -1 },
				{ name: 'rtl-side-nav-immersive', rtl: true, fixture: pageDividerFixtures.sideNavImmersiveLongMainLongFooterStorageKey, panelKey: 'side-nav-overlay', growSign: -1 },
				{ name: 'rtl-supporting', rtl: true, fixture: pageDividerFixtures.supportingLongFooterStorageKey, panelKey: 'supporting-overlay', growSign: 1 }
			].forEach(test => {
				describe(test.name, () => {

					[
						{ action: 'closing', collapsed: false, grows: false, drag: 200 },
						{ action: 'opening', collapsed: true, grows: true, drag: 100 },
					].forEach(({ action, collapsed, grows, drag }) => {
						it(action, async() => {
							setStoredPanelState({ [test.panelKey]: { size: 400 } });
							const elem = await fixture(test.fixture, { rtl: test.rtl, ...fixtureOptions(test.panelKey) });
							if (!collapsed) await openPanel(elem, test.panelKey);

							await dragDividerHandleBy(elem, test.panelKey, { x: (grows ? drag : -drag) * test.growSign, completeDrag: false });
							await expect(elem).to.be.golden({ margin: 0 });
						});
					});
				});
			});

			// Drag divider line
			[
				{ name: 'side-nav', fixture: pageDividerFixtures.sideNavBothHeadersFooterStorageKey, panelKey: 'side-nav-overlay', growSign: 1 },
				{ name: 'supporting-immersive', fixture: pageDividerFixtures.supportingImmersiveBothHeadersStorageKey, panelKey: 'supporting-overlay', growSign: -1 },
			].forEach(test => {
				describe(test.name, () => {

					[
						{ action: 'past-max', grows: true, drag: 500 },
						{ action: 'past-collapsed', grows: false, drag: 500 },
					].forEach(({ action, grows, drag }) => {
						it(action, async() => {
							setStoredPanelState({ [test.panelKey]: { size: 400 } });
							const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
							await openPanel(elem, test.panelKey);

							await dragDividerBy(elem, test.panelKey, { x: (grows ? drag : -drag) * test.growSign, completeDrag: false });
							await expect(elem).to.be.golden({ margin: 0 });
						});
					});
				});
			});

			// Scrollable content, drag divider line
			[
				{ name: 'side-nav-immersive', fixture: pageDividerFixtures.sideNavImmersiveLongMainLongFooterStorageKey, panel: 'side-nav', panelKey: 'side-nav-overlay', growSign: 1 },
				{ name: 'supporting', fixture: pageDividerFixtures.supportingLongMainLongBothHeadersStorageKey, panel: 'supporting', panelKey: 'supporting-overlay', growSign: -1 },
			].forEach(test => {
				describe(test.name, () => {

					[
						{ action: 'closing-panel-scrolled', scroll: { panel: true }, grows: false, drag: 200 },
						{ action: 'opening-panel-scrolled', collapsed: true, scroll: { panel: true }, grows: true, drag: 100 },
						{ action: 'closing-both-scrolled', scroll: { body: true, panel: true }, grows: false, drag: 200 },
						{ action: 'opening-both-scrolled', collapsed: true, scroll: { body: true, panel: true }, grows: true, drag: 100 },
					].forEach(({ action, collapsed = false, scroll = {}, grows, drag }) => {
						it(action, async() => {
							setStoredPanelState({ [test.panelKey]: { size: 400 } });
							const elem = await fixture(test.fixture, fixtureOptions(test.panelKey));
							await openPanel(elem, test.panelKey);

							if (scroll.panel) scrollPanel(elem, test.panel);
							if (collapsed) await clickDividerHandle(elem, test.panelKey);
							if (scroll.body) scrollBody(elem);

							await dragDividerBy(elem, test.panelKey, { x: (grows ? drag : -drag) * test.growSign, completeDrag: false });
							await expect(elem).to.be.golden({ margin: 0 });
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

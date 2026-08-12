import '../page-divider-internal.js';
import { clearStoredPanelState, openPanel, setStoredPanelState } from './page-fixtures.js';
import { clickElem, expect, fixture, focusElem, hoverElem, nextFrame } from '@brightspace-ui/testing';
import { getDivider, getDividerArrow, getSlider, pageDividerFixtures } from './page-divider-internal-fixtures.js';

const defaultFixtureOptions = { pagePadding: false, viewport: { width: 1300, height: 800 } };

describe('page-divider-internal', () => {

	afterEach(() => {
		clearStoredPanelState();
	});

	it('hover', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, defaultFixtureOptions);
		await hoverElem(getDivider(elem, 'supporting'));
		await expect(elem).to.be.accessible();
	});

	it('hover handle', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, defaultFixtureOptions);
		const divider = getDivider(elem, 'supporting');
		await hoverElem(getSlider(divider));
		await expect(elem).to.be.accessible();
	});

	it('focus', async() => {
		const elem = await fixture(pageDividerFixtures.sideNavBothHeadersFooter, defaultFixtureOptions);
		await clickElem(getDivider(elem, 'side-nav'));
		await nextFrame();
		await expect(elem).to.be.accessible();
	});

	it('focus then hover arrow', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, defaultFixtureOptions);
		const divider = getDivider(elem, 'supporting');
		await clickElem(divider);
		await nextFrame();
		await hoverElem(getDividerArrow(divider, 'start'));
		await expect(elem).to.be.accessible();
	});

	it('collapsed side-nav', async() => {
		setStoredPanelState({ 'side-nav': { size: 400, collapsed: true } });
		const elem = await fixture(pageDividerFixtures.sideNavBothHeadersFooterStorageKey, defaultFixtureOptions);
		await expect(elem).to.be.accessible();
	});

	it('collapsed side-nav focused', async() => {
		const elem = await fixture(pageDividerFixtures.sideNavBothHeadersFooter, defaultFixtureOptions);
		const divider = getDivider(elem, 'side-nav');
		await clickElem(getSlider(divider));
		await nextFrame();
		await expect(elem).to.be.accessible();
	});

	it('collapsed supporting', async() => {
		setStoredPanelState({ 'supporting': { size: 400, collapsed: true } });
		const elem = await fixture(pageDividerFixtures.supportingImmersiveBothHeadersStorageKey, defaultFixtureOptions);
		await expect(elem).to.be.accessible();
	});

	it('collapsed supporting focused', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, defaultFixtureOptions);
		const divider = getDivider(elem, 'supporting');
		await clickElem(getSlider(divider));
		await nextFrame();
		await expect(elem).to.be.accessible();
	});

	describe('overlay', () => {
		const overlayFixtureOptions = (panelKey) => ({ pagePadding: false, viewport: { width: panelKey === 'side-nav-overlay' ? 450 : 800, height: 500 } });

		[
			{ name: 'side-nav', key: 'side-nav-overlay', fixture: pageDividerFixtures.sideNavBothHeadersFooter },
			{ name: 'supporting', key: 'supporting-overlay', fixture: pageDividerFixtures.supportingImmersiveFooter }
		].forEach(panel => {

			describe(panel.name, () => {
				it('hover', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await openPanel(elem, panel.key);
					await hoverElem(getDivider(elem, panel.key));
					await expect(elem).to.be.accessible();
				});

				it('hover handle', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await openPanel(elem, panel.key);
					const divider = getDivider(elem, panel.key);
					await hoverElem(getSlider(divider));
					await expect(elem).to.be.accessible();
				});

				it('focus', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await openPanel(elem, panel.key);
					await focusElem(getDivider(elem, panel.key));
					await expect(elem).to.be.accessible();
				});

				it('focus then hover start arrow', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await openPanel(elem, panel.key);

					const divider = getDivider(elem, panel.key);
					await clickElem(divider);
					await nextFrame();
					await hoverElem(getDividerArrow(divider, 'start'));
					await expect(elem).to.be.accessible();
				});

				it('focus then hover end arrow', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await openPanel(elem, panel.key);

					const divider = getDivider(elem, panel.key);
					await clickElem(divider);
					await nextFrame();
					await hoverElem(getDividerArrow(divider, 'end'));
					await expect(elem).to.be.accessible();
				});

				it('collapsed', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await expect(elem).to.be.accessible();
				});

				it('collapsed focused', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await focusElem(getDivider(elem, panel.key));
					await expect(elem).to.be.accessible();
				});
			});
		});
	});

	describe('drawer', () => {
		// TO DO
	});

});

import '../page-divider-internal.js';
import { clearStoredPanelState, openPanel, setStoredPanelState } from './page-fixtures.js';
import { clickDivider, clickDividerHandle, focusDivider, hoverDivider, hoverDividerArrow, hoverDividerHandle, pageDividerFixtures } from './page-divider-internal-fixtures.js';
import { expect, fixture } from '@brightspace-ui/testing';

const defaultFixtureOptions = { pagePadding: false, viewport: { width: 1300, height: 800 } };

describe('page-divider-internal', () => {

	afterEach(() => {
		clearStoredPanelState();
	});

	it('hover', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, defaultFixtureOptions);
		await hoverDivider(elem, 'supporting');
		await expect(elem).to.be.accessible();
	});

	it('hover handle', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, defaultFixtureOptions);
		await hoverDividerHandle(elem, 'supporting');
		await expect(elem).to.be.accessible();
	});

	it('focus', async() => {
		const elem = await fixture(pageDividerFixtures.sideNavBothHeadersFooter, defaultFixtureOptions);
		await clickDivider(elem, 'side-nav');
		await expect(elem).to.be.accessible();
	});

	it('focus and hover arrow', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, defaultFixtureOptions);
		await hoverDividerArrow(elem, 'supporting', 'start');
		await expect(elem).to.be.accessible();
	});

	it('collapsed side-nav', async() => {
		setStoredPanelState({ 'side-nav': { size: 400, collapsed: true } });
		const elem = await fixture(pageDividerFixtures.sideNavBothHeadersFooterStorageKey, defaultFixtureOptions);
		await expect(elem).to.be.accessible();
	});

	it('collapsed side-nav focused', async() => {
		const elem = await fixture(pageDividerFixtures.sideNavBothHeadersFooter, defaultFixtureOptions);
		await clickDividerHandle(elem, 'side-nav');
		await expect(elem).to.be.accessible();
	});

	it('collapsed supporting', async() => {
		setStoredPanelState({ 'supporting': { size: 400, collapsed: true } });
		const elem = await fixture(pageDividerFixtures.supportingImmersiveBothHeadersStorageKey, defaultFixtureOptions);
		await expect(elem).to.be.accessible();
	});

	it('collapsed supporting focused', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter, defaultFixtureOptions);
		await clickDividerHandle(elem, 'supporting');
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
					await hoverDivider(elem, panel.key);
					await expect(elem).to.be.accessible();
				});

				it('hover handle', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await openPanel(elem, panel.key);
					await hoverDividerHandle(elem, panel.key);
					await expect(elem).to.be.accessible();
				});

				it('focus', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await openPanel(elem, panel.key);
					await focusDivider(elem, panel.key);
					await expect(elem).to.be.accessible();
				});

				it('focus and hover start arrow', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await openPanel(elem, panel.key);
					await hoverDividerArrow(elem, panel.key, 'start');
					await expect(elem).to.be.accessible();
				});

				it('focus and hover end arrow', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await openPanel(elem, panel.key);
					await hoverDividerArrow(elem, panel.key, 'end');
					await expect(elem).to.be.accessible();
				});

				it('collapsed', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await expect(elem).to.be.accessible();
				});

				it('collapsed focused', async() => {
					const elem = await fixture(panel.fixture, overlayFixtureOptions(panel.key));
					await focusDivider(elem, panel.key);
					await expect(elem).to.be.accessible();
				});
			});
		});
	});

	describe('drawer', () => {
		// TO DO
	});

});

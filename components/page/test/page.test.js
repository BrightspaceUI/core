import { clearStoredPanelState, getStoredPanelState, pageFixtures, setStoredPanelState } from './page-fixtures.js';
import { expect, fixture, nextFrame, runConstructor, setViewport, waitUntil } from '@brightspace-ui/testing';
import { restore, spy } from 'sinon';
import { SIDE_NAV_DEFAULT_WIDTH, supportingDefaultWidth, supportingMobileDefaultHeight, supportingOverlayDefaultWidth } from '../page.js';
import { getDivider } from './page-divider-internal-fixtures.js';

const fixtureHeight = 800;
const defaultFixtureOptions = { pagePadding: false, viewport: { width: 1300, height: fixtureHeight } };

describe('page', () => {

	it('should construct', () => {
		runConstructor('d2l-page');
	});

	describe('accessibility', () => {
		describe('hides panels with no content', () => {
			it('single panel', async() => {
				const elem = await fixture(pageFixtures.mainHeaderFooter, defaultFixtureOptions);
				expect(elem.shadowRoot.querySelector('.side-nav').hasAttribute('hidden')).to.be.true;
				expect(elem.shadowRoot.querySelector('.supporting').hasAttribute('hidden')).to.be.true;
			});
			it('side-nav', async() => {
				const elem = await fixture(pageFixtures.sideNavHeader, defaultFixtureOptions);
				expect(elem.shadowRoot.querySelector('.side-nav').getAttribute('aria-label')).to.equal('Side');
				expect(elem.shadowRoot.querySelector('.side-nav').hasAttribute('hidden')).to.be.false;
				expect(elem.shadowRoot.querySelector('.supporting').hasAttribute('hidden')).to.be.true;
			});
			it('supporting', async() => {
				const elem = await fixture(pageFixtures.supportingImmersiveBothHeaders, defaultFixtureOptions);
				expect(elem.shadowRoot.querySelector('.supporting').getAttribute('aria-label')).to.equal('Supporting');
				expect(elem.shadowRoot.querySelector('.supporting').hasAttribute('hidden')).to.be.false;
				expect(elem.shadowRoot.querySelector('.side-nav').hasAttribute('hidden')).to.be.true;
			});
		});
	});

	describe('storing panel state', () => {
		afterEach(() => {
			clearStoredPanelState();
		});

		describe('key validation', () => {
			it('accepts valid keys', async() => {
				const elem = await fixture(pageFixtures.sideNavHeader, defaultFixtureOptions);
				elem.stateStorageKey = 'test-PAGE_123';
				expect(elem.stateStorageKey).to.equal('test-PAGE_123');
			});

			it('rejects invalid keys', async() => {
				const elem = await fixture(pageFixtures.sideNavHeader, defaultFixtureOptions);
				expect(() => { elem.stateStorageKey = 'test page'; }).to.throw();
				expect(elem.stateStorageKey).to.be.undefined;
			});

			it('clears key once invalid key is set', async() => {
				const elem = await fixture(pageFixtures.sideNavHeaderStorageKey, defaultFixtureOptions);
				expect(elem.stateStorageKey).to.equal('test-page');

				expect(() => { elem.stateStorageKey = 'test page'; }).to.throw();
				expect(elem.stateStorageKey).to.be.undefined;
			});
		});

		describe('restoring', () => {
			it('applies the stored size over the default', async() => {
				setStoredPanelState({ 'side-nav': { size: 450, collapsed: false } });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(450);
				expect(elem._panelState.getCollapsed('side-nav')).to.be.false;
			});

			it('applies the stored collapsed state', async() => {
				setStoredPanelState({ 'side-nav': { size: 450, collapsed: true } });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getCollapsed('side-nav')).to.be.true;
				expect(elem._panelState.getSize('side-nav')).to.equal(0);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(450);
			});

			it('does not apply a stored collapsed state for side-nav-overlay', async() => {
				setStoredPanelState({ 'side-nav-overlay': { size: 450, collapsed: false } });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getCollapsed('side-nav-overlay')).to.be.true;
				expect(elem._panelState.getSize('side-nav-overlay')).to.equal(0);
				expect(elem._panelState.getTrueSize('side-nav-overlay')).to.equal(450);
			});

			it('does not apply a stored collapsed state for supporting-overlay', async() => {
				setStoredPanelState({ 'supporting-overlay': { size: 350, collapsed: false } });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getCollapsed('supporting-overlay')).to.be.true;
				expect(elem._panelState.getSize('supporting-overlay')).to.equal(0);
				expect(elem._panelState.getTrueSize('supporting-overlay')).to.equal(350);
			});

			it('falls back to the default when no storage key set', async() => {
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(SIDE_NAV_DEFAULT_WIDTH);
				expect(elem._panelState.getCollapsed('side-nav')).to.be.false;
			});

			it('falls back to the default when there is no stored entry', async() => {
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting')).to.equal(supportingDefaultWidth(1230));
				expect(elem._panelState.getCollapsed('supporting')).to.be.false;
			});

			it('clamps a stored size larger than the max', async() => {
				setStoredPanelState({ 'side-nav': { size: 9999, collapsed: false } });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(elem._panelState.getMaxSize('side-nav'));
			});

			it('clamps a stored size smaller than the min', async() => {
				setStoredPanelState({ 'side-nav': { size: 10, collapsed: false } });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(elem._panelState.getMinSize('side-nav'));
			});

			it('restores each panel independently', async() => {
				setStoredPanelState({
					'side-nav': { size: 400, collapsed: false },
					'supporting': { size: 500, collapsed: true }
				});
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(400);
				expect(elem._panelState.getCollapsed('side-nav')).to.be.false;
				expect(elem._panelState.getTrueSize('supporting')).to.equal(500);
				expect(elem._panelState.getCollapsed('supporting')).to.be.true;
			});

			it('ignores empty stored state', async() => {
				setStoredPanelState({});
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting-mobile')).to.equal(supportingMobileDefaultHeight(fixtureHeight));
				expect(elem._panelState.getCollapsed('supporting-mobile')).to.be.false;
			});

			it('ignores empty stored panel state', async() => {
				setStoredPanelState({ 'supporting-mobile': {} });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting-mobile')).to.equal(supportingMobileDefaultHeight(fixtureHeight));
				expect(elem._panelState.getCollapsed('supporting-mobile')).to.be.false;
			});

			it('ignores invalid stored state', async() => {
				setStoredPanelState('not-json');
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting-mobile')).to.equal(supportingMobileDefaultHeight(fixtureHeight));
				expect(elem._panelState.getCollapsed('supporting-mobile')).to.be.false;
			});

			it('ignores invalid stored panel state', async() => {
				setStoredPanelState({ 'supporting-mobile': { size: 'not-a-number', collapsed: true } });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting-mobile')).to.equal(supportingMobileDefaultHeight(fixtureHeight));
				expect(elem._panelState.getCollapsed('supporting-mobile')).to.be.true;
			});
		});

		describe('storing', () => {
			afterEach(() => {
				restore();
			});

			it('persists the size when a panel is resized', async() => {
				const elem = await fixture(pageFixtures.sideNavHeaderStorageKey, defaultFixtureOptions);
				getDivider(elem, 'side-nav').dispatchEvent(new CustomEvent('d2l-page-divider-resize', { detail: { requestedSize: 450 } }));
				const stored = getStoredPanelState();
				expect(stored['side-nav'].size).to.equal(450);
			});

			it('persists the collapsed state when a panel is toggled', async() => {
				const elem = await fixture(pageFixtures.sideNavHeaderStorageKey, defaultFixtureOptions);
				getDivider(elem, 'side-nav').dispatchEvent(new CustomEvent('d2l-page-divider-toggle'));
				const stored = getStoredPanelState();
				expect(stored['side-nav'].collapsed).to.be.true;
				expect(stored['side-nav'].size).to.equal(SIDE_NAV_DEFAULT_WIDTH);
			});

			it('does not persist the collapsed state for side-nav-overlay', async() => {
				const elem = await fixture(pageFixtures.sideNavHeaderStorageKey, { pagePadding: false, viewport: { width: 450, height: fixtureHeight } });
				getDivider(elem, 'side-nav-overlay').dispatchEvent(new CustomEvent('d2l-page-divider-toggle'));
				const stored = getStoredPanelState();
				expect(stored['side-nav-overlay'].collapsed).to.be.undefined;
				expect(stored['side-nav-overlay'].size).to.equal(SIDE_NAV_DEFAULT_WIDTH);
			});

			it('does not persist the collapsed state for supporting-overlay', async() => {
				const elem = await fixture(pageFixtures.supportingFooterStorageKey, { pagePadding: false, viewport: { width: 800, height: fixtureHeight } });
				getDivider(elem, 'supporting-overlay').dispatchEvent(new CustomEvent('d2l-page-divider-toggle'));
				const stored = getStoredPanelState();
				expect(stored['supporting-overlay'].collapsed).to.be.undefined;
				expect(stored['supporting-overlay'].size).to.equal(supportingOverlayDefaultWidth(800));
			});

			it('persists each panel under its own key', async() => {
				setStoredPanelState({ 'side-nav': { size: 450, collapsed: true } });
				const elem = await fixture(pageFixtures.supportingFooterStorageKey, defaultFixtureOptions);
				getDivider(elem, 'supporting').dispatchEvent(new CustomEvent('d2l-page-divider-resize', { detail: { requestedSize: 500 } }));
				const stored = getStoredPanelState();
				expect(stored['side-nav'].size).to.equal(450);
				expect(stored['side-nav'].collapsed).to.be.true;
				expect(stored['supporting'].size).to.equal(500);
				expect(stored['supporting'].collapsed).to.be.false;
			});

			it('does not persist when no storage key is set', async() => {
				const setItemSpy = spy(localStorage, 'setItem');
				const elem = await fixture(pageFixtures.sideNavHeader, defaultFixtureOptions);
				getDivider(elem, 'side-nav').dispatchEvent(new CustomEvent('d2l-page-divider-resize', { detail: { requestedSize: 450 } }));
				expect(setItemSpy.called).to.be.false;
			});

			it('does not update when size adjusted by initial clamping', async() => {
				setStoredPanelState({ 'supporting': { size: 9999, collapsed: false } });
				const elem = await fixture(pageFixtures.supportingFooterStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting')).to.equal(elem._panelState.getMaxSize('supporting'));
				const stored = getStoredPanelState();
				expect(stored['supporting'].size).to.equal(9999);
			});

			it('does not update when size adjusted by window width resize', async() => {
				setStoredPanelState({ 'supporting': { size: 500, collapsed: false } });
				const elem = await fixture(pageFixtures.supportingFooterStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting')).to.equal(500);

				await setViewport({ width: 1000 });
				await waitUntil(() => elem._panelState.getTrueSize('supporting') !== 500);

				const stored = getStoredPanelState();
				expect(stored['supporting'].size).to.equal(500);
			});

			it('does not update when size adjusted by window height resize', async() => {
				setStoredPanelState({ 'supporting-mobile': { size: 600, collapsed: false } });
				const elem = await fixture(pageFixtures.supportingFooterStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting-mobile')).to.equal(600);

				await setViewport({ height: 650 });
				await waitUntil(() => elem._panelState.getTrueSize('supporting-mobile') !== 600);

				const stored = getStoredPanelState();
				expect(stored['supporting-mobile'].size).to.equal(600);
			});
		});
	});

	describe('adjusting collapsed panel state', () => {
		const setInitialState = (elem, key, collapsed) => elem._panelState.setCollapsed(key, collapsed === 'collapsed');

		describe('desktop to overlay', () => {
			[
				{ panelStart: 'opened', overlayStart: 'collapsed', overlayResult: 'collapsed' },
				{ panelStart: 'collapsed', overlayStart: 'collapsed', overlayResult: 'collapsed' },
				{ panelStart: 'opened', overlayStart: 'opened', overlayResult: 'collapsed' },
				{ panelStart: 'collapsed', overlayStart: 'opened', overlayResult: 'collapsed' },
			].forEach(({ panelStart, overlayStart, overlayResult }) => {
				it(`side-nav panel ${panelStart} + overlay ${overlayStart} → overlay ${overlayResult}`, async() => {
					const elem = await fixture(pageFixtures.sideNavHeader, { pagePadding: false, viewport: { width: 1000 } });
					setInitialState(elem, 'side-nav', panelStart);
					setInitialState(elem, 'side-nav-overlay', overlayStart);

					await setViewport({ width: 450 });
					await nextFrame();
					expect(elem._panelState.getCollapsed('side-nav-overlay')).to.equal(overlayResult === 'collapsed');
				});

				it(`supporting panel ${panelStart} + overlay ${overlayStart} → overlay ${overlayResult}`, async() => {
					const elem = await fixture(pageFixtures.supportingFooter, { pagePadding: false, viewport: { width: 1000 } });
					setInitialState(elem, 'supporting', panelStart);
					setInitialState(elem, 'supporting-overlay', overlayStart);

					await setViewport({ width: 800 });
					await nextFrame();
					expect(elem._panelState.getCollapsed('supporting-overlay')).to.equal(overlayResult === 'collapsed');
				});
			});
		});

		describe('overlay to desktop', () => {
			[
				{ panelStart: 'opened', overlayStart: 'collapsed', panelResult: 'opened' },
				{ panelStart: 'collapsed', overlayStart: 'collapsed', panelResult: 'collapsed' },
				{ panelStart: 'opened', overlayStart: 'opened', panelResult: 'opened' },
				{ panelStart: 'collapsed', overlayStart: 'opened', panelResult: 'opened' }
			].forEach(({ panelStart, overlayStart, panelResult }) => {
				it(`side-nav panel ${panelStart} + overlay ${overlayStart} → panel ${panelResult}`, async() => {
					const elem = await fixture(pageFixtures.sideNavHeader, { pagePadding: false, viewport: { width: 450 } });
					setInitialState(elem, 'side-nav', panelStart);
					setInitialState(elem, 'side-nav-overlay', overlayStart);

					await setViewport({ width: 1000 });
					await nextFrame();
					expect(elem._panelState.getCollapsed('side-nav')).to.equal(panelResult === 'collapsed');
				});

				it(`supporting panel ${panelStart} + overlay ${overlayStart} → panel ${panelResult}`, async() => {
					const elem = await fixture(pageFixtures.supportingFooter, { pagePadding: false, viewport: { width: 800 } });
					setInitialState(elem, 'supporting', panelStart);
					setInitialState(elem, 'supporting-overlay', overlayStart);

					await setViewport({ width: 1000 });
					await nextFrame();
					expect(elem._panelState.getCollapsed('supporting')).to.equal(panelResult === 'collapsed');
				});
			});
		});

		describe('overlay to mobile', () => {
			[
				{ overlayStart: 'opened', mobileStart: 'collapsed', mobileResult: 'collapsed' },
				{ overlayStart: 'collapsed', mobileStart: 'collapsed', mobileResult: 'collapsed' },
				{ overlayStart: 'opened', mobileStart: 'opened', mobileResult: 'opened' },
				{ overlayStart: 'collapsed', mobileStart: 'opened', mobileResult: 'opened' }
			].forEach(({ overlayStart, mobileStart, mobileResult }) => {
				it(`supporting overlay ${overlayStart} + mobile ${mobileStart} → mobile ${mobileResult}`, async() => {
					const elem = await fixture(pageFixtures.supportingFooter, { pagePadding: false, viewport: { width: 800 } });
					setInitialState(elem, 'supporting-overlay', overlayStart);
					setInitialState(elem, 'supporting-mobile', mobileStart);

					await setViewport({ width: 500 });
					await nextFrame();
					expect(elem._panelState.getCollapsed('supporting-mobile')).to.equal(mobileResult === 'collapsed');
				});
			});
		});

		describe('mobile to overlay', () => {
			[
				{ overlayStart: 'opened', mobileStart: 'collapsed', overlayResult: 'opened' }, // TO DO: Should be collapsed once drawer is implemented
				{ overlayStart: 'collapsed', mobileStart: 'collapsed', overlayResult: 'collapsed' },
				{ overlayStart: 'opened', mobileStart: 'opened', overlayResult: 'opened' }, // TO DO: Should be collapsed once drawer is implemented
				{ overlayStart: 'collapsed', mobileStart: 'opened', overlayResult: 'collapsed' }
			].forEach(({ overlayStart, mobileStart, overlayResult }) => {
				it(`supporting overlay ${overlayStart} + mobile ${mobileStart} → overlay ${overlayResult}`, async() => {
					const elem = await fixture(pageFixtures.supportingFooter, { pagePadding: false, viewport: { width: 500 } });
					setInitialState(elem, 'supporting-overlay', overlayStart);
					setInitialState(elem, 'supporting-mobile', mobileStart);

					await setViewport({ width: 800 });
					await nextFrame();
					expect(elem._panelState.getCollapsed('supporting-overlay')).to.equal(overlayResult === 'collapsed');
				});
			});
		});
	});
});

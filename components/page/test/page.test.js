import { clearStoredPanelState, getStoredPanelState, pageFixtures, setStoredPanelState } from './page-fixtures.js';
import { expect, fixture, runConstructor, setViewport, waitUntil } from '@brightspace-ui/testing';
import { restore, spy } from 'sinon';
import { SIDE_NAV_DEFAULT_WIDTH, supportingDefaultWidth, supportingMobileDefaultHeight } from '../page.js';
import { getDivider } from './page-divider-internal-fixtures.js';

const fixtureHeight = 800;
const defaultFixtureOptions = { pagePadding: false, viewport: { width: 1300, height: fixtureHeight } };

describe('page', () => {

	it('should construct', () => {
		runConstructor('d2l-page');
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

			it('falls back to the default when no storage key set', async() => {
				const elem = await fixture(pageFixtures.sideNavHeader, defaultFixtureOptions);
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

			it('does not update when size adjusted by window resize', async() => {
				setStoredPanelState({ 'supporting': { size: 500, collapsed: false } });
				const elem = await fixture(pageFixtures.supportingFooterStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting')).to.equal(500);

				await setViewport({ width: 1000, height: fixtureHeight });
				await waitUntil(() => elem._panelState.getTrueSize('supporting') !== 500);

				const stored = getStoredPanelState();
				expect(stored['supporting'].size).to.equal(500);
			});
		});
	});
});

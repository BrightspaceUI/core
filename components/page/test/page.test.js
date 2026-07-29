import '../page.js';
import { expect, fixture, runConstructor, setViewport, waitUntil } from '@brightspace-ui/testing';
import { getStoredPanelState, pageFixtures, setStoredPanelState } from './page-fixtures.js';
import { getDivider } from './page-divider-internal-fixtures.js';

const defaultFixtureOptions = { pagePadding: false, viewport: { width: 1300, height: 800 } };

describe('page', () => {

	it('should construct', () => {
		runConstructor('d2l-page');
	});

	describe('storing panel state', () => {
		afterEach(() => {
			localStorage.clear();
		});

		describe('restoring', () => {
			it('applies the stored size over the default', async() => {
				setStoredPanelState({ 'side-nav': { size: '450', collapsed: 'false' } });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(450);
				expect(elem._panelState.getCollapsed('side-nav')).to.be.false;
			});

			it('applies the stored collapsed state', async() => {
				setStoredPanelState({ 'side-nav': { size: '450', collapsed: 'true' } });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getCollapsed('side-nav')).to.be.true;
				expect(elem._panelState.getSize('side-nav')).to.equal(0);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(450);
			});

			it('falls back to the default when there is no stored entry', async() => {
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(Math.floor(elem._contentWidth / 3));
				expect(elem._panelState.getCollapsed('side-nav')).to.be.false;
			});

			it('clamps a stored size larger than the max', async() => {
				setStoredPanelState({ 'side-nav': { size: '9999', collapsed: 'false' } });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(elem._panelState.getMaxSize('side-nav'));
			});

			it('clamps a stored size smaller than the min', async() => {
				setStoredPanelState({ 'side-nav': { size: '10', collapsed: 'false' } });
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(elem._panelState.getMinSize('side-nav'));
			});

			it('restores each panel independently', async() => {
				setStoredPanelState({
					'side-nav': { size: '400', collapsed: 'false' },
					'supporting': { size: '500', collapsed: 'true' }
				});
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('side-nav')).to.equal(400);
				expect(elem._panelState.getCollapsed('side-nav')).to.be.false;
				expect(elem._panelState.getTrueSize('supporting')).to.equal(500);
				expect(elem._panelState.getCollapsed('supporting')).to.be.true;
			});

			it('ignores invalid stored data', async() => {
				setStoredPanelState('not-json');
				const elem = await fixture(pageFixtures.mainStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting-mobile')).to.equal(Math.floor(window.innerHeight / 2));
				expect(elem._panelState.getCollapsed('supporting-mobile')).to.be.false;
			});
		});

		describe('storing', () => {
			it('persists the size when a panel is resized', async() => {
				const elem = await fixture(pageFixtures.sideNavHeaderStorageKey, defaultFixtureOptions);
				getDivider(elem, 'side-nav').dispatchEvent(new CustomEvent('d2l-page-divider-resize', { detail: { requestedSize: 450 } }));
				const stored = getStoredPanelState();
				expect(stored['side-nav'].size).to.equal('450');
			});

			it('persists the collapsed state when a panel is toggled', async() => {
				const elem = await fixture(pageFixtures.sideNavHeaderStorageKey, defaultFixtureOptions);
				getDivider(elem, 'side-nav').dispatchEvent(new CustomEvent('d2l-page-divider-toggle'));
				const stored = getStoredPanelState();
				expect(stored['side-nav'].collapsed).to.equal('true');
				expect(stored['side-nav'].size).to.equal((elem._contentWidth / 3).toString());
			});

			it('persists each panel under its own key', async() => {
				setStoredPanelState({ 'side-nav': { size: '450', collapsed: 'true' } });
				const elem = await fixture(pageFixtures.supportingFooterStorageKey, defaultFixtureOptions);
				getDivider(elem, 'supporting').dispatchEvent(new CustomEvent('d2l-page-divider-resize', { detail: { requestedSize: 500 } }));
				const stored = getStoredPanelState();
				expect(stored['side-nav'].size).to.equal('450');
				expect(stored['side-nav'].collapsed).to.equal('true');
				expect(stored['supporting'].size).to.equal('500');
				expect(stored['supporting'].collapsed).to.equal('false');
			});

			it('does not persist when no storage key is set', async() => {
				const elem = await fixture(pageFixtures.sideNavHeader, defaultFixtureOptions);
				getDivider(elem, 'side-nav').dispatchEvent(new CustomEvent('d2l-page-divider-resize', { detail: { requestedSize: 450 } }));
				expect(getStoredPanelState()).to.be.null;
			});

			it('does not update when size adjusted by initial clamping', async() => {
				setStoredPanelState({ 'supporting': { size: '9999', collapsed: 'false' } });
				const elem = await fixture(pageFixtures.supportingFooterStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting')).to.equal(elem._panelState.getMaxSize('supporting'));
				const stored = getStoredPanelState();
				expect(stored['supporting'].size).to.equal('9999');
			});

			it('does not update when size adjusted by window resize', async() => {
				setStoredPanelState({ 'supporting': { size: '500', collapsed: 'false' } });
				const elem = await fixture(pageFixtures.supportingFooterStorageKey, defaultFixtureOptions);
				expect(elem._panelState.getTrueSize('supporting')).to.equal(500);

				await setViewport({ height: 800, width: 1000 });
				await waitUntil(() => elem._panelState.getTrueSize('supporting') !== 500);

				const stored = getStoredPanelState();
				expect(stored['supporting'].size).to.equal('500');
			});
		});
	});
});

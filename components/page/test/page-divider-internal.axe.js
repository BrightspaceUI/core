import '../page-divider-internal.js';
import { clearStoredPanelState, setStoredPanelState } from './page-fixtures.js';
import { clickElem, expect, fixture, hoverElem, nextFrame } from '@brightspace-ui/testing';
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

});

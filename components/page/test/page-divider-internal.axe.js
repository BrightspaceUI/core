import '../page-divider-internal.js';
import { clickElem, expect, fixture, hoverElem, nextFrame } from '@brightspace-ui/testing';
import { getDivider, getSlider, pageDividerFixtures } from './page-divider-internal-fixtures.js';

describe('page-divider-internal', () => {

	it('hover', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter);
		await hoverElem(getDivider(elem, 'supporting'));
		await expect(elem).to.be.accessible();
	});

	it('hover handle', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter);
		const divider = getDivider(elem, 'supporting');
		await hoverElem(getSlider(divider));
		await expect(elem).to.be.accessible();
	});

	it('focus', async() => {
		const elem = await fixture(pageDividerFixtures.sideNavBothHeadersFooter);
		await clickElem(getDivider(elem, 'side-nav'));
		await nextFrame();
		await expect(elem).to.be.accessible();
	});

	it('collapsed-side-nav', async() => {
		const elem = await fixture(pageDividerFixtures.sideNavBothHeadersFooter);
		const divider = getDivider(elem, 'side-nav');
		await clickElem(getSlider(divider));
		await nextFrame();
		await expect(elem).to.be.accessible();
	});

	it('collapsed-supporting', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter);
		const divider = getDivider(elem, 'supporting');
		await clickElem(getSlider(divider));
		await nextFrame();
		await expect(elem).to.be.accessible();
	});

});

import '../page-divider-internal.js';
import { clickElem, expect, fixture, hoverElem } from '@brightspace-ui/testing';
import { getDivider, pageDividerFixtures } from './page-divider-internal-fixtures.js';

describe('page-divider-internal', () => {

	it('hover', async() => {
		const elem = await fixture(pageDividerFixtures.supportingImmersiveFooter);
		await hoverElem(getDivider(elem, 'supporting'));
		await expect(elem).to.be.accessible();
	});

	it('focus', async() => {
		const elem = await fixture(pageDividerFixtures.sideNavBothHeadersFooter);
		await clickElem(getDivider(elem, 'side-nav'));
		await expect(elem).to.be.accessible();
	});

});

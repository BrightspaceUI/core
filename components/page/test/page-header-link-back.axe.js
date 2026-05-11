import { expect, fixture } from '@brightspace-ui/testing';
import { pageHeaderLinkBackFixtures } from './page-header-link-back-fixtures.js';

describe('d2l-page-header-link-back', () => {

	it('default', async() => {
		const el = await fixture(pageHeaderLinkBackFixtures.default);
		await expect(el).to.be.accessible();
	});

	it('custom back text', async() => {
		const el = await fixture(pageHeaderLinkBackFixtures.customBackText);
		await expect(el).to.be.accessible();
	});

});

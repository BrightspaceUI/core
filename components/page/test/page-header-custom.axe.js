import { expect, fixture } from '@brightspace-ui/testing';
import { pageHeaderCustomFixtures } from './page-header-custom-fixtures.js';

describe('page-header-custom', () => {

	it('top bottom skip nav', async() => {
		const elem = await fixture(pageHeaderCustomFixtures.topBottomSkipNav);
		await expect(elem).to.be.accessible();
	});

	it('top', async() => {
		const elem = await fixture(pageHeaderCustomFixtures.top);
		await expect(elem).to.be.accessible();
	});

	it('bottom', async() => {
		const elem = await fixture(pageHeaderCustomFixtures.bottom);
		await expect(elem).to.be.accessible();
	});

});

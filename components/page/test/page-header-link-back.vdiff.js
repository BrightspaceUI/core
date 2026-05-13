import { expect, fixture, focusElem, hoverElem } from '@brightspace-ui/testing';
import { pageHeaderLinkBackFixtures } from './page-header-link-back-fixtures.js';

describe('d2l-page-header-link-back', () => {

	[
		{ name: 'default', template: pageHeaderLinkBackFixtures.default },
		{ name: 'custom back text', template: pageHeaderLinkBackFixtures.customBackText },
	].forEach(({ name, template }) => {
		describe(name, () => {

			let elem;
			beforeEach(async() => {
				elem = await fixture(template);
			});

			it('normal', async() => {
				await expect(elem).to.be.golden();
			});

			it('hover', async() => {
				await hoverElem(elem);
				await expect(elem).to.be.golden();
			});

			it('focus', async() => {
				await focusElem(elem);
				await expect(elem).to.be.golden();
			});

		});
	});

	it('small', async() => {
		const elem = await fixture(pageHeaderLinkBackFixtures.customBackText, { viewport: { width: 600 } });
		await expect(elem).to.be.golden();
	});

});

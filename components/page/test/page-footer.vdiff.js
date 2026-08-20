import { expect, fixture } from '@brightspace-ui/testing';
import { pageFooterFixtures } from './page-footer-fixtures.js';

describe('d2l-page-footer', () => {

	[
		{ name: 'default', template: pageFooterFixtures.default },
		{ name: 'default-end', template: pageFooterFixtures.withEnd },
		{ name: 'end', template: pageFooterFixtures.onlyEnd },
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden({ margin: 0 });
		});
	});

	it('rtl', async() => {
		const elem = await fixture(pageFooterFixtures.withEnd, { rtl: true });
		await expect(elem).to.be.golden({ margin: 0 });
	});

});

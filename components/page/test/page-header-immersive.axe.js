import { expect, fixture } from '@brightspace-ui/testing';
import { pageHeaderImmersiveFixtures } from './page-header-immersive-fixtures.js';

describe('d2l-page-header-immersive', () => {

	[
		{ name: 'actions', template: pageHeaderImmersiveFixtures.actions },
		{ name: 'back-custom-text', template: pageHeaderImmersiveFixtures.backCustomText },
		{ name: 'back-href', template: pageHeaderImmersiveFixtures.backHref },
		{ name: 'back-only', template: pageHeaderImmersiveFixtures.backOnly },
		{ name: 'subtitle-only', template: pageHeaderImmersiveFixtures.subtitleOnly },
		{ name: 'title-only', template: pageHeaderImmersiveFixtures.titleOnly },
		{ name: 'title-subtitle', template: pageHeaderImmersiveFixtures.titleSubtitle }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.accessible();
		});
	});

});

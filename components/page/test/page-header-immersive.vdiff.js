import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';
import { getBackLink, pageHeaderImmersiveFixtures } from './page-header-immersive-fixtures.js';

describe('d2l-page-header-immersive', () => {

	[
		{ name: 'actions', template: pageHeaderImmersiveFixtures.actions },
		{ name: 'back-custom-text', template: pageHeaderImmersiveFixtures.backCustomText },
		{ name: 'back-only', template: pageHeaderImmersiveFixtures.backOnly },
		{ name: 'subtitle-only', template: pageHeaderImmersiveFixtures.subtitleOnly },
		{ name: 'title-custom', template: pageHeaderImmersiveFixtures.titleCustom },
		{ name: 'title-only', template: pageHeaderImmersiveFixtures.titleOnly },
		{ name: 'titles-overflow', template: pageHeaderImmersiveFixtures.titlesOverflow },
		{ name: 'title-subtitle', template: pageHeaderImmersiveFixtures.titleSubtitle }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
	});

	describe('back', () => {

		it('short', async() => {
			const elem = await fixture(pageHeaderImmersiveFixtures.backCustomText, { viewport: { width: 600 } });
			await expect(elem).to.be.golden();
		});

		it('hover', async() => {
			const elem = await fixture(pageHeaderImmersiveFixtures.backOnly);
			await hoverElem(getBackLink(elem));
			await expect(elem).to.be.golden();
		});

		it('focus', async() => {
			const elem = await fixture(pageHeaderImmersiveFixtures.backOnly);
			await focusElem(getBackLink(elem));
			await expect(elem).to.be.golden();
		});

	});

	describe('error', () => {

		it('no-parent-page', async() => {
			const elem = await fixture(html`<d2l-page-header-immersive></d2l-page-header-immersive>`);
			await expect(elem).to.be.golden();
		});

	});

	describe('rtl', () => {

		[
			{ name: 'actions' }
		].forEach(({ name }) => {
			it(name, async() => {
				const elem = await fixture(pageHeaderImmersiveFixtures.actions, { rtl: true });
				await expect(elem).to.be.golden();
			});
		});

	});

	describe('width-type', () => {

		[
			{ name: 'normal' },
			{ name: 'wide' },
			{ name: 'fullscreen' },
		].forEach(({ name }) => {
			it(name, async() => {
				const elem = await fixture(pageHeaderImmersiveFixtures.actions, { viewport: { width: 1700 } });
				elem.setAttribute('width-type', name);
				await expect(elem).to.be.golden();
			});
		});

	});

});

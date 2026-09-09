import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';
import { getBackLink, pageHeaderImmersiveFixtures } from './page-header-immersive-fixtures.js';

describe('d2l-page-header-immersive', () => {

	describe('actions', () => {
		[
			{ name: 'title', template: pageHeaderImmersiveFixtures.actionsTitle },
			{ name: 'title-rtl', template: pageHeaderImmersiveFixtures.actionsTitle, rtl: true },
			{ name: 'no-title', template: pageHeaderImmersiveFixtures.actionsNoTitle }
		].forEach(({ name, template, rtl = false }) => {
			it(name, async() => {
				const elem = await fixture(template, { rtl });
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('title', () => {
		[
			{ name: 'subtitle-only', template: pageHeaderImmersiveFixtures.subtitleOnly },
			{ name: 'custom', template: pageHeaderImmersiveFixtures.titleCustom },
			{ name: 'title-only', template: pageHeaderImmersiveFixtures.titleOnly },
			{ name: 'overflow', template: pageHeaderImmersiveFixtures.titleOverflow },
			{ name: 'title-subtitle', template: pageHeaderImmersiveFixtures.titleSubtitle },
			{ name: 'hidden', template: pageHeaderImmersiveFixtures.titleSubtitle, width: 200 }
		].forEach(({ name, template, width }) => {
			it(name, async() => {
				const elem = await fixture(template, width ? { viewport: { width } } : undefined);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('back', () => {

		[
			{ name: 'custom-text', template: pageHeaderImmersiveFixtures.backCustomText },
			{ name: 'only', template: pageHeaderImmersiveFixtures.backOnly },
			{ name: 'short', template: pageHeaderImmersiveFixtures.backCustomText, width: 600 },
			{ name: 'compact', template: pageHeaderImmersiveFixtures.backOnly, width: 350 },
			{ name: 'hover', template: pageHeaderImmersiveFixtures.backOnly, action: hoverElem },
			{ name: 'focus', template: pageHeaderImmersiveFixtures.backOnly, action: focusElem }
		].forEach(({ name, template, action, width }) => {
			it(name, async() => {
				const elem = await fixture(template, width ? { viewport: { width } } : undefined);
				if (action) {
					await action(getBackLink(elem));
				}
				await expect(elem).to.be.golden();
			});
		});

	});

	describe('error', () => {

		it('no-parent-page', async() => {
			const elem = await fixture(html`<d2l-page-header-immersive></d2l-page-header-immersive>`);
			await expect(elem).to.be.golden();
		});

	});

	describe('width-type', () => {

		[
			{ name: 'normal' },
			{ name: 'wide' },
			{ name: 'fullscreen' },
		].forEach(({ name }) => {
			it(name, async() => {
				const elem = await fixture(pageHeaderImmersiveFixtures.actionsTitle, { viewport: { width: 1700 } });
				elem.setAttribute('width-type', name);
				await expect(elem).to.be.golden();
			});
		});

	});

});

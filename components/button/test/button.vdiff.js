import '../button.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

describe('d2l-button', () => {

	[
		{ category: 'normal', f: html`<d2l-button>Normal Button</d2l-button>` },
		{ category: 'primary', f: html`<d2l-button primary>Primary Button</d2l-button>` }
	].forEach(({ category, f }) => {

		describe(category, () => {

			[
				{ name: 'normal' },
				{ name: 'hover', action: async(elem) => await hoverElem(elem) },
				{ name: 'focus', action: async(elem) => await focusElem(elem) },
				{ name: 'click', action: async(elem) => await clickElem(elem) },
				{ name: 'disabled', action: async(elem) => elem.disabled = true }
			].forEach(({ action, name }) => {
				it(name, async() => {
					const elem = await fixture(f);
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});

		});

	});

});

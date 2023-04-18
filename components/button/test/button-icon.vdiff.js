import '../button-icon.js';
import { fixture, focusWithKeyboard, focusWithMouse, hoverWithMouse, html, screenshotAndCompare } from '../../../tools/web-test-runner-helpers.js';

describe('d2l-button-icon', () => {

	[
		{ category: 'normal', f: html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>` },
		{ category: 'translucent', f: html`<d2l-button-icon icon="tier1:gear" text="Icon Button" translucent></d2l-button-icon>`, theme: 'translucent' },
		{ category: 'dark', f: html`<d2l-button-icon icon="tier1:gear" text="Icon Button" theme="dark"></d2l-button-icon>`, theme: 'dark' },
		{ category: 'custom', f: html`<d2l-button-icon icon="tier1:gear" text="Icon Button" style="--d2l-button-icon-min-height: 1.5rem; --d2l-button-icon-min-width: 1.5rem; --d2l-button-icon-border-radius: 4px; --d2l-button-icon-focus-box-shadow: 0 0 0 1px #ffffff, 0 0 0 3px #006fbf; --d2l-button-icon-fill-color: var(--d2l-color-celestine); --d2l-button-icon-fill-color-hover: var(--d2l-color-celestine-minus-1);"></d2l-button-icon>` }
	].forEach(({ category, f, theme }) => {

		describe(category, () => {

			[
				{ name: 'normal' },
				{ name: 'hover', action: async(elem) => await hoverWithMouse(elem) },
				{ name: 'focus', action: async(elem) => await focusWithKeyboard(elem) },
				{ name: 'click', action: async(elem) => await focusWithMouse(elem) },
				{ name: 'disabled', action: async(elem) => elem.disabled = true }
			].forEach(({ action, name }) => {
				it(name, async function() {
					const elem = await fixture(f, { theme: theme });
					if (action) await action(elem);
					await screenshotAndCompare(elem, this.test.fullTitle());
				});
			});

		});

	});

});

import '../button.js';
import { fixture, focusWithKeyboard, focusWithMouse, hoverWithMouse, html, screenshotAndCompare } from '../../../tools/web-test-runner-helpers.js';

describe('d2l-button', () => {

	[
		{ category: 'normal', f: html`<d2l-button>Normal Button</d2l-button>` },
		{ category: 'primary', f: html`<d2l-button primary>Primary Button</d2l-button>` }
	].forEach(({ category, f }) => {

		describe(category, () => {

			[
				{ name: 'normal' },
				{ name: 'hover', action: async(elem) => await hoverWithMouse(elem) },
				{ name: 'focus', action: async(elem) => await focusWithKeyboard(elem) },
				{ name: 'click', action: async(elem) => await focusWithMouse(elem) },
				{ name: 'disabled', action: async(elem) => elem.disabled = true }
			].forEach(({ action, name }) => {
				it(name, async function() {
					const elem = await fixture(f);
					if (action) await action(elem);
					await screenshotAndCompare(elem, this.test.fullTitle());
				});
			});

		});

	});

});

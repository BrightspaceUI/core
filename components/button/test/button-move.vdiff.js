import '../button-move.js';
import { fixture, focusWithKeyboard, focusWithMouse, hoverWithMouse, html, screenshotAndCompare } from '../../../tools/web-test-runner-helpers.js';

describe('d2l-button-move', () => {

	[ 'normal', 'dark' ].forEach(category => {

		describe(category, () => {

			let elem;
			beforeEach(async() => {
				elem = await fixture(
					html`<d2l-button-move text="Reorder Item"></d2l-button-move>`,
					{ theme: category === 'dark' ? 'dark' : undefined }
				);
			});

			[
				{ name: 'normal' },
				{ name: 'hover', action: async(elem) => await hoverWithMouse(elem) },
				{ name: 'keyboard-focus', action: async(elem) => await focusWithKeyboard(elem) },
				{ name: 'mouse-focus', action: async(elem) => await focusWithMouse(elem) },
				{ name: 'disabled', action: async(elem) => {
					elem.disabledUp = true;
					elem.disabledDown = true;
					elem.disabledLeft = true;
					elem.disabledRight = true;
					elem.disabledHome = true;
					elem.disabledEnd = true;
				} },
				{ name: 'disabled-up', action: async(elem) => elem.disabledUp = true },
				{ name: 'disabled-up-hover', action: async(elem) => {
					elem.disabledUp = true;
					await hoverWithMouse(elem);
				} },
				{ name: 'disabled-up-keyboard-focus', action: async(elem) => {
					elem.disabledUp = true;
					await focusWithKeyboard(elem);
				} },
				{ name: 'disabled-up-mouse-focus', action: async(elem) => {
					elem.disabledUp = true;
					await focusWithMouse(elem);
				} },
				{ name: 'disabled-down', action: async(elem) => elem.disabledDown = true },
			].forEach(({ action, name }) => {
				it(name, async function() {
					if (category === 'dark') elem.theme = 'dark';
					if (action) await action(elem);
					await screenshotAndCompare(elem, this.test.fullTitle());
				});
			});

		});

	});

});

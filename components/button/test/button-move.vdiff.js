import '../button-move.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

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
				{ name: 'hover', action: async(elem) => await hoverElem(elem) },
				{ name: 'keyboard-focus', action: async(elem) => await focusElem(elem) },
				{ name: 'mouse-focus', action: async(elem) => await clickElem(elem) },
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
					await hoverElem(elem);
				} },
				{ name: 'disabled-up-keyboard-focus', action: async(elem) => {
					elem.disabledUp = true;
					await focusElem(elem);
				} },
				{ name: 'disabled-up-mouse-focus', action: async(elem) => {
					elem.disabledUp = true;
					await clickElem(elem);
				} },
				{ name: 'disabled-down', action: async(elem) => elem.disabledDown = true },
			].forEach(({ action, name }) => {
				it(name, async() => {
					if (category === 'dark') elem.theme = 'dark';
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});

		});

	});

});

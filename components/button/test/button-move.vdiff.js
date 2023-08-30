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
				{ name: 'hover', action: hoverElem },
				{ name: 'keyboard-focus', action: focusElem },
				{ name: 'mouse-focus', action: clickElem },
				{ name: 'disabled', action: elem => {
					elem.disabledUp = true;
					elem.disabledDown = true;
					elem.disabledLeft = true;
					elem.disabledRight = true;
					elem.disabledHome = true;
					elem.disabledEnd = true;
				} },
				{ name: 'disabled-up', action: elem => elem.disabledUp = true },
				{ name: 'disabled-up-hover', action: elem => {
					elem.disabledUp = true;
					return hoverElem(elem);
				} },
				{ name: 'disabled-up-keyboard-focus', action: elem => {
					elem.disabledUp = true;
					return focusElem(elem);
				} },
				{ name: 'disabled-up-mouse-focus', action: elem => {
					elem.disabledUp = true;
					return clickElem(elem);
				} },
				{ name: 'disabled-down', action: elem => elem.disabledDown = true },
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

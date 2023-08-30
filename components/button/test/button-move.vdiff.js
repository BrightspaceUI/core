import '../button-move.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

describe('d2l-button-move', () => {

	[
		{ category: 'normal', f: html`<d2l-button-move text="Reorder Item"></d2l-button-move>` },
		{ category: 'dark', f: html`<div style="display: inline-block; padding: 10px; line-height: 0; background: black;"><d2l-button-move text="Reorder Item"></d2l-button-move></div>` }
	].forEach(({ category, f }) => {

		describe(category, () => {

			let elem;
			beforeEach(async() => {
				elem = await fixture(f);
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
					let actionElem = elem;
					const opts = {};
					if (elem.tagName !== 'D2L-BUTTON-MOVE') {
						actionElem = elem.querySelector('d2l-button-move');
						actionElem.theme = category;
						opts.margin = 0;
					}
					if (action) await action(actionElem);
					await expect(elem).to.be.golden(opts);
				});
			});

		});

	});

});

import '../button-move.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

describe('button-move', () => {
	[
		{ category: 'normal', template: theme => html`<d2l-button-move text="Reorder Item" theme="${theme}"></d2l-button-move>` },
		{ category: 'dark', template: theme => html`<div style="padding: 20px; background: black;"><d2l-button-move text="Reorder Item" theme="${theme}"></d2l-button-move></div>` }
	].forEach(({ category, template }) => {

		describe(category, () => {
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
					let elem = await fixture(template(category));
					if (elem.tagName !== 'D2L-BUTTON-MOVE') elem = elem.querySelector('d2l-button-move');
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});
	});
});

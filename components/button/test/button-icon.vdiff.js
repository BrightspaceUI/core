import '../button-icon.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

describe('button-icon', () => {
	[
		{ category: 'normal', template: html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>` },
		{ category: 'translucent', template: html`<div style="height: 80px; width: 200px; background: repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px);"><d2l-button-icon style="margin: 12px;" icon="tier1:gear" text="Icon Button" translucent></d2l-button-icon></div>` },
		{ category: 'dark', template: html`<div style="height: 80px; width: 200px; background: black;"><d2l-button-icon style="margin: 12px;" icon="tier1:gear" text="Icon Button" theme="dark"></d2l-button-icon></div>` },
		{ category: 'custom', template: html`<d2l-button-icon icon="tier1:gear" text="Icon Button" style="--d2l-button-icon-min-height: 1.5rem; --d2l-button-icon-min-width: 1.5rem; --d2l-button-icon-border-radius: 4px; --d2l-button-icon-focus-box-shadow: 0 0 0 1px #ffffff, 0 0 0 3px #006fbf; --d2l-button-icon-fill-color: var(--d2l-color-celestine); --d2l-button-icon-fill-color-hover: var(--d2l-color-celestine-minus-1);"></d2l-button-icon>` }
	].forEach(({ category, template }) => {

		describe(category, () => {
			[
				{ name: 'normal' },
				{ name: 'hover', action: hoverElem },
				{ name: 'focus', action: focusElem },
				{ name: 'click', action: clickElem },
				{ name: 'disabled', action: elem => elem.disabled = true },
				{ name: 'disabled hover', action: elem => {
					elem.disabled = true;
					return hoverElem(elem);
				} }
			].forEach(({ action, name }) => {
				it(name, async() => {
					let elem = await fixture(template);
					if (elem.tagName !== 'D2L-BUTTON-ICON') elem = elem.querySelector('d2l-button-icon');
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});
	});
});

import '../button-icon.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

describe('d2l-button-icon', () => {

	[
		{ category: 'normal', f: html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>` },
		{ category: 'translucent', f: html`<div style="display: inline-block; padding: 10px; line-height: 0; background: repeating-linear-gradient(45deg,	#606dbc, #606dbc 10px, #465298 10px, #465298 20px);"><d2l-button-icon icon="tier1:gear" text="Icon Button" translucent></d2l-button-icon></div>` },
		{ category: 'dark', f: html`<div style="display: inline-block; padding: 10px; line-height: 0; background: black;"><d2l-button-icon icon="tier1:gear" text="Icon Button" theme="dark"></d2l-button-icon></div>` },
		{ category: 'custom', f: html`<d2l-button-icon icon="tier1:gear" text="Icon Button" style="--d2l-button-icon-min-height: 1.5rem; --d2l-button-icon-min-width: 1.5rem; --d2l-button-icon-border-radius: 4px; --d2l-button-icon-focus-box-shadow: 0 0 0 1px #ffffff, 0 0 0 3px #006fbf; --d2l-button-icon-fill-color: var(--d2l-color-celestine); --d2l-button-icon-fill-color-hover: var(--d2l-color-celestine-minus-1);"></d2l-button-icon>` }
	].forEach(({ category, f }) => {

		describe(category, () => {

			let elem;
			beforeEach(async() => {
				elem = await fixture(f);
			});

			[
				{ name: 'normal' },
				{ name: 'hover', action: hoverElem },
				{ name: 'focus', action: focusElem },
				{ name: 'click', action: clickElem },
				{ name: 'disabled', action: elem => elem.disabled = true },
				{ name: 'disabled hover', action: elem => {
					elem.disabled = true;
					hoverElem(elem);
				} }
			].forEach(({ action, name }) => {
				it(name, async() => {
					let actionElem = elem;
					const opts = {};
					if (elem.tagName !== 'D2L-BUTTON-ICON') {
						actionElem = elem.querySelector('d2l-button-icon');
						opts.margin = 0;
					}
					if (action) await action(actionElem);
					await expect(elem).to.be.golden(opts);
				});
			});

		});

	});

});

import '../button-icon.js';
import '../../icons/icon-custom.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

const customIconTemplate = html`
	<d2l-button-icon text="Custom Icon Button">
		<d2l-icon-custom slot="icon">
			<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
				<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
				<path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
			</svg>
		</d2l-icon-custom>
	</d2l-button-icon>
`;

describe('button-icon', () => {
	[
		{ category: 'normal', template: html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>` },
		{ category: 'translucent', template: html`<div style="height: 80px; width: 200px; background: repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px);"><d2l-button-icon style="margin: 12px;" icon="tier1:gear" text="Icon Button" translucent></d2l-button-icon></div>` },
		{ category: 'dark', template: html`<div style="height: 80px; width: 200px; background: black;"><d2l-button-icon style="margin: 12px;" icon="tier1:gear" text="Icon Button" theme="dark"></d2l-button-icon></div>` },
		{ category: 'custom', template: html`<d2l-button-icon icon="tier1:gear" text="Icon Button" style="--d2l-button-icon-min-height: 1.5rem; --d2l-button-icon-min-width: 1.5rem; --d2l-button-icon-border-radius: 4px; --d2l-button-icon-focus-box-shadow: 0 0 0 1px #ffffff, 0 0 0 3px #006fbf; --d2l-button-icon-fill-color: var(--d2l-color-celestine); --d2l-button-icon-fill-color-hover: var(--d2l-color-celestine-minus-1);"></d2l-button-icon>` },
		{ category: 'custom icon', template: customIconTemplate }
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

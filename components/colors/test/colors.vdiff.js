import '../demo/color-swatch.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { registerSemanticVariableForSvgImageUrl } from '../colors.js';

describe('colors', () => {

	it('palette', async() => {
		const elem = await fixture(html`
			<div style="display: inline-block;">
				<d2l-color-swatch name="regolith"></d2l-color-swatch>
				<d2l-color-swatch name="sylvite"></d2l-color-swatch>
				<d2l-color-swatch name="gypsum"></d2l-color-swatch>
				<d2l-color-swatch name="mica"></d2l-color-swatch>
				<d2l-color-swatch name="corundum"></d2l-color-swatch>
				<d2l-color-swatch name="chromite"></d2l-color-swatch>
				<d2l-color-swatch name="galena"></d2l-color-swatch>
				<d2l-color-swatch name="tungsten"></d2l-color-swatch>
				<d2l-color-swatch name="ferrite"></d2l-color-swatch>
				<d2l-color-swatch name="primary-accent-action"></d2l-color-swatch>
				<d2l-color-swatch name="primary-accent-indicator"></d2l-color-swatch>
				<d2l-color-swatch name="feedback-error"></d2l-color-swatch>
				<d2l-color-swatch name="feedback-warning"></d2l-color-swatch>
				<d2l-color-swatch name="feedback-success"></d2l-color-swatch>
				<d2l-color-swatch name="feedback-action"></d2l-color-swatch>
				<d2l-color-swatch name="zircon-plus-2"></d2l-color-swatch>
				<d2l-color-swatch name="zircon-plus-1"></d2l-color-swatch>
				<d2l-color-swatch name="zircon"></d2l-color-swatch>
				<d2l-color-swatch name="zircon-minus-1"></d2l-color-swatch>
				<d2l-color-swatch name="celestine-plus-2"></d2l-color-swatch>
				<d2l-color-swatch name="celestine-plus-1"></d2l-color-swatch>
				<d2l-color-swatch name="celestine"></d2l-color-swatch>
				<d2l-color-swatch name="celestine-minus-1"></d2l-color-swatch>
				<d2l-color-swatch name="amethyst-plus-2"></d2l-color-swatch>
				<d2l-color-swatch name="amethyst-plus-1"></d2l-color-swatch>
				<d2l-color-swatch name="amethyst"></d2l-color-swatch>
				<d2l-color-swatch name="amethyst-minus-1"></d2l-color-swatch>
				<d2l-color-swatch name="fluorite-plus-2"></d2l-color-swatch>
				<d2l-color-swatch name="fluorite-plus-1"></d2l-color-swatch>
				<d2l-color-swatch name="fluorite"></d2l-color-swatch>
				<d2l-color-swatch name="fluorite-minus-1"></d2l-color-swatch>
				<d2l-color-swatch name="tourmaline-plus-2"></d2l-color-swatch>
				<d2l-color-swatch name="tourmaline-plus-1"></d2l-color-swatch>
				<d2l-color-swatch name="tourmaline"></d2l-color-swatch>
				<d2l-color-swatch name="tourmaline-minus-1"></d2l-color-swatch>
				<d2l-color-swatch name="cinnabar-plus-2"></d2l-color-swatch>
				<d2l-color-swatch name="cinnabar-plus-1"></d2l-color-swatch>
				<d2l-color-swatch name="cinnabar"></d2l-color-swatch>
				<d2l-color-swatch name="cinnabar-minus-1"></d2l-color-swatch>
				<d2l-color-swatch name="carnelian-plus-1"></d2l-color-swatch>
				<d2l-color-swatch name="carnelian"></d2l-color-swatch>
				<d2l-color-swatch name="carnelian-minus-1"></d2l-color-swatch>
				<d2l-color-swatch name="carnelian-minus-2"></d2l-color-swatch>
				<d2l-color-swatch name="citrine-plus-1"></d2l-color-swatch>
				<d2l-color-swatch name="citrine"></d2l-color-swatch>
				<d2l-color-swatch name="citrine-minus-1"></d2l-color-swatch>
				<d2l-color-swatch name="citrine-minus-2"></d2l-color-swatch>
				<d2l-color-swatch name="peridot-plus-1"></d2l-color-swatch>
				<d2l-color-swatch name="peridot"></d2l-color-swatch>
				<d2l-color-swatch name="peridot-minus-1"></d2l-color-swatch>
				<d2l-color-swatch name="peridot-minus-2"></d2l-color-swatch>
				<d2l-color-swatch name="olivine-plus-1"></d2l-color-swatch>
				<d2l-color-swatch name="olivine"></d2l-color-swatch>
				<d2l-color-swatch name="olivine-minus-1"></d2l-color-swatch>
				<d2l-color-swatch name="olivine-minus-2"></d2l-color-swatch>
				<d2l-color-swatch name="malachite-plus-1"></d2l-color-swatch>
				<d2l-color-swatch name="malachite"></d2l-color-swatch>
				<d2l-color-swatch name="malachite-minus-1"></d2l-color-swatch>
				<d2l-color-swatch name="malachite-minus-2"></d2l-color-swatch>
			</div>
		`, { viewport: { height: 3000 } });
		await expect(elem).to.be.golden();
	});

	describe('registerSemanticVariableForSvgImageUrl', () => {

		let cssVariableIndex = 0;

		const svgWithNonSemanticVariables = `<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
			<path fill="var(--d2l-color-cinnabar)" d="M17.79 15.11l-7-14a2 2 0 0 0-3.58 0l-7 14a1.975 1.975 0 0 0 .09 1.94A2 2 0 0 0 2 18h14a1.994 1.994 0 0 0 1.7-.95 1.967 1.967 0 0 0 .09-1.94zM9 16a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 9 16zm.98-4.806a1 1 0 0 1-1.96 0l-.99-5A1 1 0 0 1 8.01 5h1.983a1 1 0 0 1 .98 1.194z"/>
			<path fill="#FFFFFF" d="M9 16a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 9 16zm.98-4.806a1 1 0 0 1-1.96 0l-.99-5A1 1 0 0 1 8.01 5h1.983a1 1 0 0 1 .98 1.194z"/>
		</svg>`;

		const svgWithSemanticVariables = `<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
			<path fill="var(--d2l-theme-status-color-error)" d="M17.79 15.11l-7-14a2 2 0 0 0-3.58 0l-7 14a1.975 1.975 0 0 0 .09 1.94A2 2 0 0 0 2 18h14a1.994 1.994 0 0 0 1.7-.95 1.967 1.967 0 0 0 .09-1.94zM9 16a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 9 16zm.98-4.806a1 1 0 0 1-1.96 0l-.99-5A1 1 0 0 1 8.01 5h1.983a1 1 0 0 1 .98 1.194z"/>
			<path fill="var(--d2l-theme-background-color-base)" d="M9 16a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 9 16zm.98-4.806a1 1 0 0 1-1.96 0l-.99-5A1 1 0 0 1 8.01 5h1.983a1 1 0 0 1 .98 1.194z"/>
		</svg>`;

		[
			{ name: 'resolves-colors', svg: svgWithSemanticVariables },
			{ name: 'resolves-colors-dark', colorMode: 'dark', svg: svgWithSemanticVariables },
			{ name: 'does-not-resolves-colors', svg: svgWithNonSemanticVariables },
			{ name: 'does-not-resolves-colors-dark', colorMode: 'dark', svg: svgWithNonSemanticVariables }
		].forEach(({ name, colorMode, svg }) => {

			it(name, async() => {
				const cssVariableName = `--d2l-test-icon${++cssVariableIndex}`;
				registerSemanticVariableForSvgImageUrl(cssVariableName, svg);

				const elem = await fixture(html`
					<div style="background-image: var(${cssVariableName}); background-repeat: no-repeat; display: inline-block; height: 18px; width: 18px;"></div>
				`, { colorMode });

				await expect(elem).to.be.golden();
			});

		});

	});

});

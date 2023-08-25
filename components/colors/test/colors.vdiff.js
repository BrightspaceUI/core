import '../colors.js';
import '../demo/color-swatch.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

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
});

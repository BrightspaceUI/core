import '@webcomponents/shadycss/entrypoints/custom-style-interface.js';

if (!document.head.querySelector('#d2l-colors')) {
	const style = document.createElement('style');
	style.id = 'd2l-colors';
	style.textContent = `
		html {
			/* basic grays (lightest to darkest) */
			--d2l-color-regolith: #f9fbff;
			--d2l-color-sylvite: #f1f5fb;
			--d2l-color-gypsum: #e3e9f1;
			--d2l-color-mica: #cdd5dc;
			--d2l-color-corundum: #b5bdc2;
			--d2l-color-chromite: #9ea5a9;
			--d2l-color-galena: #868c8f;
			--d2l-color-tungsten: #6e7376;
			--d2l-color-ferrite: #494c4e;

			/* zircon */
			--d2l-color-zircon-plus-2: #bbf1fa;
			--d2l-color-zircon-plus-1: #00bddd;
			--d2l-color-zircon: #00849c;
			--d2l-color-zircon-minus-1: #005b6b;

			/* celestine */
			--d2l-color-celestine-plus-2: #e8f2f9;
			--d2l-color-celestine-plus-1: #29a6ff;
			--d2l-color-celestine: #006fbf;
			--d2l-color-celestine-minus-1: #005694;

			/* amethyst */
			--d2l-color-amethyst-plus-2: #e9e6ff;
			--d2l-color-amethyst-plus-1: #afa1ff;
			--d2l-color-amethyst: #7862f0;
			--d2l-color-amethyst-minus-1: #4c3f99;

			/* fluorite */
			--d2l-color-fluorite-plus-2: #f6e1fa;
			--d2l-color-fluorite-plus-1: #ea82ff;
			--d2l-color-fluorite: #b24ac7;
			--d2l-color-fluorite-minus-1: #7e358c;

			/* tourmaline */
			--d2l-color-tourmaline-plus-2: #fae1ed;
			--d2l-color-tourmaline-plus-1: #ff389b;
			--d2l-color-tourmaline: #bf2a75;
			--d2l-color-tourmaline-minus-1: #96215c;

			/* cinnabar */
			--d2l-color-cinnabar-plus-2: #fae1e2;
			--d2l-color-cinnabar-plus-1: #ff6b70;
			--d2l-color-cinnabar: #cd2026;
			--d2l-color-cinnabar-minus-1: #a1191d;

			/* carnelian */
			--d2l-color-carnelian-plus-1: #fae3cf;
			--d2l-color-carnelian: #e87511;
			--d2l-color-carnelian-minus-1: #a6540d;
			--d2l-color-carnelian-minus-2: #804008;

			/* citrine */
			--d2l-color-citrine-plus-1: #fae5c8;
			--d2l-color-citrine: #ffba59;
			--d2l-color-citrine-minus-1: #a87b3b;
			--d2l-color-citrine-minus-2: #694b25;

			/* topaz */
			--d2l-color-topaz-plus-1: #fffbb2;
			--d2l-color-topaz: #f5ec5a;
			--d2l-color-topaz-minus-1: #a69f21;
			--d2l-color-topaz-minus-2: #635f15;

			/* peridot */
			--d2l-color-peridot-plus-1: #cdf2b1;
			--d2l-color-peridot: #8ccd5a;
			--d2l-color-peridot-minus-1: #59823a;
			--d2l-color-peridot-minus-2: #3d5926;

			/* olivine */
			--d2l-color-olivine-plus-1: #a5fabd;
			--d2l-color-olivine: #46a661;
			--d2l-color-olivine-minus-1: #327846;
			--d2l-color-olivine-minus-2: #275c36;

			/* malachite */
			--d2l-color-malachite-plus-1: #a1f7f4;
			--d2l-color-malachite: #00afaa;
			--d2l-color-malachite-minus-1: #017d79;
			--d2l-color-malachite-minus-2: #005e5b;

			/* primary accent */
			--d2l-color-primary-accent-action: var(--d2l-color-celestine);
			--d2l-color-primary-accent-indicator: var(--d2l-color-carnelian);

			/* feedback */
			--d2l-color-feedback-error: var(--d2l-color-cinnabar);
			--d2l-color-feedback-warning: var(--d2l-color-citrine);
			--d2l-color-feedback-success: var(--d2l-color-olivine);
			--d2l-color-feedback-action: var(--d2l-color-celestine-plus-1);
		}
	`;
	document.head.appendChild(style);
	window.ShadyCSS.CustomStyleInterface.addCustomStyle(style);
}

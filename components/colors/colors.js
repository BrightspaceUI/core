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
			--d2l-color-corundum: #b1b9be;
			--d2l-color-chromite: #90989d;
			--d2l-color-galena: #6e7477;
			--d2l-color-tungsten: #494c4e;
			--d2l-color-ferrite: #202122;

			/* zircon */
			--d2l-color-zircon-plus-2: #e0feff;
			--d2l-color-zircon-plus-1: #00d2ed;
			--d2l-color-zircon: #008eab;
			--d2l-color-zircon-minus-1: #035670;

			/* celestine */
			--d2l-color-celestine-plus-2: #e8f8ff;
			--d2l-color-celestine-plus-1: #29a6ff;
			--d2l-color-celestine: #006fbf;
			--d2l-color-celestine-minus-1: #004489;

			/* amethyst */
			--d2l-color-amethyst-plus-2: #f2f0ff;
			--d2l-color-amethyst-plus-1: #8982ff;
			--d2l-color-amethyst: #6038ff;
			--d2l-color-amethyst-minus-1: #4500db;

			/* fluorite */
			--d2l-color-fluorite-plus-2: #f9ebff;
			--d2l-color-fluorite-plus-1: #ce68fa;
			--d2l-color-fluorite: #9d1fd4;
			--d2l-color-fluorite-minus-1: #6900a0;

			/* tourmaline */
			--d2l-color-tourmaline-plus-2: #ffebf6;
			--d2l-color-tourmaline-plus-1: #fd4e9d;
			--d2l-color-tourmaline: #d40067;
			--d2l-color-tourmaline-minus-1: #990056;

			/* cinnabar */
			--d2l-color-cinnabar-plus-2: #ffede8;
			--d2l-color-cinnabar-plus-1: #ff575a;
			--d2l-color-cinnabar: #b01015;
			--d2l-color-cinnabar-minus-1: #990006;

			/* carnelian */
			--d2l-color-carnelian-plus-1: #fff3e0;
			--d2l-color-carnelian: #e87511;
			--d2l-color-carnelian-minus-1: #ba4700;
			--d2l-color-carnelian-minus-2: #7d2600;

			/* citrine */
			--d2l-color-citrine-plus-1: #fff9d6;
			--d2l-color-citrine: #ffba59;
			--d2l-color-citrine-minus-1: #c47400;
			--d2l-color-citrine-minus-2: #7a4300;

			/* peridot */
			--d2l-color-peridot-plus-1: #efffd9;
			--d2l-color-peridot: #8ad934;
			--d2l-color-peridot-minus-1: #4a8f00;
			--d2l-color-peridot-minus-2: #2f5e00;

			/* olivine */
			--d2l-color-olivine-plus-1: #e7ffe3;
			--d2l-color-olivine: #46a661;
			--d2l-color-olivine-minus-1: #027a21;
			--d2l-color-olivine-minus-2: #005614;

			/* malachite */
			--d2l-color-malachite-plus-1: #e3fff5;
			--d2l-color-malachite: #2de2c0;
			--d2l-color-malachite-minus-1: #00a490;
			--d2l-color-malachite-minus-2: #00635e;

			/* primary accent */
			--d2l-color-primary-accent-action: var(--d2l-color-celestine);
			--d2l-color-primary-accent-indicator: var(--d2l-color-carnelian);

			/* feedback */
			--d2l-color-feedback-error: var(--d2l-color-cinnabar);
			--d2l-color-feedback-warning: var(--d2l-color-carnelian);
			--d2l-color-feedback-success: var(--d2l-color-olivine);
			--d2l-color-feedback-action: var(--d2l-color-celestine);
		}
	`;
	document.head.appendChild(style);
}

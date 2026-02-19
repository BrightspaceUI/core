if (globalThis.document !== undefined && !globalThis.document.head.querySelector('#d2l-colors')) {
	const style = globalThis.document.createElement('style');
	style.id = 'd2l-colors';

	const lightPalette = `
		--d2l-color-border-emphasized: var(--d2l-color-galena);
		--d2l-color-border-focus: var(--d2l-color-brand-primary-default);
		--d2l-color-border-standard: var(--d2l-color-mica);
		--d2l-color-border-status-error: var(--d2l-color-control-status-error);
		--d2l-color-border-subtle: var(--d2l-color-gypsum);
		--d2l-color-brand-highlight: var(--d2l-color-celestine-plus-2);
		--d2l-color-brand-primary-default: var(--d2l-color-celestine);
		--d2l-color-brand-primary-hover: var(--d2l-color-celestine-minus-1);
		--d2l-color-container-base: #ffffff;
		--d2l-color-container-elevated: var(--d2l-color-container-base);
		--d2l-color-container-floating: var(--d2l-color-container-base);
		--d2l-color-container-sunken: #f6f7f8;
		--d2l-color-control-emphasized-default: var(--d2l-color-brand-primary-default);
		--d2l-color-control-emphasized-hover: var(--d2l-color-brand-primary-hover);
		--d2l-color-control-faint-default: var(--d2l-color-regolith);
		--d2l-color-control-faint-hover: var(--d2l-color-sylvite);
		--d2l-color-control-highlighted-default: var(--d2l-color-brand-highlight);
		--d2l-color-control-muted-default: var(--d2l-color-sylvite);
		--d2l-color-control-standard-default: var(--d2l-color-gypsum);
		--d2l-color-control-standard-hover: var(--d2l-color-mica);
		--d2l-color-control-status-default: var(--d2l-color-celestine);
		--d2l-color-control-status-error: var(--d2l-color-cinnabar);
		--d2l-color-control-status-success: var(--d2l-color-olivine);
		--d2l-color-control-status-warning: var(--d2l-color-carnelian);
		--d2l-color-control-sunken-default: #ffffff;
		--d2l-color-control-translucent-default: #000000;
		--d2l-color-control-translucent-hover: var(--d2l-color-brand-primary-default);
		--d2l-color-icon-onemphasized: #ffffff;
		--d2l-color-icon-ontranslucent: #ffffff;
		--d2l-color-icon-separator: var(--d2l-color-border-standard);
		--d2l-color-icon-standard: var(--d2l-color-tungsten);
		--d2l-color-icon-status-error: var(--d2l-color-cinnabar);
		--d2l-color-icon-status-info: var(--d2l-color-brand-primary-default);
		--d2l-color-icon-status-success: var(--d2l-color-olivine);
		--d2l-color-icon-status-warning: var(--d2l-color-carnelian);
		--d2l-color-shadow-attached: #000000;
		--d2l-color-shadow-floating: #000000;
		--d2l-color-text-interactive-default: var(--d2l-color-brand-primary-default);
		--d2l-color-text-interactive-hover: var(--d2l-color-brand-primary-hover);
		--d2l-color-text-interactive-onemphasized: #ffffff;
		--d2l-color-text-static-faint: var(--d2l-color-galena);
		--d2l-color-text-static-onemphasized: #ffffff;
		--d2l-color-text-static-standard: var(--d2l-color-ferrite);
		--d2l-color-text-static-subtle: var(--d2l-color-tungsten);
		--d2l-color-text-status-default: var(--d2l-color-brand-primary-default);
		--d2l-color-text-status-error: var(--d2l-color-cinnabar);
		--d2l-color-text-status-success: var(--d2l-color-olivine-minus-1);
		--d2l-color-text-status-warning: var(--d2l-color-carnelian-minus-1);

		--d2l-opacity-disabled-control: 0.5;
		--d2l-opacity-disabled-link: 0.74;
		--d2l-opacity-disabled-linkicon: 0.64;

		--d2l-shadow-attached-color: rgba(0, 0, 0, 0.03);
		--d2l-shadow-attached-offset-x: 0;
		--d2l-shadow-attached-offset-y: 2px;
		--d2l-shadow-attached-blur: 4px;
		--d2l-shadow-attached-spread: 0;
		--d2l-shadow-attached: var(--d2l-shadow-attached-offset-x) var(--d2l-shadow-attached-offset-y) var(--d2l-shadow-attached-blur) var(--d2l-shadow-attached-spread) var(--d2l-shadow-attached-color);
		--d2l-shadow-floating-color: rgba(0, 0, 0, 0.15);
		--d2l-shadow-floating-offset-x: 0;
		--d2l-shadow-floating-offset-y: 2px;
		--d2l-shadow-floating-blur: 12px;
		--d2l-shadow-floating-spread: 0;
		--d2l-shadow-floating: var(--d2l-shadow-floating-offset-x) var(--d2l-shadow-floating-offset-y) var(--d2l-shadow-floating-blur) var(--d2l-shadow-floating-spread) var(--d2l-shadow-floating-color);
		--d2l-shadow-inset-color: rgba(177, 185, 190, 0.2); /* corundum */
		--d2l-shadow-inset-offset-x: 0;
		--d2l-shadow-inset-offset-y: 2px;
		--d2l-shadow-inset-blur: 0;
		--d2l-shadow-inset-spread: 0;
		--d2l-shadow-inset: inset var(--d2l-shadow-inset-offset-x) var(--d2l-shadow-inset-offset-y) var(--d2l-shadow-inset-blur) var(--d2l-shadow-inset-spread) var(--d2l-shadow-inset-color);
	`;
	const darkPalette = `
		--d2l-color-border-emphasized: var(--d2l-color-galena);
		--d2l-color-border-focus: var(--d2l-color-brand-primary-default);
		--d2l-color-border-standard: var(--d2l-color-tungsten);
		--d2l-color-border-status-error: var(--d2l-color-control-status-error);
		--d2l-color-border-subtle: var(--d2l-color-ferrite);
		--d2l-color-brand-highlight: var(--d2l-color-celestine-minus-1);
		--d2l-color-brand-primary-default: var(--d2l-color-celestine-plus-1);
		--d2l-color-brand-primary-hover: var(--d2l-color-celestine);
		--d2l-color-container-base: #161718;
		--d2l-color-container-elevated: var(--d2l-color-ferrite);
		--d2l-color-container-floating: var(--d2l-color-ferrite);
		--d2l-color-container-sunken: #000000;
		--d2l-color-control-emphasized-default: var(--d2l-color-brand-primary-default);
		--d2l-color-control-emphasized-hover: var(--d2l-color-brand-primary-hover);
		--d2l-color-control-faint-default: var(--d2l-color-ferrite);
		--d2l-color-control-faint-hover: #303335;
		--d2l-color-control-highlighted-default: var(--d2l-color-brand-highlight);
		--d2l-color-control-muted-default: #303335;
		--d2l-color-control-standard-default: #303335;
		--d2l-color-control-standard-hover: var(--d2l-color-ferrite);
		--d2l-color-control-status-default: var(--d2l-color-brand-primary-default);
		--d2l-color-control-status-error: var(--d2l-color-cinnabar-plus-1);
		--d2l-color-control-status-success: var(--d2l-color-icon-status-success);
		--d2l-color-control-status-warning: var(--d2l-color-icon-status-warning);
		--d2l-color-control-sunken-default: var(--d2l-color-container-sunken);
		--d2l-color-control-translucent-default: #000000;
		--d2l-color-control-translucent-hover: var(--d2l-color-brand-primary-default);
		--d2l-color-icon-onemphasized: #161718;
		--d2l-color-icon-ontranslucent: #ffffff;
		--d2l-color-icon-separator: var(--d2l-color-border-standard);
		--d2l-color-icon-standard: var(--d2l-color-corundum);
		--d2l-color-icon-status-error: var(--d2l-color-cinnabar);
		--d2l-color-icon-status-info: var(--d2l-color-brand-primary-default);
		--d2l-color-icon-status-success: var(--d2l-color-olivine);
		--d2l-color-icon-status-warning: var(--d2l-color-carnelian);
		--d2l-color-shadow-attached: #000000;
		--d2l-color-shadow-floating: #000000;
		--d2l-color-text-interactive-default: var(--d2l-color-brand-primary-default);
		--d2l-color-text-interactive-hover: var(--d2l-color-brand-primary-hover);
		--d2l-color-text-interactive-onemphasized: var(--d2l-color-ferrite);
		--d2l-color-text-static-faint: var(--d2l-color-galena);
		--d2l-color-text-static-onemphasized: #161718;
		--d2l-color-text-static-standard: var(--d2l-color-mica);
		--d2l-color-text-static-subtle: var(--d2l-color-chromite);
		--d2l-color-text-status-default: var(--d2l-color-brand-primary-default);
		--d2l-color-text-status-error: var(--d2l-color-cinnabar-plus-1);
		--d2l-color-text-status-success: var(--d2l-color-icon-status-success);
		--d2l-color-text-status-warning: var(--d2l-color-icon-status-warning);

		--d2l-opacity-disabled-control: 0.5;
		--d2l-opacity-disabled-link: 0.74;
		--d2l-opacity-disabled-linkicon: 0.64;

		--d2l-shadow-attached-color: rgba(0, 0, 0, 0.03);
		--d2l-shadow-attached-offset-x: 0;
		--d2l-shadow-attached-offset-y: 2px;
		--d2l-shadow-attached-blur: 4px;
		--d2l-shadow-attached-spread: 0;
		--d2l-shadow-attached: var(--d2l-shadow-attached-offset-x) var(--d2l-shadow-attached-offset-y) var(--d2l-shadow-attached-blur) var(--d2l-shadow-attached-spread) var(--d2l-shadow-attached-color);
		--d2l-shadow-floating-color: rgba(0, 0, 0, 0.85);
		--d2l-shadow-floating-offset-x: 0;
		--d2l-shadow-floating-offset-y: 2px;
		--d2l-shadow-floating-blur: 12px;
		--d2l-shadow-floating-spread: 0;
		--d2l-shadow-floating: var(--d2l-shadow-floating-offset-x) var(--d2l-shadow-floating-offset-y) var(--d2l-shadow-floating-blur) var(--d2l-shadow-floating-spread) var(--d2l-shadow-floating-color);
		--d2l-shadow-inset-color: rgba(177, 185, 190, 0.2); /* corundum */
		--d2l-shadow-inset-offset-x: 0;
		--d2l-shadow-inset-offset-y: 2px;
		--d2l-shadow-inset-blur: 0;
		--d2l-shadow-inset-spread: 0;
		--d2l-shadow-inset: inset var(--d2l-shadow-inset-offset-x) var(--d2l-shadow-inset-offset-y) var(--d2l-shadow-inset-blur) var(--d2l-shadow-inset-spread) var(--d2l-shadow-inset-color);
	`;

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
			--d2l-color-cinnabar: #cd2026;
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

		/* semantic palette */
		html {
			${lightPalette}
		}
		html[data-color-mode="dark"] {
			${darkPalette}
		}
		@media (prefers-color-scheme: dark) {
			html[data-color-mode="os"] {
				${darkPalette}
			}
		}
	`;
	globalThis.document.head.appendChild(style);
}

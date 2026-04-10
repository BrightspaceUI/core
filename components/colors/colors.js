if (globalThis.document !== undefined && !globalThis.document.head.querySelector('#d2l-colors')) {
	const style = globalThis.document.createElement('style');
	style.id = 'd2l-colors';

	// Note: do not use these semantic variables outside of core yet - they are subject to change
	const lightPalette = `
		--d2l-theme-background-color-base: #ffffff;
		--d2l-theme-background-color-elevated: var(--d2l-theme-background-color-base);
		--d2l-theme-background-color-floating: var(--d2l-theme-background-color-base);
		--d2l-theme-background-color-interactive-faint-default: var(--d2l-color-regolith);
		--d2l-theme-background-color-interactive-faint-hover: var(--d2l-color-sylvite);
		--d2l-theme-background-color-interactive-highlighted: var(--d2l-theme-brand-color-highlight);
		--d2l-theme-background-color-interactive-primary-default: var(--d2l-theme-brand-color-primary-default);
		--d2l-theme-background-color-interactive-primary-hover: var(--d2l-theme-brand-color-primary-hover);
		--d2l-theme-background-color-interactive-secondary-default: var(--d2l-color-gypsum);
		--d2l-theme-background-color-interactive-secondary-hover: var(--d2l-color-mica);
		--d2l-theme-background-color-interactive-tertiary-default: transparent;
		--d2l-theme-background-color-interactive-tertiary-hover: var(--d2l-theme-background-color-interactive-secondary-default);
		--d2l-theme-background-color-interactive-translucent-default: #00000080;
		--d2l-theme-background-color-interactive-translucent-hover: var(--d2l-theme-brand-color-primary-default);
		--d2l-theme-background-color-sunken: #f6f7f8;
		--d2l-theme-border-color-emphasized: var(--d2l-color-galena);
		--d2l-theme-border-color-focus: var(--d2l-color-celestine);
		--d2l-theme-border-color-standard: var(--d2l-color-mica);
		--d2l-theme-border-color-subtle: var(--d2l-color-gypsum);
		--d2l-theme-brand-color-highlight: var(--d2l-color-celestine-plus-2);
		--d2l-theme-brand-color-primary-default: var(--d2l-color-celestine);
		--d2l-theme-brand-color-primary-hover: var(--d2l-color-celestine-minus-1);
		--d2l-theme-icon-color-faint: var(--d2l-theme-border-color-standard);
		--d2l-theme-icon-color-inverted: #ffffff;
		--d2l-theme-icon-color-standard: var(--d2l-color-tungsten);
		--d2l-theme-shadow-attached-color: #00000008;
		--d2l-theme-shadow-floating-color: #00000026;
		--d2l-theme-status-color-default: var(--d2l-color-celestine);
		--d2l-theme-status-color-error: var(--d2l-color-cinnabar);
		--d2l-theme-status-color-success-text: var(--d2l-color-olivine-minus-1);
		--d2l-theme-status-color-success: var(--d2l-color-olivine);
		--d2l-theme-status-color-warning-text: var(--d2l-color-carnelian-minus-1);
		--d2l-theme-status-color-warning: var(--d2l-color-carnelian);
		--d2l-theme-text-color-interactive-default: var(--d2l-theme-brand-color-primary-default);
		--d2l-theme-text-color-interactive-hover: var(--d2l-theme-brand-color-primary-hover);
		--d2l-theme-text-color-static-faint: var(--d2l-color-galena);
		--d2l-theme-text-color-static-inverted: #ffffff;
		--d2l-theme-text-color-static-standard: var(--d2l-color-ferrite);
		--d2l-theme-text-color-static-subtle: var(--d2l-color-tungsten);

		--d2l-theme-badge-background-color: var(--d2l-color-gypsum);
		--d2l-theme-badge-text-color: var(--d2l-theme-text-color-static-standard);
		--d2l-theme-notification-background-color: var(--d2l-color-carnelian-minus-1);
		--d2l-theme-notification-text-color: #ffffff;
		--d2l-theme-text-color-static-disabled: #20212280; /* --d2l-theme-text-color-static-standard at 50% opacity, remove once color-mix is widely supported */

		--d2l-theme-opacity-disabled-control: 0.5;
		--d2l-theme-opacity-disabled-link: 0.74;
		--d2l-theme-opacity-disabled-linkicon: 0.64;

		--d2l-theme-shadow-attached: 0 2px 4px 0 rgba(0, 0, 0, 0.03);
		--d2l-theme-shadow-attached-block-start: 0 2px 4px 0 rgba(0, 0, 0, 0.03);
		--d2l-theme-shadow-attached-block-end: 0 -2px 4px 0 rgba(0, 0, 0, 0.03);
		--d2l-theme-shadow-floating: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
		--d2l-theme-shadow-inset: inset 0 2px 0 0 rgba(177, 185, 190, 0.2); /* corundum */
	`;

	// Note: do not use these semantic variables outside of core yet - they are subject to change
	const darkPalette = `
		--d2l-theme-background-color-base: #161718;
		--d2l-theme-background-color-elevated: var(--d2l-color-ferrite);
		--d2l-theme-background-color-floating: var(--d2l-color-ferrite);
		--d2l-theme-background-color-interactive-faint-default: var(--d2l-color-ferrite);
		--d2l-theme-background-color-interactive-faint-hover: #303335;
		--d2l-theme-background-color-interactive-highlighted: var(--d2l-theme-brand-color-highlight);
		--d2l-theme-background-color-interactive-primary-default: var(--d2l-theme-brand-color-primary-default);
		--d2l-theme-background-color-interactive-primary-hover: var(--d2l-theme-brand-color-primary-hover);
		--d2l-theme-background-color-interactive-secondary-default: #303335;
		--d2l-theme-background-color-interactive-secondary-hover: var(--d2l-color-ferrite);
		--d2l-theme-background-color-interactive-tertiary-default: transparent;
		--d2l-theme-background-color-interactive-tertiary-hover: var(--d2l-theme-background-color-interactive-secondary-default);
		--d2l-theme-background-color-interactive-translucent-default: #00000080;
		--d2l-theme-background-color-interactive-translucent-hover: var(--d2l-theme-brand-color-primary-default);
		--d2l-theme-background-color-sunken: #000000;
		--d2l-theme-border-color-emphasized: var(--d2l-color-galena);
		--d2l-theme-border-color-focus: var(--d2l-color-celestine-plus-1);
		--d2l-theme-border-color-standard: var(--d2l-color-tungsten);
		--d2l-theme-border-color-subtle: #303335;
		--d2l-theme-brand-color-highlight: #161718;
		--d2l-theme-brand-color-primary-default: var(--d2l-color-celestine-plus-1);
		--d2l-theme-brand-color-primary-hover: var(--d2l-color-celestine);
		--d2l-theme-icon-color-faint: var(--d2l-theme-border-color-standard);
		--d2l-theme-icon-color-inverted: #ffffff;
		--d2l-theme-icon-color-standard: var(--d2l-color-corundum);
		--d2l-theme-shadow-attached-color: #000000d9;
		--d2l-theme-shadow-floating-color: #000000d9;
		--d2l-theme-status-color-default: var(--d2l-theme-brand-color-primary-default);
		--d2l-theme-status-color-error: var(--d2l-color-cinnabar-plus-1);
		--d2l-theme-status-color-success-text: #ffffff;
		--d2l-theme-status-color-success: var(--d2l-color-olivine);
		--d2l-theme-status-color-warning-text: var(--d2l-color-carnelian);
		--d2l-theme-status-color-warning: var(--d2l-color-carnelian);
		--d2l-theme-text-color-interactive-default: var(--d2l-theme-brand-color-primary-default);
		--d2l-theme-text-color-interactive-hover: var(--d2l-theme-brand-color-primary-hover);
		--d2l-theme-text-color-static-faint: var(--d2l-color-galena);
		--d2l-theme-text-color-static-inverted: #161718;
		--d2l-theme-text-color-static-standard: var(--d2l-color-mica);
		--d2l-theme-text-color-static-subtle: var(--d2l-color-chromite);

		--d2l-theme-badge-background-color: #303335;
		--d2l-theme-badge-text-color: var(--d2l-theme-text-color-static-standard);
		--d2l-theme-notification-background-color: var(--d2l-color-carnelian-minus-1);
		--d2l-theme-notification-text-color: #ffffff;
		--d2l-theme-text-color-static-disabled: #cdd5dc80; /* --d2l-theme-text-color-static-standard at 50% opacity, remove once color-mix is widely supported */

		--d2l-theme-opacity-disabled-control: 0.5;
		--d2l-theme-opacity-disabled-link: 0.74;
		--d2l-theme-opacity-disabled-linkicon: 0.64;

		--d2l-theme-shadow-attached: 0 2px 4px 0 rgba(0, 0, 0, 0.85);
		--d2l-theme-shadow-attached-block-start: 0 2px 4px 0 rgba(0, 0, 0, 0.85);
		--d2l-theme-shadow-attached-block-end: 0 -2px 4px 0 rgba(0, 0, 0, 0.85);
		--d2l-theme-shadow-floating: 0 2px 12px 0 rgba(0, 0, 0, 0.85);
		--d2l-theme-shadow-inset: inset 0 2px 0 0 rgba(177, 185, 190, 0.2); /* corundum */
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

		@supports (color: color-mix(in srgb, black 50%, transparent)) {
			--d2l-theme-text-color-static-disabled: color-mix(in srgb, var(--d2l-theme-text-color-static-standard) 50%, transparent);
		}
	`;
	globalThis.document.head.appendChild(style);
}

import { css } from 'lit-element/lit-element.js';

export const buttonSubtleStyles = css`
	:host {
		display: inline-block;
	}
	:host([hidden]) {
		display: none;
	}

	button {
		background-color: transparent;
		border-color: transparent;
		font-family: inherit;
		padding: 0.5rem 0.6rem;
		position: relative;
	}

	:host([h-align="text"]) button {
		left: -0.6rem;
	}
	:host(:dir(rtl)):host([h-align="text"]) button,
	:host(:dir(rtl))[h-align="text"] button {
		left: 0;
		right: -0.6rem;
	}

	/* Firefox includes a hidden border which messes up button dimensions */
	button::-moz-focus-inner {
		border: 0;
	}
	button[disabled]:hover,
	button[disabled]:focus,
	:host([active]) button[disabled] {
		background-color: transparent;
	}
	button:hover,
	button:focus,
	:host([active]) button {
		background-color: var(--d2l-color-gypsum);
	}

	.d2l-button-subtle-content {
		color: var(--d2l-color-celestine);
		vertical-align: middle;
	}
	:host([icon]) .d2l-button-subtle-content {
		padding-left: 1.2rem;
	}
	:host([icon][icon-right]) .d2l-button-subtle-content {
		padding-left: 0;
		padding-right: 1.2rem;
	}

	:host(:dir(rtl)):host([icon]) .d2l-button-subtle-content,
	:host(:dir(rtl))[icon] .d2l-button-subtle-content {
		padding-left: 0;
		padding-right: 1.2rem;
	}

	:host(:dir(rtl)):host([icon]):host([icon-right]) .d2l-button-subtle-content,
	:host(:dir(rtl))[icon][icon-right] .d2l-button-subtle-content {
		padding-left: 1.2rem;
		padding-right: 0;
	}

	d2l-icon.d2l-button-subtle-icon {
		color: var(--d2l-color-celestine);
		display: none;
		height: 0.9rem;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 0.9rem;
	}
	:host([icon]) d2l-icon.d2l-button-subtle-icon {
		display: inline-block;
	}
	:host([icon][icon-right]) d2l-icon.d2l-button-subtle-icon {
		right: 0.6rem;
	}
	:host([dir="rtl"][icon][icon-right]) d2l-icon.d2l-button-subtle-icon,
	:host(:dir(rtl))[icon][icon-right] d2l-icon.d2l-button-subtle-icon {
		left: 0.6rem;
		right: auto;
	}

	button[disabled] {
		cursor: default;
		opacity: 0.5;
	}
`;

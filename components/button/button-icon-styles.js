import { css } from 'lit-element/lit-element.js';

export const buttonIconStyles = css`
	:host {
		display: inline-block;
		--d2l-button-icon-border-radius: 0.3rem;
		--d2l-button-icon-min-height: calc(2rem + 2px);
		--d2l-button-icon-min-width: calc(2rem + 2px);
		--d2l-button-icon-h-align: calc(((2rem + 2px - 0.9rem) / 2) * -1);
	}
	:host([hidden]) {
		display: none;
	}

	button {
		background-color: transparent;
		border-color: transparent;
		font-family: inherit;
		border-radius: var(--d2l-button-icon-border-radius);
		min-height: var(--d2l-button-icon-min-height);
		min-width: var(--d2l-button-icon-min-width);
		position: relative;
	}

	:host([h-align="text"]) button {
		left: var(--d2l-button-icon-h-align);
	}
	:host([dir="rtl"][h-align="text"]) button {
		left: 0;
		right: var(--d2l-button-icon-h-align);
	}

	// Firefox includes a hidden border which messes up button dimensions
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

	.d2l-button-icon {
		height: 0.9rem;
		width: 0.9rem;
	}

	:host([translucent]) button {
		background-color: rgba(0,0,0,0.5);
		transition: background-color 0.5s;
	}
	:host([translucent]) .d2l-button-icon {
		color: white;
	}
	:host([active][translucent]) button,
	:host([translucent]) button:hover,
	:host([translucent]) button:focus {
		border: none;
		background-color: var(--d2l-color-celestine);
		box-shadow: none;
	}

	button[disabled] {
		cursor: default;
		opacity: 0.5;
	}
`;

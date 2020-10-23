import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const menuItemStyles = css`
	:host {
		background-color: #ffffff;
		border: 1px solid transparent;
		border-top-color: var(--d2l-color-gypsum);
		box-sizing: border-box;
		color: var(--d2l-color-ferrite);
		cursor: pointer;
		display: block;
		font-size: 0.8rem;
		margin-top: -1px;
		outline: none;
		width: 100%;
	}

	:host(:focus),
	:host(:hover),
	:host([first]:focus),
	:host([first]:hover) {
		background-color: var(--d2l-color-celestine-plus-2);
		border-bottom: 1px solid var(--d2l-color-celestine);
		border-top: 1px solid var(--d2l-color-celestine);
		color: var(--d2l-color-celestine-minus-1);
		z-index: 2;
	}

	:host([disabled]), :host([disabled]:hover), :host([disabled]:focus) {
		cursor: default;
		opacity: 0.75;
	}

	:host([hidden]) {
		display: none;
	}

	:host([first]) {
		border-top-color: transparent;
	}

	:host([last]:focus),
	:host([last]:hover) {
		border-bottom-color: var(--d2l-color-celestine);
	}

	.d2l-menu-item-text {
		flex: auto;
		line-height: 1rem;
		overflow-x: hidden;
		overflow-y: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.d2l-menu-item-supporting {
		flex: 0 0 auto;
		line-height: 1rem;
		margin-left: 6px;
	}
	:host([dir="rtl"]) .d2l-menu-item-supporting {
		margin-left: 0;
		margin-right: 6px;
	}
`;

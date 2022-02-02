import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const menuItemStyles = css`
	:host {
		background-color: var(--d2l-menu-background-color);
		border: 1px solid transparent;
		border-top-color: var(--d2l-menu-border-color);
		box-sizing: border-box;
		color: var(--d2l-menu-foreground-color);
		cursor: pointer;
		display: block;
		font-size: 0.8rem;
		margin-top: -1px;
		outline: none;
		width: 100%;
	}

	:host(:hover),
	:host(.focus-visible),
	:host(.focus-visible[first]),
	:host(:focus-visible),
	:host(:focus-visible[first]),
	:host([first]:hover) {
		background-color: var(--d2l-menu-background-color-hover);
		border-bottom: 1px solid var(--d2l-menu-border-color-hover);
		border-top: 1px solid var(--d2l-menu-border-color-hover);
		color: var(--d2l-menu-foreground-color-hover);
		z-index: 2;
	}

	:host([disabled]), :host([disabled]:hover), :host([disabled].focus-visible), :host([disabled]:focus-visible) {
		cursor: default;
		opacity: 0.75;
	}

	:host([hidden]) {
		display: none;
	}

	:host([first]) {
		border-top-color: transparent;
	}

	:host([last].focus-visible),
	:host([last]:focus-visible),
	:host([last]:hover) {
		border-bottom-color: var(--d2l-menu-border-color-hover);
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

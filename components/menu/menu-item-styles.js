import '../colors/colors.js';
import { css, unsafeCSS } from 'lit';
import { isFocusVisibleSupported } from '../../helpers/focus.js';

const focusPseudoClass = isFocusVisibleSupported() ? 'focus-visible' : 'focus';

export const menuItemStyles = css`
	:host {
		background-color: var(--d2l-menu-background-color);
		border-top: 1px solid var(--d2l-menu-border-color);
		box-sizing: border-box;
		color: var(--d2l-menu-foreground-color);
		cursor: pointer;
		display: block;
		font-size: 0.8rem;
		margin-top: -1px;
		width: 100%;
	}

	:host(:hover),
	:host([first]:hover) {
		background-color: var(--d2l-menu-background-color-hover);
		color: var(--d2l-menu-foreground-color-hover);
	}

	:host(:${unsafeCSS(focusPseudoClass)}),
	:host([first]:${unsafeCSS(focusPseudoClass)}) {
		border-radius: 6px;
		border-top-color: transparent;
		color: var(--d2l-menu-foreground-color-hover);
		outline: 2px solid var(--d2l-menu-border-color-hover) !important; /* override reset styles */
		outline-offset: -3px;
		z-index: 2;
	}

	:host([disabled]), :host([disabled]:hover) {
		cursor: default;
		opacity: 0.75;
	}

	:host([disabled]:${unsafeCSS(focusPseudoClass)}) {
		cursor: default;
		opacity: 0.75;
	}

	:host([hidden]) {
		display: none;
	}

	:host([first]) {
		border-top-color: transparent;
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

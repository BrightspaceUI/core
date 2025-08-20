import '../colors/colors.js';
import { css, unsafeCSS } from 'lit';
import { getFlag } from '../../helpers/flags.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { getOverflowDeclarations } from '../../helpers/overflow.js';

const overflowClipEnabled = getFlag('GAUD-7887-core-components-overflow-clipping', true);

export const menuItemStyles = css`
	:host {
		--d2l-menu-item-lines: 2;
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

	:host(:${unsafeCSS(getFocusPseudoClass())}),
	:host([first]:${unsafeCSS(getFocusPseudoClass())}) {
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

	:host([disabled]:${unsafeCSS(getFocusPseudoClass())}) {
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
		${overflowClipEnabled ? getOverflowDeclarations({ lines: 'var(--d2l-menu-item-lines, 2)' }) : css`
			-webkit-box-orient: vertical;
			display: -webkit-box;
			-webkit-line-clamp: var(--d2l-menu-item-lines, 2);
			overflow-wrap: anywhere;
			overflow-x: hidden;
			overflow-y: hidden;
			white-space: normal;
		`}
	}

	.d2l-menu-item-supporting {
		flex: 0 0 auto;
		line-height: 1rem;
		margin-inline-start: 6px;
	}
`;

import '../colors/colors.js';
import { css } from 'lit';
import { getFocusRingStyles } from '../../helpers/focus.js';

export const toolbarButtonStyles = css`
	:host {
		display: inline-block;
	}
	:host([hidden]) {
		display: none;
	}
	button {
		--d2l-focus-ring-offset: 0;
		align-items: center;
		background-color: transparent;
		border: none;
		border-radius: 0.2rem;
		box-sizing: border-box;
		color: var(--d2l-theme-text-color-static-standard);
		cursor: pointer;
		display: flex;
		fill: var(--d2l-theme-icon-color-standard);
		font-family: inherit;
		justify-content: center;
		margin: 0;
		min-height: 34px;
		min-width: 34px;
		outline: none;
		padding: 0;
		position: relative;
		text-align: center;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		vertical-align: middle;
		white-space: nowrap;
		width: auto;
		z-index: 0; /* create stacking context for the background so it can be animated */
	}
	button::-moz-focus-inner {
		border: 0;
	}
	.background {
		background-color: transparent;
		border-radius: 4px;
		height: 100%;
		position: absolute;
		transform: scale(0.1, 0.1);
		transition: background-color 150ms linear, transform 150ms linear;
		width: 100%;
		z-index: -1;
	}
	${getFocusRingStyles('button')}
	@supports not selector(:focus-visible) {
		button:hover > .background,
		button:focus > .background {
			background-color: var(--d2l-theme-background-color-interactive-secondary-default);
			transform: scale(1, 1);
		}
	}
	@supports selector(:focus-visible) {
		button:hover > .background,
		button:focus-visible > .background {
			background-color: var(--d2l-theme-background-color-interactive-secondary-default);
			transform: scale(1, 1);
		}
	}
	button[disabled],
	button[aria-disabled="true"] {
		cursor: default;
		opacity: var(--d2l-theme-opacity-disabled-control);
	}
	button[disabled]:hover,
	button[disabled]:focus {
		background-color: transparent;
		fill: var(--d2l-theme-text-color-static-standard);
	}
	@media (prefers-reduced-motion: reduce) {
		.background {
			transition: none;
		}
	}

	@supports not selector(:focus-visible) {
		:host([theme="dark"]) button:hover > .background,
		:host([theme="dark"]) button:focus > .background {
			background-color: var(--d2l-color-tungsten);
		}
	}
	@supports selector(:focus-visible) {
		:host([theme="dark"]) button:hover > .background,
		:host([theme="dark"]) button:focus-visible > .background {
			background-color: var(--d2l-color-tungsten);
		}
	}
	:host([theme="dark"]) button,
	:host([theme="dark"]) ::slotted(d2l-icon-custom),
	:host([theme="dark"]) d2l-icon {
		color: var(--d2l-color-regolith);
		fill: var(--d2l-color-regolith);
	}
`;

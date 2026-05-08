import '../colors/colors.js';
import { css } from 'lit';

export const highlightBorderStyles = css`
	.d2l-labs-navigation-highlight-border {
		background: transparent;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		display: block;
		height: 4px;
		left: -7px;
		position: absolute;
		top: 0;
		width: calc(100% + 14px);
	}
	*:focus > .d2l-labs-navigation-highlight-border,
	*:hover > .d2l-labs-navigation-highlight-border,
	*[active] > .d2l-labs-navigation-highlight-border {
		background: var(--d2l-color-celestine);
	}
`;

export const highlightButtonStyles = css`
	button {
		align-items: center;
		background: transparent;
		border: none;
		color: var(--d2l-color-ferrite);
		cursor: pointer;
		display: inline-flex;
		font-family: inherit;
		font-size: inherit;
		gap: 6px;
		height: 100%;
		margin: 0;
		min-height: 40px;
		outline: none;
		overflow: visible;
		padding: 0;
		position: relative;
		vertical-align: middle;
		white-space: nowrap;
	}
	/* Firefox includes a hidden border which messes up button dimensions */
	button::-moz-focus-inner {
		border: 0;
	}
	button:not([disabled]):hover,
	button:not([disabled]):focus,
	button[active] {
		--d2l-icon-fill-color: var(--d2l-color-celestine);
		color: var(--d2l-color-celestine);
		outline: none;
	}
	button[disabled] {
		cursor: default;
		opacity: 0.5;
	}
`;

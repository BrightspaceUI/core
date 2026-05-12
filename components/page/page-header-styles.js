import '../colors/colors.js';
import { css } from 'lit';

export const highlightBorderStyles = css`
	.d2l-page-header-highlight-border {
		background: transparent;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		display: block;
		height: 4px;
		inset-inline: -7px;
		position: absolute;
		top: 0;
	}
	*:focus > .d2l-page-header-highlight-border,
	*:hover > .d2l-page-header-highlight-border,
	*[active] > .d2l-page-header-highlight-border {
		background: var(--d2l-color-celestine);
	}
`;

export const highlightButtonStyles = css`
	button.d2l-page-header-highlight-button {
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
	button.d2l-page-header-highlight-button::-moz-focus-inner {
		border: 0;
	}
	button.d2l-page-header-highlight-button:not([disabled]):hover,
	button.d2l-page-header-highlight-button:not([disabled]):focus,
	button.d2l-page-header-highlight-button[active] {
		--d2l-icon-fill-color: var(--d2l-color-celestine);
		color: var(--d2l-color-celestine);
		outline: none;
	}
	button.d2l-page-header-highlight-button[disabled] {
		cursor: default;
		opacity: 0.5;
	}
`;

export const highlightLinkStyles = css`
	a.d2l-page-header-highlight-link {
		align-items: center;
		color: var(--d2l-color-ferrite);
		display: inline-flex;
		gap: 6px;
		height: 100%;
		min-height: 40px;
		position: relative;
		text-decoration: none;
		vertical-align: middle;
		white-space: nowrap;
	}
	a.d2l-page-header-highlight-link:hover,
	a.d2l-page-header-highlight-link:focus {
		--d2l-icon-fill-color: var(--d2l-color-celestine);
		color: var(--d2l-color-celestine);
		outline: none;
	}
`;

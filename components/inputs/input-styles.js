import '../colors/colors.js';
import { css, unsafeCSS } from 'lit';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { svgToCSS } from '../../helpers/svg-to-css.js';

const focusClass = unsafeCSS(getFocusPseudoClass());

export const invalidIcon = svgToCSS(`<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
	<path fill="#cd2026" d="M17.79 15.11l-7-14a2 2 0 0 0-3.58 0l-7 14a1.975 1.975 0 0 0 .09 1.94A2 2 0 0 0 2 18h14a1.994 1.994 0 0 0 1.7-.95 1.967 1.967 0 0 0 .09-1.94zM9 16a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 9 16zm.98-4.806a1 1 0 0 1-1.96 0l-.99-5A1 1 0 0 1 8.01 5h1.983a1 1 0 0 1 .98 1.194z"/>
	<path fill="#FFF" d="M9 16a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 9 16zm.98-4.806a1 1 0 0 1-1.96 0l-.99-5A1 1 0 0 1 8.01 5h1.983a1 1 0 0 1 .98 1.194z"/>
  </svg>`);

export const inputStyles = css`
	.d2l-input {
		background-color: var(--d2l-input-background-color, #ffffff);
		border-radius: var(--d2l-input-border-radius, 0.3rem);
		border-style: solid;
		box-shadow: inset 0 2px 0 0 rgba(177, 185, 190, 0.2); /* corundum */
		box-sizing: border-box;
		color: var(--d2l-color-ferrite);
		display: inline-block;
		font-family: inherit;
		font-size: 0.8rem;
		font-weight: 400;
		height: var(--d2l-input-height, auto);
		letter-spacing: 0.02rem;
		line-height: 1.2rem; /* using min-height AND line-height as IE11 doesn't support line-height on inputs */
		margin: 0;
		min-height: calc(2rem + 2px);
		min-width: calc(2rem + 1em);
		position: var(--d2l-input-position, relative); /* overridden by sticky headers in grades */
		text-align: var(--d2l-input-text-align, start);
		vertical-align: middle;
		width: 100%;
	}
	.d2l-input,
	.d2l-input:hover:disabled,
	.d2l-input:${focusClass}:disabled,
	[aria-invalid="true"].d2l-input:disabled {
		border-color: var(--d2l-input-border-color, var(--d2l-color-galena));
		border-width: 1px;
		padding: var(--d2l-input-padding, 0.4rem 0.75rem);
	}
	.d2l-input::placeholder {
		color: var(--d2l-color-galena);
		font-size: 0.8rem;
		font-weight: 400;
		opacity: 1; /* Firefox has non-1 default */
	}
	.d2l-input::-ms-input-placeholder {
		color: var(--d2l-color-galena);
		font-size: 0.8rem;
		font-weight: 400;
	}
	.d2l-input:hover,
	.d2l-input:${focusClass},
	.d2l-input-focus {
		border-color: var(--d2l-color-celestine);
		border-width: 2px;
		outline-style: none;
		outline-width: 0;
		padding: var(--d2l-input-padding-focus, calc(0.4rem - 1px) calc(0.75rem - 1px));
	}
	[aria-invalid="true"].d2l-input {
		border-color: var(--d2l-color-cinnabar);
	}
	.d2l-input:disabled {
		opacity: 0.5;
	}
	.d2l-input::-webkit-search-cancel-button,
	.d2l-input::-webkit-search-decoration {
		display: none;
	}
	.d2l-input::-ms-clear {
		display: none;
		height: 0;
		width: 0;
	}
	textarea.d2l-input {
		line-height: normal;
	}
	textarea.d2l-input,
	textarea.d2l-input:hover:disabled,
	textarea.d2l-input:${focusClass}:disabled,
	textarea[aria-invalid="true"].d2l-input:disabled {
		padding-block: 0.5rem;
	}
	textarea.d2l-input:hover,
	textarea.d2l-input:${focusClass} {
		padding: var(--d2l-input-padding-focus, calc(0.75rem - 1px));
		padding-block: calc(0.5rem - 1px);
	}
	textarea.d2l-input[aria-invalid="true"] {
		background-image: ${invalidIcon};
		background-position: top 12px var(--d2l-inline-end, right) 18px;
		background-repeat: no-repeat;
		background-size: 0.8rem 0.8rem;
		padding-inline-end: calc(18px + 0.8rem);
	}
	textarea.d2l-input-focus[aria-invalid="true"],
	textarea.d2l-input[aria-invalid="true"]:hover,
	textarea.d2l-input[aria-invalid="true"]:${focusClass} {
		background-position: top calc(12px - 1px) var(--d2l-inline-end, right) calc(18px - 1px);
		padding-inline-end: calc(18px + 0.8rem - 1px);
	}
	textarea[aria-invalid="true"].d2l-input:disabled {
		background-image: none;
	}

	@media (prefers-contrast: more) {
		[aria-invalid="true"].d2l-input {
			background-color: Field;
			border-color: var(--d2l-color-cinnabar);
			box-shadow: none;
			color: FieldText;
			forced-color-adjust: none;
		}
		.d2l-input-focus {
			border-color: Highlight;
		}
	}
`;

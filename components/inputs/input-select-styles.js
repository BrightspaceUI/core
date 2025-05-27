import '../colors/colors.js';
import { css, unsafeCSS } from 'lit';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { invalidIcon } from './input-styles.js';
import { svgToCSS } from '../../helpers/svg-to-css.js';

const focusClass = unsafeCSS(getFocusPseudoClass());

const chevron = svgToCSS(`<svg width="11" height="7" viewBox="0 0 11 7" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 2l4.5 4M10 2L5.5 6" stroke="#565A5C" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round"/>
</svg>`);

export const selectStyles = css`
	.d2l-input-select {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-color: #ffffff;
		background-image: ${chevron};
		background-origin: border-box;
		background-position: center right 17px;
		background-repeat: no-repeat;
		background-size: 11px 7px;
		border: none;
		border-radius: 0.3rem;
		box-shadow: inset 0 2px 0 1px rgba(177, 185, 190, 0.2); /* corundum */
		color: var(--d2l-color-ferrite);
		display: inline-block;
		font-family: inherit;
		font-size: 0.8rem;
		font-weight: 400;
		height: auto;
		letter-spacing: 0.02rem;
		line-height: 1.2rem;
		margin: 0;
		max-height: calc(2rem + 2px);
		outline: 1px solid var(--d2l-color-galena);
		outline-offset: -1px;
		padding-block: calc(0.4rem + 1px);
		padding-inline: calc(0.75rem + 1px) calc(2px + 0.8rem + 1px + 11px + 16px + 1px);
		vertical-align: middle;
	}
	:host([dir="rtl"]) .d2l-input-select {
		background-position: center left 17px;
	}

	.d2l-input-select:not([disabled]):hover,
	.d2l-input-select:not([disabled]):${focusClass} {
		box-shadow: inset 0 2px 0 2px rgba(177, 185, 190, 0.2); /* corundum */
		outline: 2px solid var(--d2l-color-celestine);
		outline-offset: -2px;
	}
	.d2l-input-select[aria-invalid="true"] {
		background-image: ${chevron}, ${invalidIcon};
		background-position: center right 17px, center right calc(1px + 11px + 17px);
		background-repeat: no-repeat, no-repeat;
		background-size: 11px 7px, 0.8rem 0.8rem;
	}
	.d2l-input-select[aria-invalid="true"],
	.d2l-input-select[aria-invalid="true"]:${focusClass},
	.d2l-input-select[aria-invalid="true"]:hover {
		outline-color: var(--d2l-color-cinnabar);
	}
	:host([dir="rtl"]) .d2l-input-select[aria-invalid="true"] {
		background-position: center left 17px, center left calc(1px + 11px + 17px);
	}
	.d2l-input-select:disabled {
		opacity: 0.5;
	}

	@media (prefers-contrast: more) {
		.d2l-input-select {
			appearance: auto;
			background-color: Field;
			background-image: none;
			border: none;
			border-inline-end: 0.75rem solid transparent;
			box-shadow: none;
			color: FieldText;
			forced-color-adjust: none;
			height: 2rem;
			outline: 1px solid ButtonBorder;
			padding-inline: 0.6rem 16px;
		}

		.d2l-input-select:not([disabled]):${focusClass},
		.d2l-input-select:not([disabled]):hover {
			box-shadow: none;
			outline: 2px solid Highlight;
		}

		.d2l-input-select:disabled {
			outline: 1px solid GrayText;
		}

		.d2l-input-select[aria-invalid="true"] {
			background-image: ${invalidIcon};
			background-position: center right calc(1px + 11px + 17px);
			background-repeat: no-repeat;
			background-size: 0.8rem 0.8rem;
		}

		.d2l-input-select[aria-invalid="true"],
		.d2l-input-select[aria-invalid="true"]:${focusClass},
		.d2l-input-select[aria-invalid="true"]:hover {
			outline-color: var(--d2l-color-cinnabar);
		}
		:host([dir="rtl"]) .d2l-input-select[aria-invalid="true"] {
			background-position: center left calc(1px + 11px + 17px);
		}
	}
`;

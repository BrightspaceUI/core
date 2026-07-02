import './input-styles.js';
import { css, unsafeCSS } from 'lit';
import { _isValidCssSelector } from '../../helpers/internal/css.js';
import { getFocusVisibleStyles } from '../../helpers/focus.js';
import { registerSemanticVariableForSvgImageUrl } from '../colors/colors.js';

registerSemanticVariableForSvgImageUrl(
	'--d2l-input-select-chevron-image',
	`<svg width="11" height="7" viewBox="0 0 11 7" xmlns="http://www.w3.org/2000/svg">
		<path d="M1 2l4.5 4M10 2L5.5 6" stroke="var(--d2l-theme-icon-color-standard)" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round"/>
	</svg>`
);

function _getSelectFocusStyles(selector) {
	const notDisabledSelector = `${selector}:not([disabled])`;
	const ariaInvalidSelector = `${selector}[aria-invalid="true"]`;

	return {
		notDisabled: getFocusVisibleStyles(notDisabledSelector, (selector) => css`${selector} {
			box-shadow: inset var(--d2l-theme-shadow-inset-offset-x) var(--d2l-theme-shadow-inset-offset-y) var(--d2l-theme-shadow-inset-blur-radius) 2px var(--d2l-theme-shadow-inset-color);
			outline: 2px solid var(--d2l-theme-border-color-focus);
			outline-offset: -2px;
		}`),
		ariaInvalid: getFocusVisibleStyles(ariaInvalidSelector, (selector) => css`${selector} {
			outline-color: var(--d2l-theme-status-color-error);
		}`),
		preferContrastNotDisabled: getFocusVisibleStyles(notDisabledSelector, (selector) => css`${selector} {
			box-shadow: none;
			outline: 2px solid Highlight;
		}`),
	};
}

/**
 * A private helper method that should not be used by general consumers
 */
export function _generateSelectStyles(selector) {
	if (!_isValidCssSelector(selector)) return '';
	const finalSelector = unsafeCSS(selector);
	const selectFocusStyles = _getSelectFocusStyles(finalSelector);

	return css`
		${finalSelector} {
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			background-color: var(--d2l-theme-background-color-base);
			background-image: var(--d2l-input-select-chevron-image);
			background-origin: border-box;
			background-position: center var(--d2l-inline-end, right) 17px;
			background-repeat: no-repeat;
			background-size: 11px 7px;
			border: none;
			border-radius: 0.3rem;
			box-shadow: inset var(--d2l-theme-shadow-inset-offset-x) var(--d2l-theme-shadow-inset-offset-y) var(--d2l-theme-shadow-inset-blur-radius) 1px var(--d2l-theme-shadow-inset-color);
			color: var(--d2l-theme-text-color-static-standard);
			display: inline-block;
			font-family: inherit;
			font-size: 0.8rem;
			font-weight: 400;
			height: auto;
			letter-spacing: 0.02rem;
			line-height: 1.2rem;
			margin: 0;
			max-height: calc(2rem + 2px);
			outline: 1px solid var(--d2l-theme-border-color-emphasized);
			outline-offset: -1px;
			padding-block: calc(0.4rem + 1px);
			padding-inline: calc(0.75rem + 1px) calc(2px + 0.8rem + 1px + 11px + 16px + 1px);
			vertical-align: middle;
		}

		${finalSelector}:not([disabled]):hover {
			box-shadow: inset var(--d2l-theme-shadow-inset-offset-x) var(--d2l-theme-shadow-inset-offset-y) var(--d2l-theme-shadow-inset-blur-radius) 2px var(--d2l-theme-shadow-inset-color);
			outline: 2px solid var(--d2l-theme-border-color-focus);
			outline-offset: -2px;
		}
		${selectFocusStyles.notDisabled}

		${finalSelector}[aria-invalid="true"] {
			background-image: var(--d2l-input-select-chevron-image), var(--d2l-input-invalid-image);
			background-position: center var(--d2l-inline-end, right) 17px, center var(--d2l-inline-end, right) calc(1px + 11px + 17px);
			background-repeat: no-repeat, no-repeat;
			background-size: 11px 7px, 0.8rem 0.8rem;
		}
		${finalSelector}[aria-invalid="true"],
		${finalSelector}[aria-invalid="true"]:hover {
			outline-color: var(--d2l-theme-status-color-error);
		}
		${selectFocusStyles.ariaInvalid}

		${finalSelector}:disabled {
			opacity: var(--d2l-theme-opacity-disabled-control);
		}

		@media (prefers-contrast: more) {
			${finalSelector} {
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

			${finalSelector}:not([disabled]):hover {
				box-shadow: none;
				outline: 2px solid Highlight;
			}
			${selectFocusStyles.preferContrastNotDisabled}

			${finalSelector}:disabled {
				outline: 1px solid GrayText;
			}

			${finalSelector}[aria-invalid="true"] {
				background-image: var(--d2l-input-invalid-image);
				background-position: center var(--d2l-inline-end, right) calc(1px + 11px + 17px);
				background-repeat: no-repeat;
				background-size: 0.8rem 0.8rem;
			}

			${finalSelector}[aria-invalid="true"],
			${finalSelector}[aria-invalid="true"]:hover {
				outline-color: var(--d2l-theme-status-color-error);
			}
			${selectFocusStyles.ariaInvalid}
		}
	`;
};

export const selectStyles = _generateSelectStyles('.d2l-input-select');


import { css, unsafeCSS } from 'lit';
import { _isValidCssSelector } from '../../helpers/internal/css.js';

/**
 * A private helper method that should not be used by general consumers
 */
export function _generateInputTextStyles(selector) {
	if (!_isValidCssSelector(selector)) return '';
	const finalSelector = unsafeCSS(selector);

	return css`
		${finalSelector} {
			background-color: var(--d2l-input-background-color, var(--d2l-theme-background-color-base));
			border: 1px solid var(--d2l-input-border-color, var(--d2l-theme-border-color-emphasized));
			border-radius: var(--d2l-input-border-radius, 0.3rem);
			box-shadow: var(--d2l-theme-shadow-inset);
			box-sizing: border-box;
			color: var(--d2l-theme-text-color-static-standard);
			display: inline-block;
			font-family: inherit;
			font-size: 0.8rem;
			font-weight: 400;
			height: var(--d2l-input-height, auto);
			letter-spacing: 0.02rem;
			line-height: 1.2rem;
			margin: 0;
			min-width: calc(2rem + 1em);
			padding: var(--d2l-input-padding, 0.4rem 0.75rem);
			position: var(--d2l-input-position, relative); /* overridden by sticky headers in grades */
			text-align: var(--d2l-input-text-align, start);
			vertical-align: middle;
			width: 100%;
		}

		${finalSelector}::placeholder {
			color: var(--d2l-theme-text-color-static-faint);
			font-size: 0.8rem;
			font-weight: 400;
			opacity: 1; /* Firefox has non-1 default */
		}

		${finalSelector}:hover,
		${finalSelector}:${focusClass} {
			border-color: var(--d2l-theme-border-color-focus);
			border-width: 2px;
			outline: none;
			padding: var(--d2l-input-padding-focus, calc(0.4rem - 1px) calc(0.75rem - 1px));
		}

		[aria-invalid="true"]${finalSelector}:not(:disabled) {
			border-color: var(--d2l-theme-status-color-error);
		}

		${finalSelector},
		${finalSelector}:hover:disabled,
		${finalSelector}:${focusClass}:disabled,
		[aria-invalid="true"]${finalSelector}:disabled {
			border-color: var(--d2l-input-border-color, var(--d2l-theme-border-color-emphasized));
			border-width: 1px;
			padding: var(--d2l-input-padding, 0.4rem 0.75rem);
		}

		${finalSelector}:disabled {
			opacity: var(--d2l-theme-opacity-disabled-control);
		}
	`;
}

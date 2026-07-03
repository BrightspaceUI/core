
import {
	_generateInputAriaInvalidBaseStyles,
	_generateInputBaseStyles,
	_generateInputDisabledBaseStyles,
	_generateInputPlaceholderBaseStyles,
} from './input-styles.js';
import { css, unsafeCSS } from 'lit';
import { _isValidCssSelector } from '../../helpers/internal/css.js';
import { getFocusVisibleStyles } from '../../helpers/focus.js';

function _generateInputTextDisabledStyles(selector) {
	const focusSelectorDelegate = (focusPseudoClass) => `
		${selector},
		${selector}:hover:disabled,
		[aria-invalid="true"]${selector}:disabled,
		${selector}:${focusPseudoClass}:disabled`;

	return getFocusVisibleStyles(focusSelectorDelegate, (selector) => css`
		${selector} {
			border-color: var(--d2l-input-border-color, var(--d2l-theme-border-color-emphasized));
			border-width: 1px;
			padding: var(--d2l-input-padding, 0.4rem 0.75rem);
		}`
	);
}

function _generateInputTextFocusStyles(selector) {
	const focusSelectorsDelegate = (focusPseudoClass) => unsafeCSS(`
		${selector}:hover,
		${selector}:${focusPseudoClass}`
	);

	return getFocusVisibleStyles(focusSelectorsDelegate, (selector) => css`${selector} {
			border-color: var(--d2l-theme-border-color-focus);
			border-width: 2px;
			outline: none;
			padding: var(--d2l-input-padding-focus, calc(0.4rem - 1px) calc(0.75rem - 1px));
		}`
	);
}

/**
 * A private helper method that should not be used by general consumers
 */
export function _generateInputTextStyles(selector) {
	if (!_isValidCssSelector(selector)) return '';
	const finalSelector = unsafeCSS(selector);

	return css`
		${ _generateInputBaseStyles(finalSelector) }

		${ _generateInputPlaceholderBaseStyles(finalSelector) }

		${ _generateInputTextFocusStyles(finalSelector) }

		${ _generateInputAriaInvalidBaseStyles(finalSelector) }

		${ _generateInputTextDisabledStyles(finalSelector) }

		${_generateInputDisabledBaseStyles(finalSelector)}
	`;
}

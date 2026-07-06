
import {
	_generateInputAriaInvalidBaseStyles,
	_generateInputBaseStyles,
	_generateInputDisabledBaseStyles,
	_generateInputPlaceholderBaseStyles,
	_getInputBaseStyleDelegates,
} from './input-styles.js';
import { css, unsafeCSS } from 'lit';
import { _isValidCssSelector } from '../../helpers/internal/css.js';
import { getFocusVisibleStyles } from '../../helpers/focus.js';

function _generateInputTextFocusStyles(selector) {
	const input = _getInputBaseStyleDelegates(selector);
	return getFocusVisibleStyles(input.selector, input.style);
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

		${_generateInputDisabledBaseStyles(finalSelector)}
	`;
}

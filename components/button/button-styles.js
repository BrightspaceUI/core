import '../colors/colors.js';
import { css, unsafeCSS } from 'lit';
import { _isValidCssSelector } from '../../helpers/internal/css.js';
import { getFocusRingStyles } from '../../helpers/focus.js';

function _generateButtonBaseStyles(selector) {
	if (!_isValidCssSelector(selector)) return unsafeCSS('');
	selector = unsafeCSS(selector.trim());

	return css`
		${selector} {
			border-end-end-radius: var(--d2l-button-end-end-radius, 0.3rem);
			border-end-start-radius: var(--d2l-button-end-start-radius, 0.3rem);
			border-start-end-radius: var(--d2l-button-start-end-radius, 0.3rem);
			border-start-start-radius: var(--d2l-button-start-start-radius, 0.3rem);
			border-style: none;
			box-sizing: border-box;
			cursor: pointer;
			display: inline-block;
			margin: 0;
			min-height: calc(2rem + 2px);
			outline: none;
			text-align: center;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
			vertical-align: middle;
			white-space: nowrap;
			width: auto;
		}
	`;
}

export function _generateButtonStyles(selector) {
	if (!_isValidCssSelector(selector)) return unsafeCSS('');
	selector = unsafeCSS(selector.trim());

	return css`
		${selector} {
			font-family: inherit;
			padding-block-end: 0;
			padding-block-start: 0;
			padding-inline-end: var(--d2l-button-padding-inline-end, 1.5rem);
			padding-inline-start: var(--d2l-button-padding-inline-start, 1.5rem);
		}
	`;
}

export function _generateMozillaButtonBorderStyles(selector) {
	if (!_isValidCssSelector(selector)) return unsafeCSS('');
	selector = unsafeCSS(selector.trim());

	return css`
		/* Firefox includes a hidden border which messes up button dimensions */
		${selector}::-moz-focus-inner {
			border: 0;
		}
	`;
}

export function _generateButtonDisabledStyles(selector, isForBsi = false) {
	if (!_isValidCssSelector(selector)) return unsafeCSS('');
	selector = unsafeCSS(selector.trim());

	const activeDisabledSelector = isForBsi ? unsafeCSS(`${selector}[active][disabled]`) : unsafeCSS(`:host([active]) ${selector}[disabled]`);

	return css`
		${selector},
		${selector}[disabled]:hover,
		${selector}[disabled]:focus,
		${activeDisabledSelector} {
			background-color: var(--d2l-theme-background-color-interactive-secondary-default);
			color: var(--d2l-theme-text-color-static-standard);
		}
	`;
}

export function _generateButtonEnabledStyles(selector, isForBsi = false) {
	if (!_isValidCssSelector(selector)) return unsafeCSS('');
	selector = unsafeCSS(selector.trim());

	const activeSelector = isForBsi ? unsafeCSS(`${selector}[active]`) : unsafeCSS(`:host([active]) ${selector}`);
	const additionalBSISelector = isForBsi ? unsafeCSS(`${selector}.d2l-button-hover, ${selector}.d2l-button-focus,`) : unsafeCSS('');

	return css`
		${additionalBSISelector}
		${selector}:hover,
		${selector}:focus,
		${activeSelector} {
			background-color: var(--d2l-theme-background-color-interactive-secondary-hover);
		}
	`;
}

export function _generateBSIButtonFocusStyles(selector) {
	if (!_isValidCssSelector(selector)) return unsafeCSS('');
	const getSelector = (focusPseudoClass) => `
			${selector}:${focusPseudoClass},
			${selector}.d2l-button-focus,
			${selector}[primary]:${focusPseudoClass},
			${selector}[primary].d2l-button-focus`;

	return getFocusRingStyles(getSelector, { includePreferContrastMediaQuery: false });
}

export function _generatePrimaryButtonDisabledStyles(selector, isForBsi = false) {
	if (!_isValidCssSelector(selector)) return unsafeCSS('');
	selector = unsafeCSS(selector.trim());

	const finalSelector = isForBsi ? `${selector}[primary],
		${selector}[primary][disabled]:hover,
		${selector}[primary][disabled]:focus,
		${selector}[primary][active][disabled]` : `:host([primary]) ${selector},
		:host([primary]) ${selector}[disabled]:hover,
		:host([primary]) ${selector}[disabled]:focus,
		:host([primary][active]) ${selector}[disabled]`;

	return css`
		${unsafeCSS(finalSelector)} {
			background-color: var(--d2l-theme-background-color-interactive-primary-default);
			color: var(--d2l-theme-text-color-static-inverted);
		}
	`;
}

export function _generatePrimaryButtonEnabledStyles(selector, isForBsi = false) {
	if (!_isValidCssSelector(selector)) return unsafeCSS('');
	selector = unsafeCSS(selector.trim());

	const finalSelector = isForBsi ? `${selector}[primary]:hover,
	${selector}[primary].d2l-button-hover,
	${selector}[primary]:focus,
	${selector}[primary].d2l-button-focus,
	${selector}[primary][active]` : `:host([primary]) ${selector}:hover,
	:host([primary]) ${selector}:focus,
	:host([primary][active]) ${selector}`;

	return css`
		${unsafeCSS(finalSelector)} {
			background-color: var(--d2l-theme-background-color-interactive-primary-hover);
		}
	`;
}

export const buttonStyles = css`
	${_generateButtonBaseStyles('button')}
	${getFocusRingStyles('button', { preferContrastMediaQueryExtraStyles: css`border: 2px solid transparent;` })}
`;

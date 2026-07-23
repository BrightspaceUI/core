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

const bsiButtonSassStyles = css`
	/* these are still referenced by a few FRAs, button-filter-groups, iterator */
	.d2l-button {
		border-radius: 0.3rem;
		border-style: none;
		box-sizing: border-box;
		cursor: pointer;
		display: inline-block;
		font-family: inherit;
		margin-block: 0;
		margin-inline: 0 0.75rem;
		min-height: calc(2rem + 2px);
		outline: none;
		padding: 0 1.5rem;
		text-align: center;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		vertical-align: middle;
		white-space: nowrap;
		width: auto;
	}
	.d2l-button::-moz-focus-inner {
		border: 0;
	}
	.d2l-button, .d2l-button[disabled]:hover, .d2l-button[disabled]:focus, .d2l-button[active][disabled] {
		background-color: var(--d2l-color-gypsum);
		color: var(--d2l-color-ferrite);
	}
	.d2l-button:hover, .d2l-button:focus, .d2l-button[active], .d2l-button.d2l-button-hover, .d2l-button.d2l-button-focus {
		background-color: var(--d2l-color-mica);
	}
	.d2l-focus-visible-not-supported .d2l-button:focus, .d2l-button.d2l-button-focus, .d2l-focus-visible-not-supported .d2l-button[primary]:focus, .d2l-button[primary].d2l-button-focus {
		outline: 2px solid var(--d2l-color-celestine);
		outline-offset: 2px;
	}
	.d2l-button:focus-visible, .d2l-button[primary]:focus-visible {
		outline: 2px solid var(--d2l-color-celestine);
		outline-offset: 2px;
	}
	.d2l-button[disabled] {
		opacity: 0.5;
		cursor: default;
	}
	.d2l-button[primary], .d2l-button[primary][disabled]:hover, .d2l-button[primary][disabled]:focus, .d2l-button[primary][active][disabled] {
		background-color: var(--d2l-color-celestine);
		color: #ffffff;
	}
	.d2l-button[primary]:hover, .d2l-button[primary].d2l-button-hover, .d2l-button[primary]:focus, .d2l-button[primary].d2l-button-focus, .d2l-button[primary][active] {
		background-color: var(--d2l-color-celestine-minus-1);
	}
	d2l-dialog-fullscreen .d2l-button[slot=footer] {
		margin-block-end: 18px;
		margin-inline-end: 18px;
	}
	@media (prefers-contrast: more) {
		.d2l-button {
			border: 2px solid transparent;
		}
	}

	.dlay_r > .d2l-button {
		margin-inline-start: 0.75rem;
		margin-inline-end: 0;
	}

	.vui-button {
		color: var(--d2l-color-ferrite);
		font-family: inherit;
		font-size: 0.7rem;
		font-weight: 700;
		line-height: 1rem;
		letter-spacing: 0.02rem;
		margin: 0;
		border-radius: 0.3rem;
		box-sizing: border-box;
		cursor: pointer;
		display: inline-block;
		min-height: calc(2rem + 2px);
		padding: 0.55rem 1.5rem;
		text-align: center;
		user-select: none;
		vertical-align: middle;
		white-space: nowrap;
		width: auto;
	}
	.vui-button, .vui-button:visited, .vui-button:link, .vui-button:hover, .vui-button:focus, .vui-button.vui-disabled:hover, .vui-button.vui-disabled:focus, .vui-button[disabled]:hover, .vui-button[disabled]:focus {
		background-color: var(--d2l-color-gypsum);
		border: none;
		color: var(--d2l-color-ferrite);
		outline: none;
		text-decoration: none;
	}
	.vui-button:after {
		content: " ";
		width: 0;
	}
	.vui-button::-moz-focus-inner {
		border: 0;
		padding: 0;
	}
	.vui-button.vui-disabled, .vui-button[disabled] {
		opacity: 0.5;
		cursor: default;
	}
	.vui-button:hover, .vui-button:focus {
		background-color: var(--d2l-color-mica);
	}

	.vui-button-primary {
		color: #ffffff;
		font-family: inherit;
		font-size: 0.7rem;
		font-weight: 700;
		line-height: 1rem;
		letter-spacing: 0.02rem;
		margin: 0;
		border-radius: 0.3rem;
		box-sizing: border-box;
		cursor: pointer;
		display: inline-block;
		min-height: calc(2rem + 2px);
		padding: 0.55rem 1.5rem;
		text-align: center;
		user-select: none;
		vertical-align: middle;
		white-space: nowrap;
		width: auto;
	}
	.vui-button-primary, .vui-button-primary:visited, .vui-button-primary:link, .vui-button-primary:hover, .vui-button-primary:focus, .vui-button-primary.vui-disabled:hover, .vui-button-primary.vui-disabled:focus, .vui-button-primary[disabled]:hover, .vui-button-primary[disabled]:focus {
		background-color: var(--d2l-color-celestine);
		border: none;
		color: #ffffff;
		outline: none;
		text-decoration: none;
	}
	.vui-button-primary:after {
		content: " ";
		width: 0;
	}
	.vui-button-primary::-moz-focus-inner {
		border: 0;
		padding: 0;
	}
	.vui-button-primary.vui-disabled, .vui-button-primary[disabled] {
		opacity: 0.5;
		cursor: default;
	}
	.vui-button-primary:hover, .vui-button-primary:focus {
		background-color: var(--d2l-color-celestine-minus-1);
	}
`;

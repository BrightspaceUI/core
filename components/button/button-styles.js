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

export const buttonStyles = css`
	${_generateButtonBaseStyles('button')}
	${getFocusRingStyles('button')}
	@media (prefers-contrast: more) {
		button {
			border: 2px solid transparent;
		}
	}
`;

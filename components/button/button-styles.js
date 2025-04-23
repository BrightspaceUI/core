import '../colors/colors.js';
import { css, unsafeCSS } from 'lit';
import { getFocusPseudoClass } from '../../helpers/focus.js';

export const buttonStyles = css`
	button {
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
	button:${unsafeCSS(getFocusPseudoClass())} {
		outline: 2px solid var(--d2l-button-focus-color, var(--d2l-color-celestine));
		outline-offset: var(--d2l-button-focus-offset, 2px);
	}
	@media (prefers-contrast: more) {
		button {
			border: 2px solid transparent;
		}
	}
`;

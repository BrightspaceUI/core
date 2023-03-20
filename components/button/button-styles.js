import '../colors/colors.js';
import { css, unsafeCSS } from 'lit';
import { getFocusPseudoClass } from '../../helpers/focus.js';

export const buttonStyles = css`
	button {
		border-radius: 0.3rem;
		border-style: none;
		box-shadow: 0 0 0 4px rgba(0, 0, 0, 0);
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
		box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
	}
`;

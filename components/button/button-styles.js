import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

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
	/* Outline on focus for elements not using FocusVisiblePolyfillMixin
	 * or when focus-visible for those who are */
	:host(:not([data-js-focus-visible])) button:focus,
	button.focus-visible {
		box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
	}
`;

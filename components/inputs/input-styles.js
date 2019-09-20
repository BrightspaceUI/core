import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const inputStyles = css`
	.d2l-input {
		background-color: #ffffff;
		border-color: var(--d2l-color-galena);
		border-radius: 0.3rem;
		border-style: solid;
		border-width: 1px;
		box-shadow: inset 0 2px 0 0 rgba(181, 189, 194, .2); /* corundum */
		color: var(--d2l-color-ferrite);
		box-sizing: border-box;
		display: inline-block;
		font-family: inherit;
		font-size: 0.8rem;
		font-weight: 400;
		height: var(--d2l-input-height, auto);
		letter-spacing: 0.02rem;
		line-height: 1.2rem; /* using min-height AND line-height as IE11 doesn't support line-height on inputs */
		margin: 0;
		min-height: calc(2rem + 2px);
		min-width: calc(2rem + 1em);
		padding: var(--d2l-input-padding, 0.4rem 0.75rem);
		position: relative;
		vertical-align: middle;
		width: 100%;
		transition: background-color 0.5s ease, border-color 0.001s ease;
	}
	input.d2l-input::placeholder,
	textarea.d2l-input::placeholder {
		color: var(--d2l-input-placeholder-color, var(--d2l-color-mica));
		font-size: 0.8rem;
		font-weight: 400;
		opacity: 1; /* Firefox has non-1 default */
	}
	input.d2l-input::-ms-input-placeholder,
	textarea.d2l-input::-ms-input-placeholder {
		color: var(--d2l-input-placeholder-color, var(--d2l-color-mica));
		font-size: 0.8rem;
		font-weight: 400;
	}
	.d2l-input:hover,
	.d2l-input:focus {
		border-color: var(--d2l-color-celestine);
		border-width: 2px;
		outline-style: none;
		outline-width: 0;
		padding: var(--d2l-input-padding-focus, calc(0.4rem - 1px) calc(0.75rem - 1px));
	}
	[aria-invalid="true"].d2l-input,
	.d2l-input:invalid {
		border-color: var(--d2l-color-cinnabar);
	}
	.d2l-input:hover:disabled,
	[aria-invalid="true"].d2l-input:disabled {
		border-color: var(--d2l-color-galena);
		border-width: 1px;
		padding: 0.4rem 0.75rem;
	}
	.d2l-input:disabled {
		opacity: 0.5;
	}
	input.d2l-input::-webkit-search-cancel-button {
		display: none;
	}
	input.d2l-input::-ms-clear {
		display: none;
		width: 0;
		height: 0;
	}
`;

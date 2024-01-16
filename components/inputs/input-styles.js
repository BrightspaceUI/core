import '../colors/colors.js';
import { css } from 'lit';

export const inputStyles = css`
	.d2l-input {
		background-color: var(--d2l-input-background-color, #ffffff);
		border-radius: var(--d2l-input-border-radius, 0.3rem);
		border-style: solid;
		box-shadow: inset 0 2px 0 0 rgba(177, 185, 190, 0.2); /* corundum */
		box-sizing: border-box;
		color: var(--d2l-color-ferrite);
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
		position: var(--d2l-input-position, relative); /* overridden by sticky headers in grades */
		text-align: var(--d2l-input-text-align, start);
		vertical-align: middle;
		width: 100%;
	}
	.d2l-input,
	.d2l-input:hover:disabled,
	.d2l-input:focus:disabled,
	[aria-invalid="true"].d2l-input:disabled {
		border-color: var(--d2l-input-border-color, var(--d2l-color-galena));
		border-width: 1px;
		padding: var(--d2l-input-padding, 0.4rem 0.75rem);
	}
	.d2l-input::placeholder {
		color: var(--d2l-color-mica);
		font-size: 0.8rem;
		font-weight: 400;
		opacity: 1; /* Firefox has non-1 default */
	}
	.d2l-input::-ms-input-placeholder {
		color: var(--d2l-color-mica);
		font-size: 0.8rem;
		font-weight: 400;
	}
	.d2l-input:hover,
	.d2l-input:focus,
	.d2l-input-focus {
		border-color: var(--d2l-color-celestine);
		border-width: 2px;
		outline-style: none;
		outline-width: 0;
		padding: var(--d2l-input-padding-focus, calc(0.4rem - 1px) calc(0.75rem - 1px));
	}
	[aria-invalid="true"].d2l-input {
		border-color: var(--d2l-color-cinnabar);
	}
	.d2l-input:disabled {
		opacity: 0.5;
	}
	.d2l-input::-webkit-search-cancel-button,
	.d2l-input::-webkit-search-decoration {
		display: none;
	}
	.d2l-input::-ms-clear {
		display: none;
		height: 0;
		width: 0;
	}
	textarea.d2l-input {
		line-height: normal;
	}
	textarea.d2l-input,
	textarea.d2l-input:hover:disabled,
	textarea.d2l-input:focus:disabled,
	textarea[aria-invalid="true"].d2l-input:disabled {
		padding-bottom: 0.5rem;
		padding-top: 0.5rem;
	}
	textarea.d2l-input:hover,
	textarea.d2l-input:focus {
		padding: var(--d2l-input-padding-focus, calc(0.75rem - 1px));
		padding-bottom: calc(0.5rem - 1px);
		padding-top: calc(0.5rem - 1px);
	}
	textarea.d2l-input[aria-invalid="true"] {
		background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICA8cGF0aCBmaWxsPSIjY2QyMDI2IiBkPSJNMTcuNzkgMTUuMTFsLTctMTRhMiAyIDAgMCAwLTMuNTggMGwtNyAxNGExLjk3NSAxLjk3NSAwIDAgMCAuMDkgMS45NEEyIDIgMCAwIDAgMiAxOGgxNGExLjk5NCAxLjk5NCAwIDAgMCAxLjctLjk1IDEuOTY3IDEuOTY3IDAgMCAwIC4wOS0xLjk0ek05IDE2YTEuNSAxLjUgMCAxIDEgMS41LTEuNUExLjUgMS41IDAgMCAxIDkgMTZ6bS45OC00LjgwNmExIDEgMCAwIDEtMS45NiAwbC0uOTktNUExIDEgMCAwIDEgOC4wMSA1aDEuOTgzYTEgMSAwIDAgMSAuOTggMS4xOTR6Ii8+Cjwvc3ZnPgo=");
		background-position: top 12px right 18px;
		background-repeat: no-repeat;
		background-size: 0.8rem 0.8rem;
		padding-right: calc(18px + 0.8rem);
	}
	textarea.d2l-input[aria-invalid="true"]:hover,
	textarea.d2l-input[aria-invalid="true"]:focus {
		background-position: top calc(12px - 1px) right calc(18px - 1px);
		padding-right: calc(18px + 0.8rem - 1px);
	}
	:host([dir='rtl']) textarea.d2l-input[aria-invalid="true"] {
		background-position: top 12px left 18px;
		padding: var(--d2l-input-padding, 0.75rem);
		padding-bottom: 0.5rem;
		padding-left: calc(18px + 0.8rem);
		padding-top: 0.5rem;
	}
	:host([dir='rtl']) textarea.d2l-input[aria-invalid="true"]:focus,
	:host([dir='rtl']) textarea.d2l-input[aria-invalid="true"]:hover {
		background-position: top calc(12px - 1px) left calc(18px - 1px);
		padding: var(--d2l-input-padding-focus, calc(0.75rem - 1px));
		padding-bottom: calc(0.5rem - 1px);
		padding-left: calc(18px + 0.8rem - 1px);
		padding-top: calc(0.5rem - 1px);
	}
	textarea[aria-invalid="true"].d2l-input:disabled {
		background-image: none;
	}
`;

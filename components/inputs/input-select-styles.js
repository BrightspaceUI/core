import '../colors/colors.js';
import { css } from 'lit';

export const selectStyles = css`
	.d2l-input-select {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-origin: border-box;
		background-position: center right 17px;
		background-repeat: no-repeat;
		background-size: 11px 7px;
		border-radius: 0.3rem;
		border-style: solid;
		box-sizing: border-box;
		color: var(--d2l-color-ferrite);
		display: inline-block;
		font-family: inherit;
		font-size: 0.8rem;
		font-weight: 400;
		height: auto;
		letter-spacing: 0.02rem;
		line-height: 1.2rem;
		margin: 0;
		max-height: calc(2rem + 2px);
		vertical-align: middle;
	}
	:host([dir="rtl"]) .d2l-input-select {
		background-position: center left 17px;
	}
	.d2l-input-select,
	.d2l-input-select:hover:disabled {
		background-color: #ffffff;
		border-color: var(--d2l-color-galena);
		border-width: 1px;
		box-shadow: inset 0 2px 0 0 rgba(177, 185, 190, 0.2); /* corundum */
		padding: 0.4rem 0.75rem;
	}
	.d2l-input-select,
	.d2l-input-select:disabled,
	.d2l-input-select:hover:disabled,
	.d2l-input-select:focus:disabled {
		background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEiIGhlaWdodD0iNyIgdmlld0JveD0iMCAwIDExIDciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTEgMmw0LjUgNE0xMCAyTDUuNSA2IiBzdHJva2U9IiM1NjVBNUMiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+");
		padding-right: calc(2px + 0.8rem + 1px + 11px + 16px);
	}
	:host([dir="rtl"]) .d2l-input-select,
	:host([dir="rtl"]) .d2l-input-select:disabled,
	:host([dir="rtl"]) .d2l-input-select:hover:disabled,
	:host([dir="rtl"]) .d2l-input-select:focus:disabled {
		padding-left: calc(2px + 0.8rem + 1px + 11px + 16px);
		padding-right: 0.75rem;
	}
	.d2l-input-select:hover,
	.d2l-input-select:focus {
		border-color: var(--d2l-color-celestine);
		border-width: 2px;
		outline-style: none; /* Safari */
		outline-width: 0;
		padding: calc(0.4rem - 1px) calc(0.75rem - 1px);
		padding-right: calc(2px + 0.8rem + 1px + 11px + 16px - 1px);
	}
	:host([dir="rtl"]) .d2l-input-select:hover,
	:host([dir="rtl"]) .d2l-input-select:focus {
		padding-left: calc(2px + 0.8rem + 1px + 11px + 16px - 1px);
		padding-right: calc(0.75rem - 1px);
	}
	.d2l-input-select[aria-invalid="true"] {
		background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEiIGhlaWdodD0iNyIgdmlld0JveD0iMCAwIDExIDciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTEgMmw0LjUgNE0xMCAyTDUuNSA2IiBzdHJva2U9IiM1NjVBNUMiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+"), url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICA8cGF0aCBmaWxsPSIjY2QyMDI2IiBkPSJNMTcuNzkgMTUuMTFsLTctMTRhMiAyIDAgMCAwLTMuNTggMGwtNyAxNGExLjk3NSAxLjk3NSAwIDAgMCAuMDkgMS45NEEyIDIgMCAwIDAgMiAxOGgxNGExLjk5NCAxLjk5NCAwIDAgMCAxLjctLjk1IDEuOTY3IDEuOTY3IDAgMCAwIC4wOS0xLjk0ek05IDE2YTEuNSAxLjUgMCAxIDEgMS41LTEuNUExLjUgMS41IDAgMCAxIDkgMTZ6bS45OC00LjgwNmExIDEgMCAwIDEtMS45NiAwbC0uOTktNUExIDEgMCAwIDEgOC4wMSA1aDEuOTgzYTEgMSAwIDAgMSAuOTggMS4xOTR6Ii8+Cjwvc3ZnPgo=");
		background-position: center right 17px, center right calc(1px + 11px + 17px);
		background-repeat: no-repeat, no-repeat;
		background-size: 11px 7px, 0.8rem 0.8rem;
		border-color: var(--d2l-color-cinnabar);
	}
	:host([dir="rtl"]) .d2l-input-select[aria-invalid="true"] {
		background-position: center left 17px, center left calc(1px + 11px + 17px);
	}
	.d2l-input-select:disabled {
		opacity: 0.5;
	}
	/* IE11 to prevent selection styling */
	.d2l-input-select:focus::-ms-value,
	.d2l-input-select:hover::-ms-value {
		background-color: transparent;
		color: var(--d2l-color-ferrite);
	}
	/* IE11 to hide the native chevron */
	.d2l-input-select::-ms-expand {
		display: none;
	}
	/* Prevents dotted outline when focused in Firefox */
	.d2l-input-select:-moz-focusring {
		color: transparent;
		text-shadow: 0 0 0 #000000;
	}
`;

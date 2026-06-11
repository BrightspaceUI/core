import { css, unsafeCSS } from 'lit';
import { _isValidCssSelector } from '../../helpers/internal/css.js';
import { getFlag } from '../../helpers/flags.js';
import { registerSemanticVariableForSvgImageUrl } from '../colors/colors.js';

export const useGeneratedStyles = getFlag('GAUD-8849-Use-input-radio-generated-styles', true);

registerSemanticVariableForSvgImageUrl(
	'--d2l-input-radio-check-image',
	`<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
		<circle cx="5" cy="5" r="5" fill="var(--d2l-theme-icon-color-standard)"></circle>
	</svg>`
);

function generateRadioStyles(selector, isInputContainer) {
	if (!_isValidCssSelector(selector)) return '';
	const inputSelector = unsafeCSS(isInputContainer ? `${selector} > input[type="radio"]` : selector);
	selector = unsafeCSS(selector);

	return css`
		${inputSelector} {
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			background-color: var(--d2l-theme-background-color-interactive-faint-default);
			background-position: center center;
			background-repeat: no-repeat;
			background-size: 0.5rem 0.5rem;
			border: 1px solid var(--d2l-theme-border-color-emphasized);
			border-radius: 50%;
			box-sizing: border-box;
			display: inline-block;
			height: 1.2rem;
			margin: 0;
			outline: none;
			padding: 0;
			vertical-align: middle;
			width: 1.2rem;
		}
		${inputSelector}[aria-checked="true"],
		${inputSelector}:checked {
			background-image: var(--d2l-input-radio-check-image);
		}
		${inputSelector}.d2l-hovering,
		${inputSelector}:not(.d2l-input-radio-disabled-tooltip):not(:disabled):not(.d2l-disabled):hover,
		${inputSelector}.d2l-input-radio-disabled-tooltip:hover,
		${inputSelector}:not(.d2l-input-radio-disabled-tooltip):not(:disabled):not(.d2l-disabled):focus,
		${inputSelector}.d2l-input-radio-disabled-tooltip:focus {
			border: 2px solid var(--d2l-input-radio-border-color-hover-focus, var(--d2l-theme-border-color-focus));
		}
		${inputSelector}[aria-invalid="true"] {
			border-color: var(--d2l-theme-status-color-error);
			--d2l-input-radio-border-color-hover-focus: var(--d2l-theme-status-color-error);
		}
		${inputSelector}:disabled,
		${inputSelector}.d2l-disabled {
			opacity: var(--d2l-theme-opacity-disabled-control);
		}

		${inputSelector}.d2l-input-radio-disabled-tooltip.d2l-hovering,
		${inputSelector}.d2l-input-radio-disabled-tooltip:hover,
		${inputSelector}.d2l-input-radio-disabled-tooltip:focus {
			background-blend-mode: lighten;
			background-color: var(--d2l-theme-background-color-interactive-faint-disabled);
			opacity: 1;
		}

		@media (prefers-contrast: more) {
			${inputSelector} {
				forced-color-adjust: none;
				background-color: Background;
				border-color: ButtonText;
			}
			${inputSelector}[aria-checked="true"],
			${inputSelector}:checked {
				background-image: none;
				position: relative;
			}
			${inputSelector}[aria-checked="true"]::after,
			${inputSelector}:checked::after {
				background-color: FieldText;
				content: "";
				display: block;
				height: 1.2rem;
				left: 50%;
				mask-image: var(--d2l-input-radio-check-image);
				mask-position: center center;
				mask-repeat: no-repeat;
				mask-size: 0.5rem 0.5rem;
				position: absolute;
				top: 50%;
				transform: translate(-50%, -50%);
				width: 1.2rem;
			}

			${inputSelector}[aria-invalid="true"] {
				border-color: var(--d2l-theme-status-color-error);
				--d2l-input-radio-border-color-hover-focus: var(--d2l-theme-status-color-error);
			}

			${inputSelector}.d2l-input-radio-disabled-tooltip.d2l-hovering,
			${inputSelector}.d2l-input-radio-disabled-tooltip:hover,
			${inputSelector}.d2l-input-radio-disabled-tooltip:focus {
				background-blend-mode: initial;
				background-color: Background;
			}
		}


		${isInputContainer ? css`
			${selector} {
				align-items: center;
				color: var(--d2l-theme-text-color-static-standard);
				display: flex;
				font-size: 0.8rem;
				font-weight: 400;
				line-height: 1.2rem;
				margin-bottom: 0.9rem;
				overflow-wrap: anywhere;
				padding-inline-end: 0;
				padding-inline-start: 1.7rem;
				vertical-align: middle;
			}
			${selector}:last-of-type {
				margin-bottom: 0;
			}

			${selector}.d2l-input-radio-label-disabled {
				color: var(--d2l-theme-text-color-static-disabled);
			}
			${selector}.d2l-input-radio-label-disabled > * {
				color: var(--d2l-theme-text-color-static-standard);
			}
			${selector}.d2l-input-radio-label-disabled > * {
				opacity: var(--d2l-theme-opacity-disabled-control);
			}

			${selector} > .d2l-input-radio,
			${selector} > input[type="radio"] {
				flex: 0 0 auto;
				margin-inline-end: 0.5rem;
				margin-inline-start: -1.7rem;
			}
		` : css``}
	`;

}

export const radioStyles = useGeneratedStyles ? css`
	${generateRadioStyles('.d2l-input-radio', false)}
	${generateRadioStyles('.d2l-input-radio-label', true)}
` : css`
	.d2l-input-radio,
	.d2l-input-radio-label > input[type="radio"] {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: 0.5rem 0.5rem;
		border-radius: 50%;
		border-style: solid;
		box-sizing: border-box;
		display: inline-block;
		height: 1.2rem;
		margin: 0;
		padding: 0;
		vertical-align: middle;
		width: 1.2rem;
	}
	.d2l-input-radio[aria-checked="true"],
	.d2l-input-radio:checked,
	.d2l-input-radio-label > input[type="radio"]:checked {
		background-image: var(--d2l-input-radio-check-image);
	}
	.d2l-input-radio,
	.d2l-input-radio:hover:disabled,
	.d2l-input-radio:hover.d2l-disabled,
	.d2l-input-radio-label > input[type="radio"],
	.d2l-input-radio-label > input[type="radio"]:hover:disabled {
		background-color: var(--d2l-theme-background-color-interactive-faint-default);
		border-color: var(--d2l-theme-border-color-emphasized);
		border-width: 1px;
	}
	.d2l-input-radio.d2l-hovering,
	.d2l-input-radio:hover,
	.d2l-input-radio:focus,
	.d2l-input-radio-label > input[type="radio"]:hover,
	.d2l-input-radio-label > input[type="radio"]:focus {
		border-color: var(--d2l-input-radio-border-color-hover-focus, var(--d2l-theme-border-color-focus));
		border-width: 2px;
		outline: none;
	}
	.d2l-input-radio[aria-invalid="true"],
	.d2l-input-radio-label > input[type="radio"][aria-invalid="true"] {
		border-color: var(--d2l-theme-status-color-error);
	}
	.d2l-input-radio:disabled,
	.d2l-input-radio.d2l-disabled,
	.d2l-input-radio-label > input[type="radio"]:disabled {
		opacity: var(--d2l-theme-opacity-disabled-control);
	}
	.d2l-input-radio-label {
		align-items: center;
		color: var(--d2l-theme-text-color-static-standard);
		display: flex;
		font-size: 0.8rem;
		font-weight: 400;
		line-height: 1.2rem;
		margin-bottom: 0.9rem;
		overflow-wrap: anywhere;
		padding-inline-end: 0;
		padding-inline-start: 1.7rem;
		vertical-align: middle;
	}
	.d2l-input-radio-label-disabled:not(.d2l-input-radio-label-disabled-tooltip),
	.d2l-input-radio-label-disabled-tooltip > * {
		opacity: var(--d2l-theme-opacity-disabled-control);
	}
	.d2l-input-radio-label-disabled:not(.d2l-input-radio-label-disabled-tooltip) > .d2l-input-radio,
	.d2l-input-radio-label-disabled:not(.d2l-input-radio-label-disabled-tooltip) > input[type="radio"] {
		opacity: 1;
	}
	.d2l-input-radio.d2l-input-radio-disabled-tooltip.d2l-hovering,
	.d2l-input-radio.d2l-input-radio-disabled-tooltip:hover,
	.d2l-input-radio.d2l-input-radio-disabled-tooltip:focus,
	.d2l-input-radio-label-disabled-tooltip .d2l-input-radio.d2l-hovering,
	.d2l-input-radio-label-disabled-tooltip .d2l-input-radio:hover,
	.d2l-input-radio-label-disabled-tooltip .d2l-input-radio:focus,
	.d2l-input-radio-label-disabled-tooltip .d2l-input-radio-label > input[type="radio"]:hover,
	.d2l-input-radio-label-disabled-tooltip .d2l-input-radio-label > input[type="radio"]:focus {
		background-blend-mode: lighten;
		background-color: var(--d2l-theme-background-color-interactive-faint-disabled);
		border-color: var(--d2l-input-radio-border-color-hover-focus, var(--d2l-theme-border-color-focus));
		border-width: 2px;
		opacity: 1;
		outline: none;
	}

	.d2l-input-radio-label:last-of-type {
		margin-bottom: 0;
	}
	.d2l-input-radio-label > .d2l-input-radio,
	.d2l-input-radio-label > input[type="radio"] {
		flex: 0 0 auto;
		margin-inline-end: 0.5rem;
		margin-inline-start: -1.7rem;
	}

	@media (prefers-contrast: more) {
		.d2l-input-radio[aria-checked="true"],
		.d2l-input-radio:checked,
		.d2l-input-radio-label > input[type="radio"]:checked {
			background-image: none;
			position: relative;
		}
		.d2l-input-radio[aria-checked="true"]::after,
		.d2l-input-radio:checked::after,
		.d2l-input-radio-label > input[type="radio"]:checked::after {
			background-color: FieldText;
			content: "";
			display: block;
			height: 1.2rem;
			left: 50%;
			mask-image: var(--d2l-input-radio-check-image);
			mask-position: center center;
			mask-repeat: no-repeat;
			mask-size: 0.5rem 0.5rem;
			position: absolute;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 1.2rem;
		}
	}
`;

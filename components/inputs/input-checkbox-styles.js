import { css, unsafeCSS } from 'lit';
import { _isValidCssSelector } from '../../helpers/internal/css.js';
import { registerSemanticVariableForSvgImageUrl } from '../colors/colors.js';

registerSemanticVariableForSvgImageUrl(
	'--d2l-input-checkbox-check-image',
	`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<path fill="var(--d2l-theme-icon-color-standard)" d="M8.4 16.6c.6.6 1.5.6 2.1 0l8-8c.6-.6.6-1.5 0-2.1-.6-.6-1.5-.6-2.1 0l-6.9 7-1.9-1.9c-.6-.6-1.5-.6-2.1 0-.6.6-.6 1.5 0 2.1l2.9 2.9z"/>\
	</svg>`
);

registerSemanticVariableForSvgImageUrl(
	'--d2l-input-checkbox-indeterminate-image',
	`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<path fill="var(--d2l-theme-icon-color-standard)" d="M7.5,11h9c0.8,0,1.5,0.7,1.5,1.5l0,0c0,0.8-0.7,1.5-1.5,1.5h-9C6.7,14,6,13.3,6,12.5l0,0C6,11.7,6.7,11,7.5,11z"/>
	</svg>`
);

export const cssSizes = {
	inputBoxSize: 1.2,
	checkboxMargin: 0.5,
};

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateInputCheckboxStyles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	const selectorCSS = unsafeCSS(selector);
	return css`
		${selectorCSS} {
			--d2l-input-checkbox-background-image: none;
			--d2l-input-checkbox-background-color: var(--d2l-theme-background-color-interactive-faint-default);
			--d2l-input-checkbox-background-image-disabled:
				linear-gradient(
					var(--d2l-theme-background-color-interactive-faint-disabled),
					var(--d2l-theme-background-color-interactive-faint-disabled)
				),
				var(--d2l-input-checkbox-background-image);
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			background-image: var(--d2l-input-checkbox-background-image);
			background-position: center center;
			background-repeat: no-repeat;
			background-size: ${cssSizes.inputBoxSize}rem ${cssSizes.inputBoxSize}rem;
			border-radius: 0.3rem;
			border-style: solid;
			box-sizing: border-box;
			display: inline-block;
			height: ${cssSizes.inputBoxSize}rem;
			margin: 0;
			padding: 0;
			vertical-align: middle;
			width: ${cssSizes.inputBoxSize}rem;
		}
		${selectorCSS}:checked {
			--d2l-input-checkbox-background-image: var(--d2l-input-checkbox-check-image);
		}
		${selectorCSS}:indeterminate {
			--d2l-input-checkbox-background-image: var(--d2l-input-checkbox-indeterminate-image);
		}
		${selectorCSS},
		${selectorCSS}:hover:disabled {
			background-color: var(--d2l-input-checkbox-background-color);
			border-color: var(--d2l-theme-border-color-emphasized);
			border-width: 1px;
		}
		${selectorCSS}:hover:disabled {
			border-color: var(--d2l-theme-border-color-disabled);
		}
		${selectorCSS}:hover,
		${selectorCSS}:focus,
		${selectorCSS}.d2l-input-checkbox-focus,
		:host(.d2l-hovering) input[type="checkbox"]:not(:disabled).d2l-input-checkbox {
			border-color: var(--d2l-input-checkbox-border-color-hover-focus, var(--d2l-theme-border-color-focus));
			border-width: 2px;
			outline: none;
		}
		${selectorCSS}:disabled,
		${selectorCSS}:where([aria-disabled="true"]) {
			background-image: var(--d2l-input-checkbox-background-image-disabled);
			border-color: var(--d2l-theme-border-color-disabled);
		}
		@media (forced-colors: active) {
			${selectorCSS}:checked,
			${selectorCSS}:indeterminate {
				background-image: none;
				position: relative;
			}
			${selectorCSS}:checked::after,
			${selectorCSS}:indeterminate::after {
				background-color: FieldText;
				content: "";
				display: block;
				height: ${cssSizes.inputBoxSize}rem;
				left: 50%;
				position: absolute;
				top: 50%;
				transform: translate(-50%, -50%);
				width: ${cssSizes.inputBoxSize}rem;
			}

			${selectorCSS}:disabled,
			${selectorCSS}:where([aria-disabled="true"]) {
				opacity: var(--d2l-theme-opacity-disabled-control);
			}

			${selectorCSS}:checked::after {
				mask-image: var(--d2l-input-checkbox-check-image);
			}

			${selectorCSS}:indeterminate::after {
				mask-image: var(--d2l-input-checkbox-indeterminate-image);
			}
		}
	`;
};

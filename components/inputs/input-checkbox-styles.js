import { css, unsafeCSS } from 'lit';
import { _isValidCssSelector } from '../../helpers/internal/css.js';

/**
 * A private helper method that should not be used by general consumers
 */
export const _generateInputCheckboxStyles = (selector) => {
	if (!_isValidCssSelector(selector)) return;

	const selectorCSS = unsafeCSS(selector);
	return css`
		${selectorCSS} {
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			background-position: center center;
			background-repeat: no-repeat;
			background-size: 1.2rem 1.2rem;
			border-radius: 0.3rem;
			border-style: solid;
			box-sizing: border-box;
			display: inline-block;
			height: 1.2rem;
			margin: 0;
			padding: 0;
			vertical-align: middle;
			width: 1.2rem;
		}
		${selectorCSS},
		${selectorCSS}:disabled {
			background-color: #f9fbff; /* TODO: update this to the proper value */
			border-color: #6e7477; /* TODO: update this to the proper value */
			border-width: 1px;
		}
		${selectorCSS}:checked {
			background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23494C4E%22%20d%3D%22M8.4%2016.6c.6.6%201.5.6%202.1%200l8-8c.6-.6.6-1.5%200-2.1-.6-.6-1.5-.6-2.1%200l-6.9%207-1.9-1.9c-.6-.6-1.5-.6-2.1%200-.6.6-.6%201.5%200%202.1l2.9%202.9z%22/%3E%3C/svg%3E%0A");
		}
		${selectorCSS}:hover,
		${selectorCSS}:focus {
			border-color: #006fbf; /* TODO: update this to the proper value */
			border-width: 2px;
			outline: none;
		}
		${selectorCSS}:disabled {
			opacity: 0.5;
		}
	`;
};

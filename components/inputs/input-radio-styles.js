import '../colors/colors.js';
import { css } from 'lit';
import { svgToCSS } from '../../helpers/svg-to-css.js';

const radioCheck = svgToCSS(`<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
	<circle cx="5" cy="5" r="5" fill="#494c4e"></circle>
</svg>`);

export const radioStyles = css`
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
		background-image: ${radioCheck};
	}
	.d2l-input-radio,
	.d2l-input-radio:hover:disabled,
	.d2l-input-radio:hover.d2l-disabled,
	.d2l-input-radio-label > input[type="radio"],
	.d2l-input-radio-label > input[type="radio"]:hover:disabled {
		background-color: var(--d2l-color-regolith);
		border-color: var(--d2l-color-galena);
		border-width: 1px;
	}
	.d2l-input-radio.d2l-hovering,
	.d2l-input-radio:hover,
	.d2l-input-radio:focus,
	.d2l-input-radio-label > input[type="radio"]:hover,
	.d2l-input-radio-label > input[type="radio"]:focus {
		border-color: var(--d2l-color-celestine);
		border-width: 2px;
		outline: none;
	}
	.d2l-input-radio[aria-invalid="true"],
	.d2l-input-radio-label > input[type="radio"][aria-invalid="true"] {
		border-color: var(--d2l-color-cinnabar);
	}
	.d2l-input-radio:disabled,
	.d2l-input-radio.d2l-disabled,
	.d2l-input-radio-label > input[type="radio"]:disabled {
		opacity: 0.5;
	}
	.d2l-input-radio-label {
		align-items: center;
		color: var(--d2l-color-ferrite);
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
	.d2l-input-radio-label-disabled {
		opacity: 0.5;
	}
	.d2l-input-radio-label-disabled > .d2l-input-radio,
	.d2l-input-radio-label-disabled > input[type="radio"] {
		opacity: 1;
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
			mask-image: url("data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2010%2010%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%09%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20fill%3D%22%23494c4e%22%3E%3C%2Fcircle%3E%0A%3C%2Fsvg%3E");
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

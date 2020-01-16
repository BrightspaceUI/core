import { css } from 'lit-element/lit-element.js';

export const inputLabelStyles = css`
	.d2l-input-label {
		cursor: default;
		display: block;
		font-size: 0.7rem;
		line-height: 1rem;
		font-weight: 700;
		letter-spacing: 0.2px;
		margin: 0;
		padding: 0 0 7px 0;
		width: 100%;
	}
	:host([required]) .d2l-input-label:after,
	.d2l-input-label-required:after {
		content: url("data:image/svg+xml,%3Csvg%20width%3D%225%22%20height%3D%226%22%20viewBox%3D%220%200%205%206%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M2.38%205.141V3.86c0-.093.006-.184.018-.273.011-.089.031-.173.059-.252a.927.927%200%200%201-.182.175c-.07.051-.145.103-.224.154l-1.106.644-.413-.7%201.113-.644c.084-.051.167-.093.248-.126.082-.033.167-.056.256-.07a.816.816%200%200%201-.256-.07%202.356%202.356%200%200%201-.248-.133L.532%201.914l.406-.7%201.113.658c.08.051.155.104.228.157a.966.966%200%200%201%20.185.179%201.002%201.002%200%200%201-.066-.252%202.091%202.091%200%200%201-.018-.273V.388h.826v1.281c0%20.098-.006.192-.017.283a1.003%201.003%200%200%201-.067.256c.051-.065.112-.125.182-.179.07-.053.147-.106.231-.157l1.106-.644.413.7-1.113.637a1.954%201.954%200%200%201-.248.13%201.07%201.07%200%200%201-.256.073c.159.028.327.093.504.196l1.113.651-.406.7-1.113-.651a3.307%203.307%200%200%201-.231-.154%201.122%201.122%200%200%201-.189-.175c.06.15.091.322.091.518v1.288H2.38z%22%20fill%3D%22%23494C4E%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E");
		position: relative;
		left: 0.15rem;
		bottom: 0.25rem;
		display: inline-block;
		width: 0.25rem;
		height: 0.30rem;
	}
	:host([dir="rtl"][required]) .d2l-input-label:after,
	:host([dir="rtl"]) .d2l-input-label-required:after {
		left: auto;
		right: 0.15rem;
	}
	.d2l-input-label-fieldset {
		border: none;
		display: block;
		margin: 0;
		padding: 0;
	}
`;

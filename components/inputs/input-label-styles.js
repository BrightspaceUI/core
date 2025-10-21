import { css } from 'lit';
import { svgToCSS } from '../../helpers/svg-to-css.js';

const requiredIcon = svgToCSS(`<svg width="5" height="6" viewBox="0 0 5 6" xmlns="http://www.w3.org/2000/svg">
	<path d="M2.38 5.141V3.86c0-.093.006-.184.018-.273.011-.089.031-.173.059-.252a.927.927 0 0 1-.182.175c-.07.051-.145.103-.224.154l-1.106.644-.413-.7 1.113-.644c.084-.051.167-.093.248-.126.082-.033.167-.056.256-.07a.816.816 0 0 1-.256-.07 2.356 2.356 0 0 1-.248-.133L.532 1.914l.406-.7 1.113.658c.08.051.155.104.228.157a.966.966 0 0 1 .185.179 1.002 1.002 0 0 1-.066-.252 2.091 2.091 0 0 1-.018-.273V.388h.826v1.281c0 .098-.006.192-.017.283a1.003 1.003 0 0 1-.067.256c.051-.065.112-.125.182-.179.07-.053.147-.106.231-.157l1.106-.644.413.7-1.113.637a1.954 1.954 0 0 1-.248.13 1.07 1.07 0 0 1-.256.073c.159.028.327.093.504.196l1.113.651-.406.7-1.113-.651a3.307 3.307 0 0 1-.231-.154 1.122 1.122 0 0 1-.189-.175c.06.15.091.322.091.518v1.288H2.38z" fill="#494C4E" fill-rule="evenodd"/>
</svg>`);

export const inputLabelStyles = css`
	.d2l-input-label {
		cursor: default;
		display: block;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.2px;
		line-height: 0.9rem;
		margin-block: 0 0.4rem;
		margin-inline: 0;
		padding: 0;
	}
	:host([required]) .d2l-input-label::after,
	.d2l-input-label-required::after {
		background-image: ${requiredIcon};
		bottom: 0.25rem;
		content: "";
		display: inline-block;
		height: 0.3rem;
		inset-inline-start: 0.15rem;
		position: relative;
		width: 0.25rem;
	}
	:host([skeleton]) .d2l-input-label.d2l-skeletize::before {
		bottom: 0.25rem;
		top: 0.15rem;
	}
	:host([skeleton][required]) .d2l-input-label.d2l-skeletize::after {
		display: none;
	}
	.d2l-input-label-fieldset {
		border: none;
		display: block;
		margin: 0;
		padding: 0;
	}

	@media (prefers-contrast: more) {
		:host([required]) .d2l-input-label::after,
		.d2l-input-label-required::after {
			background-color: FieldText;
			background-image: none;
			mask-image: ${requiredIcon};
		}
	}
`;

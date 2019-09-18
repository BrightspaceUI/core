import { css } from 'lit-element/lit-element.js';

export const offscreenStyles = css`
	.d2l-offscreen {
		position: absolute !important;
		overflow: hidden;
		width: 1px;
		height: 1px;
		white-space: nowrap;
		left: -10000px;
	}
	:host([dir="rtl"]) .d2l-offscreen {
		left: 0;
		right: -10000px;
	}
`;

import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const iconStyles = css`
	:host {
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
		color: var(--d2l-color-ferrite);
		display: -ms-inline-flexbox;
		display: -webkit-inline-flex;
		display: inline-flex;
		fill: var(--d2l-icon-fill-color, currentcolor);
		height: var(--d2l-icon-height, 18px);
		-ms-flex-pack: center;
		-webkit-justify-content: center;
		justify-content: center;
		stroke: var(--d2l-icon-stroke-color, none);
		vertical-align: middle;
		width: var(--d2l-icon-width, 18px);
	}
	:host([hidden]) {
		display: none;
	}
	svg, ::slotted(svg) {
		display: block;
		height: 100%;
		pointer-events: none;
		width: 100%;
	}
	:host([dir="rtl"]) svg[mirror-in-rtl],
	:host([dir="rtl"]) ::slotted(svg[mirror-in-rtl]) {
		-webkit-transform: scale(-1,1);
		transform: scale(-1,1);
		transform-origin: center;
	}
`;

import '../colors/colors.js';
import { css } from 'lit';

export const iconStyles = css`
	:host {
		-webkit-align-items: center;
		align-items: center;
		color: var(--d2l-color-tungsten);
		display: -ms-inline-flexbox;
		display: -webkit-inline-flex;
		display: inline-flex;
		fill: var(--d2l-icon-fill-color, currentcolor);
		-ms-flex-align: center;
		-ms-flex-pack: center;
		height: var(--d2l-icon-height, 18px);
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
	svg[mirror-in-rtl],
	::slotted(svg[mirror-in-rtl]) {
		transform: var(--d2l-mirror-transform, ${document.dir === 'rtl' ? css`scale(-1, 1)` : css`none`}); /* stylelint-disable-line @stylistic/string-quotes, @stylistic/function-whitespace-after */
		transform-origin: center;
	}
`;

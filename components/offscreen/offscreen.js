import { css, html, LitElement } from 'lit';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

const getOffscreenStyles = () => css`
	.d2l-offscreen {
		direction: ${document.dir || css`unset`};
		height: 1px;
		inset-inline-start: -10000px;
		left: -10000px;
		overflow: hidden;
		position: absolute !important;
		white-space: nowrap;
		width: 1px;
	}
	:host([dir="rtl"]) .d2l-offscreen {
		left: 0;
		right: -10000px;
	}
`;

export const offscreenStyles = getOffscreenStyles();

/**
 * A component for positioning content offscreen to only be visible to screen readers.
 * @slot - Default content placed inside of the component
 */
class Offscreen extends RtlMixin(LitElement) {
	static get styles() {
		return getOffscreenStyles();
	}
	render() {
		return html`<slot></slot>`;
	}
}
customElements.define('d2l-offscreen', Offscreen);

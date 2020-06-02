import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

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

class Offscreen extends RtlMixin(LitElement) {
	static get styles() {
		return css`
			:host {
				position: absolute !important;
				overflow: hidden;
				width: 1px;
				height: 1px;
				white-space: nowrap;
				left: -10000px;
			}
			:host([dir="rtl"]) {
				left: 0;
				right: -10000px;
			}
		`;
	}
	render() {
		return html`<slot></slot>`;
	}
}
customElements.define('d2l-offscreen', Offscreen);

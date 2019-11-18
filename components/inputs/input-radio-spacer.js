import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class InputRadioSpacer extends RtlMixin(LitElement) {

	static get styles() {
		return css`
				:host {
					box-sizing: border-box;
					display: block;
					padding-left: 1.7rem;
					margin-bottom: 0.9rem;
				}
				:host([dir="rtl"]) {
					padding-right: 1.7rem;
					padding-left: 0;
				}
			`;
	}

	render() {
		return html`<slot></slot>`;
	}

}
customElements.define('d2l-input-radio-spacer', InputRadioSpacer);

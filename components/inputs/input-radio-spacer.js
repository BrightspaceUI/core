import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * Used to align related content below radio buttons
 * @slot - Additional related content
 */
class InputRadioSpacer extends RtlMixin(LitElement) {

	static get styles() {
		return css`
				:host {
					box-sizing: border-box;
					display: block;
					margin-bottom: 0.9rem;
					padding-left: 1.7rem;
				}
				:host([dir="rtl"]) {
					padding-left: 0;
					padding-right: 1.7rem;
				}
			`;
	}

	render() {
		return html`<slot></slot>`;
	}

}
customElements.define('d2l-input-radio-spacer', InputRadioSpacer);

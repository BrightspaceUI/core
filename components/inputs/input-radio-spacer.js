import { css, html, LitElement } from 'lit';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * Used to align related content below radio buttons
 * @slot - Additional related content
 * @typedef {InputRadioSpacer} InputRadioSpacerExported
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
				:host(.d2l-input-inline-help) {
					margin-bottom: 0.9rem !important;
				}
			`;
	}

	render() {
		return html`<slot></slot>`;
	}

}
customElements.define('d2l-input-radio-spacer', InputRadioSpacer);

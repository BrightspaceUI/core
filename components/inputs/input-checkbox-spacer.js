import { css, html, LitElement } from 'lit';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * Used to align related content below checkboxes
 * @slot - Additional related content
 */
class InputCheckboxSpacer extends RtlMixin(LitElement) {

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
customElements.define('d2l-input-checkbox-spacer', InputCheckboxSpacer);

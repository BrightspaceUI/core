import { css, html, LitElement } from 'lit-element/lit-element.js';
import { inputLabelStyles } from './input-label-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A component wrapper to be used when a page contains multiple inputs which are related (for example to form an address) to wrap those related inputs.
 * @slot - Related input components
 */
class InputFieldset extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Label for the fieldset (REQUIRED)
			 */
			label: { type: String },
			/**
			 * Indicates that a value is required for inputs in the fieldset
			 */
			required: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [ inputLabelStyles,
			css`
				:host {
					display: block;
				}
				:host([hidden]) {
					display: none;
				}
			`
		];
	}

	constructor() {
		super();
		this.required = false;
	}

	render() {
		return html`
			<fieldset class="d2l-input-label-fieldset">
				<legend class="d2l-input-label">${this.label}</legend>
				<slot></slot>
			</fieldset>
		`;
	}

}
customElements.define('d2l-input-fieldset', InputFieldset);

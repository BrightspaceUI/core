import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { inputLabelStyles } from './input-label-styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A component wrapper to be used when a page contains multiple inputs which are related (for example to form an address) to wrap those related inputs.
 * @slot - Related input components
 */
class InputFieldset extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Label for the fieldset
			 */
			label: { type: String },
			/**
			 * Hides the label visually
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden', reflect: true },
			/**
			 * Indicates that a value is required for inputs in the fieldset
			 */
			required: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [ inputLabelStyles, offscreenStyles,
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
		this.labelHidden = false;
		this.required = false;
	}

	render() {
		const legendClasses = {
			'd2l-input-label': true,
			'd2l-offscreen': this.labelHidden
		};
		return html`
			<fieldset class="d2l-input-label-fieldset">
				<legend class="${classMap(legendClasses)}">${this.label}</legend>
				<slot></slot>
			</fieldset>
		`;
	}

}
customElements.define('d2l-input-fieldset', InputFieldset);

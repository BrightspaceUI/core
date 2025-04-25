import { css, html, LitElement } from 'lit';
import { inputLabelStyles } from './input-label-styles.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

/**
 * A wrapper for <d2l-input-checkbox> components which provides spacing between the items.
 * @slot - Checkbox components
 */
class InputCheckboxGroup extends PropertyRequiredMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Label for the group of checkboxes
			 * @type {string}
			 */
			label: { required: true, type: String },
			/**
			 * Hides the label visually
			 * @type {boolean}
			 */
			labelHidden: { attribute: 'label-hidden', reflect: true, type: Boolean }
		};
	}

	static get styles() {
		return [inputLabelStyles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.wrapper {
				display: flex;
				flex-direction: column;
				gap: 0.6rem;
			}
			::slotted(d2l-input-checkbox) {
				margin-bottom: 0;
			}
			.d2l-input-label {
				margin-block-end: 0.6rem;
			}
			.d2l-input-label[hidden] {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.labelHidden = false;
	}

	render() {
		return html`
			<fieldset class="d2l-input-label-fieldset">
				<legend class="d2l-input-label" ?hidden="${this.labelHidden}">${this.label}</legend>
				<div class="wrapper"><slot></slot></div>
			</fieldset>
		`;
	}

}
customElements.define('d2l-input-checkbox-group', InputCheckboxGroup);

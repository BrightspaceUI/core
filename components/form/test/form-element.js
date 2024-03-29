import '../../validation/validation-custom.js';
import { html, LitElement } from 'lit';
import { FormElementMixin } from '../form-element-mixin.js';

class FormElement extends FormElementMixin(LitElement) {

	static get properties() {
		return {
			isValidationCustomValid: { type: Boolean },
			tooltipMessage: { type: String },
			value: { type: String }
		};
	}

	constructor() {
		super();
		this.isValidationCustomValid = true;
		this.value = '';
	}

	get label() {
		return 'Test form element';
	}

	get validationMessage() {
		if (this.validity.rangeOverflow) {
			return `${this.label} failed with an overridden validation message`;
		}
		return super.validationMessage;
	}

	get validity() {
		const input = this.shadowRoot && this.shadowRoot.querySelector('input');
		if (!input.validity.valid) {
			return input.validity;
		}
		return super.validity;
	}

	render() {
		return html`
			<div>
				<h1>Test Form Element</h1>
				<input type="text" required .value="${this.value}"/>
				<d2l-validation-custom @d2l-validation-custom-validate=${this._validate} failure-text="Internal custom validation failed">
				</d2l-validation-custom>
			</div>
		`;
	}

	async _validate(e) {
		e.detail.resolve(this.isValidationCustomValid);
	}
}

customElements.define('d2l-test-form-element', FormElement);

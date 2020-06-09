import '../../validation/validation-custom.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { FormElementMixin } from '../form-element-mixin.js';

class FormElement extends FormElementMixin(LitElement) {

	static get properties() {
		return {
			isValidationCustomValid: { type: Boolean },
			tooltipMessage: { type: String },
			value: { type: String, reflect: true }
		};
	}

	constructor() {
		super();
		this.isValidationCustomValid = true;
	}

	render() {
		return html`
			<div>
				<h1>Test Form Element</h1>
				<input type="text" required/>
				<d2l-validation-custom @d2l-validation-custom-validate=${this._validate} failure-text="Internal custom validation failed">
				</d2l-validation-custom>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'value') {
				const input = this.shadowRoot.querySelector('input');
				input.value = this.value;
			}
		});
	}

	get label() {
		return 'Test form element';
	}

	get validationMessageRangeOverflow() {
		return `${this.labelText} failed with an overridden validation message`;
	}

	validationTooltipHide() {
		this.tooltipMessage = null;
	}

	validationTooltipShow(message) {
		this.tooltipMessage = message;
	}

	get validity() {
		const input = this.shadowRoot.querySelector('input');
		if (!input.validity.valid) {
			return input.validity;
		}
		return super.validity;
	}

	async _validate(e) {
		e.detail.resolve(this.isValidationCustomValid);
	}
}

customElements.define('d2l-test-form-element', FormElement);

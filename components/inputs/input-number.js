import './input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatNumber, parseNumber } from '@brightspace-ui/intl/lib/number.js';
import { FormElementMixin, ValidationType } from '../form/form-element-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

export function formatValue(value, minFractionDigits, maxFractionDigits) {
	const options = {
		maximumFractionDigits: maxFractionDigits ? maxFractionDigits : undefined,
		minimumFractionDigits: minFractionDigits ? minFractionDigits : undefined
	};
	return formatNumber(value, options);
}

class InputNumber extends FormElementMixin(LocalizeCoreElement(RtlMixin(LitElement))) {

	static get properties() {
		return {
			ariaInvalid: { type: String, attribute: 'aria-invalid' },
			autocomplete: { type: String },
			autofocus: { type: Boolean },
			disabled: { type: Boolean },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			max: { type: Number },
			maxFractionDigits: { type: Number, attribute: 'max-fraction-digits' },
			min: { type: Number },
			minFractionDigits: { type: Number, attribute: 'min-fraction-digits' },
			placeholder: { type: String },
			required: { type: Boolean },
			value: { type: Number },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return [
			css`
				:host {
					display: inline-block;
					width: 4rem;
				}
			`
		];
	}

	constructor() {
		super();
		this.autofocus = false;
		this.disabled = false;
		this.labelHidden = false;
		this.required = false;

		this._formattedValue = '';
	}

	get value() { return this._value; }
	set value(val) {
		const oldValue = this.value;
		try {
			this._formattedValue = formatValue(val, this.minFractionDigits, this.maxFractionDigits);
			this._value = parseNumber(this._formattedValue);
		} catch (err) {
			this._formattedValue = '';
			this._value = undefined;
		}
		this.requestValidate(ValidationType.UPDATE_EXISTING_ERRORS);
		this.requestUpdate('value', oldValue);
	}

	render() {
		const ariaInvalid = this.invalid ? 'true' : this.ariaInvalid;

		return html`
			<d2l-input-text
				aria-invalid="${ifDefined(ariaInvalid)}"
				autocomplete="${ifDefined(this.autocomplete)}"
				?autofocus="${this.autofocus}"
				@change="${this._handleChange}"
				?disabled="${this.disabled}"
				label="${this.label}"
				?label-hidden="${this.labelHidden}"
				max="${this.max}"
				max-fraction-digits="${this.maxFractionDigits}"
				min="${this.min}"
				min-fraction-digits="${this.minFractionDigits}"
				name="${ifDefined(this.name)}"
				placeholder="${ifDefined(this.placeholder)}"
				?required="${this.required}"
				.value="${this._formattedValue}"
			></d2l-input-text>
		`;
	}

	focus() {
		this.shadowRoot.querySelector('d2l-input-text').focus();
	}

	get validationMessage() {
		const inputTextElement = this.shadowRoot.querySelector('d2l-input-text');
		return inputTextElement ? inputTextElement.validationMessage : super.validationMessage;
	}

	get validity() {
		const inputTextElement = this.shadowRoot.querySelector('d2l-input-text');
		return inputTextElement ? inputTextElement.validity : super.validity;
	}

	async _handleChange(e) {
		const value = e.target.value;
		this._formattedValue = value;
		await this.updateComplete;
		this.value = parseNumber(value);
	}
}
customElements.define('d2l-input-number', InputNumber);

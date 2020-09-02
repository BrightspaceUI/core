import './input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatNumber, parseNumber } from '@brightspace-ui/intl/lib/number.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';

export function formatValue(value, minFractionDigits, maxFractionDigits) {
	const options = {
		maximumFractionDigits: maxFractionDigits ? maxFractionDigits : undefined,
		minimumFractionDigits: minFractionDigits ? minFractionDigits : undefined
	};
	return formatNumber(value, options);
}

class InputNumber extends FormElementMixin(LocalizeCoreElement(LitElement)) {

	static get properties() {
		return {
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
		this._inputId = getUniqueId();
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
		this.requestUpdate('value', oldValue);
	}

	render() {
		return html`
			<d2l-input-text
				autocomplete="${ifDefined(this.autocomplete)}"
				?autofocus="${this.autofocus}"
				@change="${this._handleChange}"
				@d2l-form-element-should-validate="${this._handleNestedFormElementValidation}"
				?disabled="${this.disabled}"
				.forceInvalid="${this.invalid}"
				id="${this._inputId}"
				label="${this.label}"
				?label-hidden="${this.labelHidden}"
				name="${ifDefined(this.name)}"
				placeholder="${ifDefined(this.placeholder)}"
				?required="${this.required}"
				.value="${this._formattedValue}"
			></d2l-input-text>
			${ this.validationError ? html`<d2l-tooltip for=${this._inputId} state="error" align="start">${this.validationError}</d2l-tooltip>` : null }
		`;
	}

	focus() {
		this.shadowRoot.querySelector('d2l-input-text').focus();
	}

	async validate(showErrors) {
		const errors = await super.validate(showErrors);
		if (errors.length !== 0) {
			return errors;
		}
		return await this.shadowRoot.querySelector('d2l-input-text').validate(showErrors);
	}

	get validationMessage() {
		if (this.validity.rangeOverflow || this.validity.rangeUnderflow) {
			const label = this.label && !this.labelHidden ? this.label : 'Number';
			const minNumber = typeof(this.min) === 'number' ? formatValue(this.min, this.minFractionDigits, this.maxFractionDigits) : null;
			const maxNumber = typeof(this.max) === 'number' ? formatValue(this.max, this.minFractionDigits, this.maxFractionDigits) : null;
			if (minNumber && maxNumber) {
				return this.localize('components.input-number.errorOutsideRange', { label, minNumber, maxNumber });
			} else if (maxNumber) {
				return this.localize('components.input-number.errorMaxNumberOnly', { label, maxNumber });
			} else if (minNumber) {
				return this.localize('components.input-number.errorMinNumberOnly', { label, minNumber });
			}
		}
		return super.validationMessage;
	}

	async _handleChange(e) {
		const value = e.target.value;
		this._formattedValue = value;
		await this.updateComplete;
		this.value = parseNumber(value);
		this.setFormValue(this.value);
		this.setValidity({
			rangeUnderflow: typeof(this.min) === 'number' && this.value < this.min,
			rangeOverflow: typeof(this.max) === 'number' && this.value > this.max
		});
		await this.requestValidate();
	}

	_handleNestedFormElementValidation(e) {
		e.preventDefault();
	}
}
customElements.define('d2l-input-number', InputNumber);

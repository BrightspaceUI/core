import './input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatNumber, parseNumber } from '@brightspace-ui/intl/lib/number.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

function formatValue(value, minFractionDigits, maxFractionDigits) {
	const options = {
		maximumFractionDigits: maxFractionDigits,
		minimumFractionDigits: minFractionDigits
	};
	return formatNumber(value, options);
}

class InputNumber extends SkeletonMixin(FormElementMixin(LocalizeCoreElement(LitElement))) {

	static get properties() {
		return {
			autocomplete: { type: String },
			autofocus: { type: Boolean },
			disabled: { type: Boolean },
			inputWidth: { attribute: 'input-width', type: String },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			max: { type: Number },
			maxExclusive: { type: Boolean, attribute: 'max-exclusive' },
			maxFractionDigits: { type: Number, attribute: 'max-fraction-digits' },
			min: { type: Number },
			minExclusive: { type: Boolean, attribute: 'min-exclusive' },
			minFractionDigits: { type: Number, attribute: 'min-fraction-digits' },
			placeholder: { type: String },
			required: { type: Boolean },
			title: { type: String },
			value: { type: Number },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return [ super.styles,
			css`
				:host {
					display: inline-block;
					position: relative;
					width: 100%;
				}
				:host([hidden]) {
					display: none;
				}
			`
		];
	}

	constructor() {
		super();
		this.autofocus = false;
		this.disabled = false;
		this.inputWidth = '4rem';
		this.labelHidden = false;
		this.maxExclusive = false;
		this.minExclusive = false;
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

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (!this.label) {
			console.warn('d2l-input-number component requires label text');
		}
		this.addEventListener('d2l-localize-behavior-language-changed', () => {
			if (this._formattedValue.length > 0) {
				this._formattedValue = formatValue(this.value, this.minFractionDigits, this.maxFractionDigits);
			}
		});
	}

	render() {
		const tooltip = this.validationError && this.childErrors.size === 0 ? html`<d2l-tooltip announced for="${this._inputId}" state="error" align="start">${this.validationError}</d2l-tooltip>` : null;
		return html`
			<d2l-input-text
				autocomplete="${ifDefined(this.autocomplete)}"
				?noValidate="${this.noValidate}"
				?autofocus="${this.autofocus}"
				@blur="${this._handleBlur}"
				@change="${this._handleChange}"
				?disabled="${this.disabled}"
				.forceInvalid="${this.invalid}"
				id="${this._inputId}"
				input-width="${this.inputWidth}"
				label="${ifDefined(this.label)}"
				?label-hidden="${this.labelHidden}"
				name="${ifDefined(this.name)}"
				placeholder="${ifDefined(this.placeholder)}"
				?required="${this.required}"
				?skeleton="${this.skeleton}"
				title="${ifDefined(this.title)}"
				.value="${this._formattedValue}"
			></d2l-input-text>
			${tooltip}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'value') {
				this.setFormValue(this.value);

				let rangeUnderflowCondition = false;
				if (typeof(this.min) === 'number') {
					rangeUnderflowCondition = this.minExclusive ? this.value <= this.min : this.value < this.min;
				}

				let rangeOverflowCondition = false;
				if (typeof(this.max) === 'number') {
					rangeOverflowCondition = this.maxExclusive ? this.value >= this.max : this.value > this.max;
				}

				this.setValidity({
					rangeUnderflow: rangeUnderflowCondition,
					rangeOverflow: rangeOverflowCondition
				});
				this.requestValidate(false);
			}
		});
	}

	focus() {
		const elem = this.shadowRoot.querySelector('d2l-input-text');
		if (elem) elem.focus();
	}

	async validate() {
		const inputTextElem = this.shadowRoot.querySelector('d2l-input-text');
		await inputTextElem.updateComplete;
		const childErrors = await inputTextElem.validate();
		const errors = await super.validate();
		return [...childErrors, ...errors];
	}

	get validationMessage() {
		if (this.validity.rangeOverflow || this.validity.rangeUnderflow) {
			const minNumber = typeof(this.min) === 'number' ? formatValue(this.min, this.minFractionDigits, this.maxFractionDigits) : null;
			const maxNumber = typeof(this.max) === 'number' ? formatValue(this.max, this.minFractionDigits, this.maxFractionDigits) : null;
			const minInclusive = !this.minExclusive ? ' or equal to' : '';
			const maxInclusive = !this.maxExclusive ? ' or equal to' : '';
			if (minNumber && maxNumber) {
				return this.localize('components.form-element.input.number.rangeError', { min: minNumber, max: maxNumber, minInclusive: minInclusive, maxInclusive: maxInclusive });
			} else if (maxNumber) {
				return this.localize('components.form-element.input.number.rangeOverflow', { max: maxNumber, maxInclusive: maxInclusive });
			} else if (minNumber) {
				return this.localize('components.form-element.input.number.rangeUnderflow', { min: minNumber, minInclusive: minInclusive });
			}
		}
		return super.validationMessage;
	}

	_handleBlur() {
		this.requestValidate(true);
	}

	async _handleChange(e) {
		const value = e.target.value;
		this._formattedValue = value;
		await this.updateComplete;
		const oldValue = this.value;
		this.value = value.trim() === '' ? NaN : parseNumber(value);

		if (oldValue !== this.value) {
			this.dispatchEvent(new CustomEvent(
				'change',
				{ bubbles: true, composed: false }
			));
		}
	}

}
customElements.define('d2l-input-number', InputNumber);

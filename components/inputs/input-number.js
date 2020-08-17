import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatNumber, parseNumber } from '@brightspace-ui/intl/lib/number.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputLabelStyles } from './input-label-styles.js';
import { inputStyles } from './input-styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';

function checkMinMaxValue(value, min, max) {
	if (min !== undefined) value = Math.max(value, min);
	if (max !== undefined) value = Math.min(value, max);
	return value;
}

function formatValue(value, minFractionDigits, maxFractionDigits) {
	const options = {
		maximumFractionDigits: maxFractionDigits,
		minimumFractionDigits: minFractionDigits
	};
	return formatNumber(value, options);
}

class InputNumber extends LitElement {

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
			name: { type: String },
			placeholder: { type: String },
			required: { type: Boolean },
			value: { type: Number },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return [
			inputLabelStyles,
			inputStyles,
			offscreenStyles,
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
			const newValue = checkMinMaxValue(val, this.min, this.max);
			this._formattedValue = formatValue(newValue, this.minFractionDigits, this.maxFractionDigits);
			this._value = parseNumber(this._formattedValue);
		} catch (err) {
			this._formattedValue = '';
			this._value = undefined;
		}
		this.requestUpdate('value', oldValue);
	}

	render() {
		const ariaRequired = this.required ? 'true' : undefined;

		return html`
			<label
				class="${this.label && !this.labelHidden ? 'd2l-input-label' : 'd2l-offscreen'}"
				for="${this._inputId}">${this.label}</label>
			<input
				aria-required="${ifDefined(ariaRequired)}"
				autocomplete="${ifDefined(this.autocomplete)}"
				?autofocus="${this.autofocus}"
				@change="${this._handleChange}"
				class="d2l-input"
				?disabled="${this.disabled}"
				id="${this._inputId}"
				name="${ifDefined(this.name)}"
				placeholder="${ifDefined(this.placeholder)}"
				type="text"
				.value="${this._formattedValue}">
		`;
	}

	async _handleChange(e) {
		const value = e.target.value;
		this._formattedValue = value;
		await this.updateComplete;
		this.value = value;
	}
}
customElements.define('d2l-input-number', InputNumber);

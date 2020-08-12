import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputLabelStyles } from './input-label-styles.js';
import { inputStyles } from './input-styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';

class InputNumber extends LitElement {

	static get properties() {
		return {
			autocomplete: { type: String },
			autofocus: { type: Boolean },
			disabled: { type: Boolean },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			max: { type: Number },
			min: { type: Number },
			name: { type: String },
			placeholder: { type: String },
			required: { type: Boolean },
			step: { type: Number },
			value: { type: Number }
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

		this._inputId = getUniqueId();
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
				max="${ifDefined(this.max)}"
				min="${ifDefined(this.min)}"
				name="${ifDefined(this.name)}"
				placeholder="${ifDefined(this.placeholder)}"
				step="${ifDefined(this.step)}"
				type="number"
				.value="${this.value}">
		`;
	}
}
customElements.define('d2l-input-number', InputNumber);

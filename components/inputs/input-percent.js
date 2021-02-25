import './input-number.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

class InputPercent extends SkeletonMixin(FormElementMixin(LocalizeCoreElement(RtlMixin(LitElement)))) {

	static get properties() {
		return {
			autocomplete: { type: String },
			autofocus: { type: Boolean },
			disabled: { type: Boolean },
			inputWidth: { attribute: 'input-width', type: String },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			maxFractionDigits: { type: Number, attribute: 'max-fraction-digits' },
			minFractionDigits: { type: Number, attribute: 'min-fraction-digits' },
			placeholder: { type: String },
			required: { type: Boolean },
			title: { type: String },
			value: { type: Number }
		};
	}

	static get styles() {
		return [ super.styles,
			css`
				:host {
					--d2l-input-text-align: end;
					display: inline-block;
					position: relative;
					width: 100%;
				}
				:host([hidden]) {
					display: none;
				}
				:host([disabled]) [slot="right"] {
					opacity: 0.5;
				}
				[slot="right"] {
					box-sizing: border-box;
					cursor: default;
					padding-left: 0.2rem;
					padding-right: 0.55rem;
				}
				:host([dir="rtl"]) [slot="right"] {
					padding-left: 0.55rem;
					padding-right: 0.2rem;
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
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (!this.label) {
			console.warn('d2l-input-percent component requires label text');
		}
	}

	render() {
		return html`
			<d2l-input-number
				autocomplete="${ifDefined(this.autocomplete)}"
				?autofocus="${this.autofocus}"
				@blur="${this._handleBlur}"
				@change="${this._handleChange}"
				?disabled="${this.disabled}"
				.forceInvalid="${this.invalid}"
				hide-invalid-icon
				input-width="${ifDefined(this.inputWidth)}"
				label="${ifDefined(this.label)}"
				?label-hidden="${this.labelHidden}"
				max="100"
				max-fraction-digits="${ifDefined(this.maxFractionDigits)}"
				min="0"
				min-fraction-digits="${ifDefined(this.minFractionDigits)}"
				name="${ifDefined(this.name)}"
				?noValidate="${this.noValidate}"
				placeholder="${ifDefined(this.placeholder)}"
				?required="${this.required}"
				?skeleton="${this.skeleton}"
				title="${ifDefined(this.title)}"
				value="${ifDefined(this.value)}">
					<span slot="right" @click="${this._handleSymbolClick}">%</span>
					<slot slot="after" name="after"></slot>
			</d2l-input-number>
		`;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('d2l-input-number');
		if (elem) elem.focus();
	}

	async validate() {
		const inputNumberElem = this.shadowRoot.querySelector('d2l-input-number');
		await inputNumberElem.updateComplete;
		const childErrors = await inputNumberElem.validate();
		const errors = await super.validate();
		return [...childErrors, ...errors];
	}

	async _handleChange(e) {
		const oldValue = this.value;
		this.value = e.target.value;

		if (e.target.value === undefined) {
			await this.requestUpdate();
			this.value = oldValue;
		}

		await this.requestUpdate();

		if (oldValue !== this.value) {
			this.dispatchEvent(new CustomEvent(
				'change',
				{ bubbles: true, composed: false }
			));
		}
	}

	_handleSymbolClick() {
		this.focus();
	}

}
customElements.define('d2l-input-percent', InputPercent);

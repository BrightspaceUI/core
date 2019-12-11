import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputStyles } from './input-styles.js';
import { labelStyles } from './input-label-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class InputText extends RtlMixin(LitElement) {

	static get properties() {
		return {
			ariaInvalid: { type: String, attribute: 'aria-invalid' },
			autocomplete: { type: String },
			autofocus: { type: Boolean },
			disabled: { type: Boolean, reflect: true },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			max: { type: String },
			maxlength: { type: Number },
			min: { type: String },
			minlength: { type: Number },
			name: { type: String },
			pattern: { type: String },
			placeholder: { type: String },
			preventSubmit: { type: Boolean, attribute: 'prevent-submit' },
			readonly: { type: Boolean },
			required: { type: Boolean, reflect: true },
			size: { type: Number },
			step: { type: String },
			type: { type: String },
			value: { type: String }
		};
	}

	static get styles() {
		return [ inputStyles, labelStyles,
			css`
				:host {
					display: inline-block;
					width: 100%;
				}
				:host([hidden]) {
					display: none;
				}
				label {
					display: block;
				}
			`
		];
	}

	constructor() {
		super();
		this.autofocus = false;
		this.disabled = false;
		this.labelHidden = false;
		this.preventSubmit = false;
		this.readonly = false;
		this.required = false;
		this.type = 'text';
		this.value = '';
	}

	render() {
		const ariaRequired = this.required ? 'true' : undefined;
		const input = html`
			<input aria-invalid="${ifDefined(this.ariaInvalid)}"
				aria-label="${ifDefined(this._getAriaLabel())}"
				aria-required="${ifDefined(ariaRequired)}"
				autocomplete="${ifDefined(this.autocomplete)}"
				?autofocus="${this.autofocus}"
				@change="${this._handleChange}"
				class="d2l-input"
				?disabled="${this.disabled}"
				@input="${this._handleInput}"
				@invalid="${this._handleInvalid}"
				@keypress="${this._handleKeypress}"
				max="${ifDefined(this.max)}"
				maxlength="${ifDefined(this.maxlength)}"
				min="${ifDefined(this.min)}"
				minlength="${ifDefined(this.minlength)}"
				name="${ifDefined(this.name)}"
				pattern="${ifDefined(this.pattern)}"
				placeholder="${ifDefined(this.placeholder)}"
				?readonly="${this.readonly}"
				size="${ifDefined(this.size)}"
				step="${ifDefined(this.step)}"
				tabindex="${ifDefined(this.tabindex)}"
				type="${this._getType()}"
				.value="${this.value}">
		`;
		if (this.label && !this.labelHidden) {
			return html`
				<label>
					<span class="d2l-input-label">${this.label}</span>
					${input}
				</label>`;
		}
		return input;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('.d2l-input');
		if (elem) elem.focus();
	}

	_getAriaLabel() {
		if (this.label && this.labelHidden) {
			return this.label;
		}
		if (this.hasAttribute('aria-label')) {
			return this.getAttribute('aria-label');
		}
		return undefined;
	}

	_getType() {
		if (this.type === 'email' || this.type === 'number' || this.type === 'password' || this.type === 'tel' || this.type === 'text' || this.type === 'search' || this.type === 'url') {
			return this.type;
		}
		return 'text';
	}

	_handleChange() {
		// Change events aren't composed, so we need to re-dispatch
		this.dispatchEvent(new CustomEvent(
			'change',
			{bubbles: true, composed: false}
		));
	}

	_handleInput(e) {
		this.value = e.target.value;
		return true;
	}

	_handleKeypress(e) {
		if (this.preventSubmit && e.keyCode === 13) {
			e.preventDefault();
			return false;
		}
		return true;
	}

	_handleInvalid(e) {
		e.preventDefault();
	}

}
customElements.define('d2l-input-text', InputText);

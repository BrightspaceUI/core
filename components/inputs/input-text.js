import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputStyles } from './input-styles.js';
import { InputTextMixin } from './input-text-mixin.js';

class InputText extends InputTextMixin(LitElement) {

	static get properties() {
		return {
			autocomplete: { type: String },
			max: { type: String },
			min: { type: String },
			pattern: { type: String },
			preventSubmit: { type: Boolean, attribute: 'prevent-submit' },
			size: { type: Number },
			step: { type: String },
			type: { type: String },
			value: { type: String }
		};
	}

	static get styles() {
		return [ inputStyles,
			css`
				:host {
					display: inline-block;
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
		this.preventSubmit = false;
		this.type = 'text';
		this.value = '';
	}

	render() {
		return html`
			<input aria-invalid="${ifDefined(this.ariaInvalid)}"
			 	aria-label="${ifDefined(this.ariaLabel)}"
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
				?required="${this.required}"
				size="${ifDefined(this.size)}"
				step="${ifDefined(this.step)}"
				tabindex="${ifDefined(this.tabindex)}"
				type="${this._getType()}"
				.value="${this.value}">
		`;
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

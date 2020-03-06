import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputStyles } from './input-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class InputContainer extends RtlMixin(LitElement) {

	static get properties() {
		return {
			ariaLabel: { type: String, attribute: 'aria-label' },
			class: { type: String },
			disabled: { type: Boolean },
			keypress: { type: Object },
			maxlength: { type: Number },
			placeholder: { type: String },
			right: { type: Boolean },
			type: { type: String },
			value: { type: String }
		};
	}

	static get styles() {
		return [ inputStyles,
			css`
				:host {
					--d2l-input-container-slot-content-padding: 0.8rem;
				}
				.d2l-input-container {
					position: relative;
				}
				.d2l-input,
				:host([disabled]) .d2l-input:hover,
				:host([disabled][right][dir="rtl"]) .d2l-input:hover {
					padding-left: 2.4rem;
					padding-right: 0.75rem;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					-webkit-appearance: textfield;
				}
				:host([dir="rtl"]) .d2l-input,
				:host([disabled][dir="rtl"]) .d2l-input:hover,
				:host([right]) .d2l-input,
				:host([disabled][right]) .d2l-input:hover {
					padding-left: 0.75rem;
					padding-right: 2.4rem;
				}
				:host([dir="rtl"][right]) .d2l-input {
					padding-left: 2.4rem;
					padding-right: 0.75rem;
				}
				::slotted(*) {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
				}
				::slotted(*),
				:host([dir="rtl"][right]) ::slotted(*) {
					left: var(--d2l-input-container-slot-content-padding);
					right: auto;
				}
				:host([right]) ::slotted(*),
				:host([dir="rtl"]) ::slotted(*) {
					left: auto;
					right: var(--d2l-input-container-slot-content-padding);
				}
				.d2l-input:hover,
				.d2l-input:focus,
				.d2l-input.d2l-input-focus,
				:host([dir="rtl"][right]) .d2l-input:hover,
				:host([dir="rtl"][right]) .d2l-input:focus,
				:host([dir="rtl"][right]) .d2l-input.d2l-input-focus {
					padding-left: calc(2.4rem - 1px);
					padding-right: calc(0.75rem - 1px);
				}
				:host([dir="rtl"]) .d2l-input:hover,
				:host([dir="rtl"]) .d2l-input:focus,
				:host([dir="rtl"]) .d2l-input.d2l-input-focus,
				:host([right]) .d2l-input.d2l-input-focus,
				:host([right]) .d2l-input:hover,
				:host([right]) .d2l-input:focus {
					padding-left: calc(0.75rem - 1px);
					padding-right: calc(2.4rem - 1px);
				}
			`
		];
	}

	constructor() {
		super();

		this.value = '';
	}

	render() {
		const inputClass = this.class ? `${this.class} d2l-input` : 'd2l-input';
		const input = html`
			<div class="d2l-input-container">
				<input
					aria-label="${ifDefined(this.ariaLabel)}"
					class="${inputClass}"
					@change="${this._handleChange}"
					?disabled="${this.disabled}"
					@input="${this._handleInput}"
					@keypress="${this._handleKeyPress}"
					maxlength="${ifDefined(this.maxlength)}"
					placeholder="${ifDefined(this.placeholder)}"
					type="${ifDefined(this.type)}"
					.value="${this.value}">
				<slot></slot>
			</div>
		`;
		return input;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('.d2l-input');
		if (elem) elem.focus();
	}

	_handleChange(e) {
		this.value = e.target.value;
		this.dispatchEvent(new CustomEvent('d2l-input-container-change', { bubbles: true, composed: true }));
	}

	_handleInput(e) {
		this.value = e.target.value;
		this.dispatchEvent(new CustomEvent('d2l-input-container-input', { bubbles: true, composed: true }));
	}

	_handleKeyPress(e) {
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: {
				keyCode: e.keyCode
			}
		};
		this.dispatchEvent(new CustomEvent('d2l-input-container-keypress', eventDetails));
	}

}
customElements.define('d2l-input-container', InputContainer);

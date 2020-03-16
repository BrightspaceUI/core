import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputLabelStyles } from './input-label-styles.js';
import { inputStyles } from './input-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class InputText extends RtlMixin(LitElement) {

	static get properties() {
		return {
			ariaHaspopup: { type: String, attribute: 'aria-haspopup'},
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
			value: { type: String },
			_firstSlotWidth: { type: Number },
			_focused: { type: Boolean },
			_hovered: { type: Boolean },
			_lastSlotWidth: { type: Number }
		};
	}

	static get styles() {
		return [ inputStyles, inputLabelStyles,
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
				.d2l-input-text-container {
					position: relative;
				}
				.d2l-input {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					-webkit-appearance: textfield;
				}
				#first-slot, #last-slot {
					display: flex;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
				}
				#first-slot {
					left: 0;
				}
				#last-slot {
					right: 0;
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

		this._focused = false;
		this._hovered = false;
		this._firstSlotWidth = 0;
		this._lastSlotWidth = 0;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('blur', this._handleBlur, true);
		this.addEventListener('focus', this._handleFocus, true);

		this.addEventListener('mouseover', this._handleMouseEnter);
		this.addEventListener('mouseout', this._handleMouseLeave);
	}

	render() {
		const isFocusedOrHovered = !this.disabled && (this._focused || this._hovered);
		const inputClasses = {
			'd2l-input': true,
			'd2l-input-focus': isFocusedOrHovered
		};
		const ariaRequired = this.required ? 'true' : undefined;

		const inputStyles = {};
		if (this._firstSlotWidth > 0) {
			inputStyles.paddingLeft = isFocusedOrHovered ? `${this._firstSlotWidth - 1}px` : `${this._firstSlotWidth}px`;
		}
		if (this._lastSlotWidth > 0) {
			inputStyles.paddingRight = isFocusedOrHovered ? `${this._lastSlotWidth - 1}px` : `${this._lastSlotWidth}px`;
		}
		const firstSlotName = (this.dir === 'rtl') ? 'right' : 'left';
		const lastSlotName = (this.dir === 'rtl') ? 'left' : 'right';

		const input = html`
			<div class="d2l-input-text-container">
				<input aria-invalid="${ifDefined(this.ariaInvalid)}"
					aria-haspopup="${ifDefined(this.ariaHaspopup)}"
					aria-label="${ifDefined(this._getAriaLabel())}"
					aria-required="${ifDefined(ariaRequired)}"
					autocomplete="${ifDefined(this.autocomplete)}"
					?autofocus="${this.autofocus}"
					@change="${this._handleChange}"
					class="${classMap(inputClasses)}"
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
					style="${styleMap(inputStyles)}"
					tabindex="${ifDefined(this.tabindex)}"
					type="${this._getType()}"
					.value="${this.value}">
				<div id="first-slot"><slot name="${firstSlotName}" @slotchange="${this._onSlotChange}"></slot></div>
				<div id="last-slot"><slot name="${lastSlotName}" @slotchange="${this._onSlotChange}"></slot></div>
			</div>
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

	async focus() {
		const elem = this.shadowRoot.querySelector('.d2l-input');
		if (elem) {
			elem.focus();
		} else {
			await this.updateComplete;
			this.focus();
		}
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

	_handleBlur() {
		this._focused = false;
	}

	_handleChange() {
		// Change events aren't composed, so we need to re-dispatch
		this.dispatchEvent(new CustomEvent(
			'change',
			{bubbles: true, composed: false}
		));
	}

	_handleFocus() {
		this._focused = true;
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

	_handleMouseEnter() {
		this._hovered = true;
	}

	_handleMouseLeave() {
		this._hovered = false;
	}

	_onSlotChange() {
		this._firstSlotWidth = this.shadowRoot.querySelector('#first-slot').offsetWidth;
		this._lastSlotWidth = this.shadowRoot.querySelector('#last-slot').offsetWidth;
	}

}
customElements.define('d2l-input-text', InputText);

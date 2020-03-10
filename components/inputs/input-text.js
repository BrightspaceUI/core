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
			slotPaddingWidth: { type: Number, attribute: 'slot-padding-width' },
			step: { type: String },
			type: { type: String },
			value: { type: String },
			_focused: { type: Boolean },
			_hasSlot: { type: Boolean },
			_hovered: { type: Boolean }
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
				.d2l-input-text-container .d2l-input {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					-webkit-appearance: textfield;
				}
				::slotted(*) {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
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
		this.slotPaddingWidth = 2.2;
		this.type = 'text';
		this.value = '';

		this._focused = false;
		this._hasSlot = false;
		this._hovered = false;
		this._slotContent = {};
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('blur', this._handleBlur, true);
		this.addEventListener('focus', this._handleFocus, true);
	}

	render() {
		const isFocusedOrHovered = !this.disabled && (this._focused || this._hovered);
		const inputClasses = {
			'd2l-input': true,
			'd2l-input-focus': isFocusedOrHovered
		};
		const ariaRequired = this.required ? 'true' : undefined;

		const inputStyles = {};
		if (this._slotContent['left']) {
			this._slotContent['left'].style.left = `calc((${this.slotPaddingWidth}rem - ${this._slotContent['left'].offsetWidth}px) / 2)`;
			inputStyles.paddingLeft = isFocusedOrHovered ? `calc(${this.slotPaddingWidth}rem - 1px)` : `${this.slotPaddingWidth}rem`;
		}
		if (this._slotContent['right']) {
			this._slotContent['right'].style.right = `calc((${this.slotPaddingWidth}rem - ${this._slotContent['right'].offsetWidth}px) / 2)`;
			inputStyles.paddingRight = isFocusedOrHovered ? `calc(${this.slotPaddingWidth}rem - 1px)` : `${this.slotPaddingWidth}rem`;
		}

		let input = html`
			<div class="d2l-input-text-container"
						@mouseout="${this._handleMouseLeave}"
						@mouseover="${this._handleMouseEnter}">
				<input aria-invalid="${ifDefined(this.ariaInvalid)}"
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
					<slot name="left" @slotchange="${this._onSlotChange}"></slot>
					<slot name="right" @slotchange="${this._onSlotChange}"></slot>
			</div>
		`;
		if (this.label && !this.labelHidden) {
			input = html`
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
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: {
				keyCode: e.keyCode
			}
		};
		this.dispatchEvent(new CustomEvent('d2l-input-container-keypress', eventDetails));
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

	_onSlotChange(e) {
		const children = e.target.assignedNodes();
		if (children.length > 0) {
			const slotName = this.dir !== 'rtl' ? e.target.name : (e.target.name === 'left' ? 'right' : 'left');
			this._slotContent[slotName] = children[0];
		}
		this._hasSlot = true;
	}

}
customElements.define('d2l-input-text', InputText);

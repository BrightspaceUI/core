import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputLabelStyles } from './input-label-styles.js';
import { inputStyles } from './input-styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

/**
 * This component wraps the native "<input type="text">" tag and is intended primarily for inputting generic text, email addresses and URLs.
 * @slot left - Slot within the input on the left side. Useful for an "icon" or "button-icon".
 * @slot right - Slot within the input on the right side. Useful for an "icon" or "button-icon".
 * @fires change - Dispatched when an alteration to the value is committed (typically after focus is lost) by the user
 */
class InputText extends FormElementMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Indicates that the input has a popup menu
			 */
			ariaHaspopup: { type: String, attribute: 'aria-haspopup' },
			/**
			 * Indicates that the input value is invalid
			 */
			ariaInvalid: { type: String, attribute: 'aria-invalid' },
			/**
			 * Specifies whether or not the screen reader should always present changes to the live region as a whole.
			 * This only applies if live is set to polite or assertive.
			 */
			atomic: { type: String },
			/**
			 * Specifies which types of values can be autofilled by the browser
			 */
			autocomplete: { type: String },
			/**
			 * When set, will automatically place focus on the input
			 */
			autofocus: { type: Boolean },
			/**
			 * Additional information communicated in the aria-describedby on the input
			 */
			description: { type: String, reflect: true },
			/**
			 * Disables the input
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Hide the alert icon when input is invalid
			 */
			hideInvalidIcon: { attribute: 'hide-invalid-icon', type: Boolean, reflect: true },
			/**
			 * REQUIRED: Label for the input
			 */
			label: { type: String },
			/**
			 * Hides the label visually (moves it to the input's "aria-label" attribute)
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			/**
			 * Set the priority with which screen readers should treat updates to the input's live text region
			 */
			live: { type: String },
			/**
			 * For number inputs, maximum value
			 */
			max: { type: String },
			/**
			 * Imposes an upper character limit
			 */
			maxlength: { type: Number },
			/**
			 * For number inputs, minimum value
			 */
			min: { type: String },
			/**
			 * Imposes a lower character limit
			 */
			minlength: { type: Number },
			/**
			 * Regular expression pattern to validate the value
			 */
			pattern: { type: String },
			/**
			 * Placeholder text
			 */
			placeholder: { type: String },
			/**
			 * Prevents pressing ENTER from submitting forms
			 */
			preventSubmit: { type: Boolean, attribute: 'prevent-submit' },
			/**
			 * Makes the input read-only
			 */
			readonly: { type: Boolean },
			/**
			 * Indicates that a value is required
			 */
			required: { type: Boolean, reflect: true },
			/**
			 * Size of the input
			 */
			size: { type: Number },
			/**
			 * For number inputs, sets the step size
			 */
			step: { type: String },
			/**
			 * Text for additional screenreader and mouseover context
			 */
			title: { type: String },
			/**
			 * The type of the text input
			 * @type {'text'|'email'|'number'|'password'|'tel'|'url'}
			 */
			type: { type: String },
			/**
			 * Value of the input
			 */
			value: { type: String },
			_firstSlotWidth: { type: Number },
			_focused: { type: Boolean },
			_hovered: { type: Boolean },
			_lastSlotWidth: { type: Number }
		};
	}

	static get styles() {
		return [ inputStyles, inputLabelStyles, offscreenStyles,
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
					-webkit-appearance: textfield;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
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
				.d2l-input-text-invalid-icon {
					background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0wIDBoMjJ2MjJIMHoiLz4KICAgIDxwYXRoIGQ9Ik0xOC44NjQgMTYuNDdMMTIuNjIzIDMuOTg5YTEuNzgzIDEuNzgzIDAgMDAtMy4xOTIgMEwzLjE4OSAxNi40N2ExLjc2MSAxLjc2MSAwIDAwLjA4IDEuNzNjLjMyNS41MjUuODk4Ljc5OCAxLjUxNi43OTloMTIuNDgzYy42MTggMCAxLjE5Mi0uMjczIDEuNTE2LS44LjIzNy0uMzM1LjI2NS0xLjM3LjA4LTEuNzN6IiBmaWxsPSIjQ0QyMDI2IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz4KICAgIDxwYXRoIGQ9Ik0xMS4wMjcgMTcuMjY0YTEuMzM3IDEuMzM3IDAgMTEwLTIuNjc1IDEuMzM3IDEuMzM3IDAgMDEwIDIuNjc1ek0xMS45IDEyLjk4YS44OTIuODkyIDAgMDEtMS43NDcgMEw5LjI3IDguNTJhLjg5Mi44OTIgMCAwMS44NzQtMS4wNjRoMS43NjhhLjg5Mi44OTIgMCAwMS44NzQgMS4wNjVsLS44ODYgNC40NTh6IiBmaWxsPSIjRkZGIi8+CiAgPC9nPgo8L3N2Zz4K");
					display: flex;
					height: 22px;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 22px;
				}
			`
		];
	}

	constructor() {
		super();
		this.autofocus = false;
		this.disabled = false;
		this.hideInvalidIcon = false;
		this.labelHidden = false;
		this.preventSubmit = false;
		this.readonly = false;
		this.required = false;
		this.type = 'text';
		this.value = '';

		this._focused = false;
		this._hovered = false;
		this._inputId = getUniqueId();
		this._firstSlotWidth = 0;
		this._lastSlotWidth = 0;
		this._descriptionId = getUniqueId();
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
		const ariaInvalid = this.invalid ? 'true' : this.ariaInvalid;
		const offscreenContainer = this.description ? html`<div class="d2l-offscreen" id="${this._descriptionId}">${this.description}</div>` : null;

		const inputStyles = {};
		if (this._firstSlotWidth > 0) {
			inputStyles.paddingLeft = isFocusedOrHovered ? `${this._firstSlotWidth - 1}px` : `${this._firstSlotWidth}px`;
		}
		if (this._lastSlotWidth > 0) {
			inputStyles.paddingRight = isFocusedOrHovered ? `${this._lastSlotWidth - 1}px` : `${this._lastSlotWidth}px`;
		}
		const firstSlotName = (this.dir === 'rtl') ? 'right' : 'left';
		const lastSlotName = (this.dir === 'rtl') ? 'left' : 'right';

		const isValid = ariaInvalid !== 'true' || this.disabled;
		const invalidIconSide = (this.dir === 'rtl') ? 'left' : 'right';
		const invalidIconOffset = Math.max((this.dir === 'rtl') ? this._firstSlotWidth : this._lastSlotWidth, 12);
		const invalidIconStyles = {
			[invalidIconSide]: `${invalidIconOffset}px`
		};
		const input = html`
			<div class="d2l-input-text-container">
				<input aria-atomic="${ifDefined(this.atomic)}"
					aria-describedby="${ifDefined(this.description ? this._descriptionId : undefined)}"
					aria-haspopup="${ifDefined(this.ariaHaspopup)}"
					aria-invalid="${ifDefined(ariaInvalid)}"
					aria-label="${ifDefined(this._getAriaLabel())}"
					aria-live="${ifDefined(this.live)}"
					aria-required="${ifDefined(ariaRequired)}"
					?required="${this.required}"
					autocomplete="${ifDefined(this.autocomplete)}"
					?autofocus="${this.autofocus}"
					@change="${this._handleChange}"
					class="${classMap(inputClasses)}"
					?disabled="${this.disabled}"
					id="${this._inputId}"
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
					title="${ifDefined(this.title)}"
					type="${this._getType()}"
					.value="${this.value}">
				<div id="first-slot"><slot name="${firstSlotName}" @slotchange="${this._onSlotChange}"></slot></div>
				<div id="last-slot"><slot name="${lastSlotName}" @slotchange="${this._onSlotChange}"></slot></div>
				${ (!isValid && !this.hideInvalidIcon && !this._focused) ? html`<div class="d2l-input-text-invalid-icon" style="${styleMap(invalidIconStyles)}"></div>` : null}
				${ this.validationError ? html`<d2l-tooltip for=${this._inputId} state="error" align="start">${this.validationError}</d2l-tooltip>` : null }
			</div>
			${offscreenContainer}
		`;
		if (this.label && !this.labelHidden) {
			return html`
				<label class="d2l-input-label" for="${this._inputId}">${this.label}</label>
				${input}`;
		}
		return input;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'value') {
				this.setValidity({ tooShort: this.minlength && this.value.length > 0 && this.value.length < this.minlength });
				this.requestValidate(false);
				this.setFormValue(this.value);
				this._prevValue = (oldVal === undefined) ? '' : oldVal;
			} else if (prop === 'validationError') {
				if (oldVal && this.validationError) {
					const tooltip = this.shadowRoot.querySelector('d2l-tooltip');
					tooltip.updatePosition();
				}
			}
		});
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

	get validationMessage() {
		if (this.validity.rangeOverflow) {
			return this.localize('components.form-element.input.number.rangeOverflow', { max: formatNumber(parseFloat(this.max)) });
		} else if (this.validity.rangeUnderflow) {
			return this.localize('components.form-element.input.number.rangeUnderflow', { min: formatNumber(parseFloat(this.min)) });
		} else if (this.validity.tooShort) {
			return this.localize('components.form-element.input.text.tooShort', { label: this.label, minlength: formatNumber(this.minlength) });
		} else if (this.validity.typeMismatch) {
			if (this.type === 'email') {
				return this.localize('components.form-element.input.email.typeMismatch');
			} else if (this.type === 'url') {
				return this.localize('components.form-element.input.url.typeMismatch');
			}
		}
		return super.validationMessage;
	}

	get validity() {
		const elem = this.shadowRoot.querySelector('.d2l-input');
		if (!elem.validity.valid) {
			return elem.validity;
		}
		return super.validity;
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

	async _handleBlur(e) {
		this._focused = false;
		this.requestValidate(true);

		/**
		 * This is needed only for IE11 and Edge
		 * the _handleChange function is NOT triggered, therefore we have to detect the blur and handle it ourselves.
		 */
		const browserType = window.navigator.userAgent;
		if (this._prevValue !== e.target.value && (browserType.indexOf('Trident') > -1 || browserType.indexOf('Edge') > -1)) {
			this._handleChange();
		}
	}

	_handleChange() {
		// Change events aren't composed, so we need to re-dispatch
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	_handleFocus() {
		this._focused = true;
	}

	_handleInput(e) {
		this.value = e.target.value;
		return true;
	}

	_handleInvalid(e) {
		e.preventDefault();
	}

	_handleKeypress(e) {
		if (this.preventSubmit && e.keyCode === 13) {
			e.preventDefault();
			return false;
		}
		return true;
	}

	_handleMouseEnter() {
		this._hovered = true;
	}

	_handleMouseLeave() {
		this._hovered = false;
	}

	_onSlotChange(e) {
		const slotContent = e.target.assignedNodes()[0];
		const id = e.target.parentNode.id;

		// requestUpdate needed for legacy Edge
		this.requestUpdate().then(() => {
			let slotWidth = 0;
			if (slotContent) {
				const style = getComputedStyle(slotContent);
				slotWidth = parseFloat(style.width) + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
			}
			if (id === 'first-slot') this._firstSlotWidth = slotWidth;
			else this._lastSlotWidth = slotWidth;
		});
	}

}
customElements.define('d2l-input-text', InputText);

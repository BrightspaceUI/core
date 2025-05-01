import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { radioStyles } from './input-radio-styles.js';

class InputRadio extends FocusMixin(PropertyRequiredMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Checked state
			 * @type {boolean}
			 */
			checked: { type: Boolean, reflect: true },
			/**
			 * Disables the input
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * REQUIRED: Label for the input
			 * @type {string}
			 */
			label: { required: true, type: String },
			/**
			 * Value of the input
			 * @type {string}
			 */
			value: { type: String },
			_checked: { state: true },
			_firstFocusable: { state: true },
			_hovering: { state: true },
			_invalid: { state: true }
		};
	}

	static get styles() {
		return [radioStyles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-input-radio-label {
				cursor: default;
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
		this.value = 'on';
		this._checked = false;
		this._firstFocusable = false;
		this._hovering = false;
		this._invalid = false;
	}

	get checked() { return this._checked; }
	set checked(value) {
		if (value === this._checked) return;
		this.dispatchEvent(
			new CustomEvent(
				'd2l-input-radio-checked',
				{ bubbles: true, composed: false, detail: { checked: value } }
			)
		);
	}

	static get focusElementSelector() {
		return '.d2l-input-radio';
	}

	render() {
		const labelClasses = {
			'd2l-input-radio-label': true,
			'd2l-input-radio-label-disabled': this.disabled,
		};
		const radioClasses = {
			'd2l-input-radio': true,
			'd2l-disabled': this.disabled,
			'd2l-hovering': this._hovering && !this.disabled
		};
		const tabindex = (!this.disabled && (this._checked || this._firstFocusable)) ? '0' : undefined;
		// TODO: handle secondary content slot
		return html`
			<div class="${classMap(labelClasses)}" @mouseover="${this.#handleMouseOver}" @mouseout="${this.#handleMouseOut}">
				<div
					aria-checked="${this._checked}"
					aria-disabled="${ifDefined(this.disabled ? 'true' : undefined)}"
					aria-invalid="${ifDefined(this._invalid ? 'true' : undefined)}"
					aria-labelledby="${this.#labelId}"
					class="${classMap(radioClasses)}"
					role="radio"
					tabindex="${ifDefined(tabindex)}"></div>
				<div id="${this.#labelId}">${this.label}</div>
			</div>
		`;
	}

	#labelId = getUniqueId();

	#handleMouseOut() {
		this._hovering = false;
	}

	#handleMouseOver() {
		this._hovering = true;
	}

}
customElements.define('d2l-input-radio', InputRadio);

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
			_firstFocusable: { state: true },
			_hovering: { state: true }
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
		this.checked = false;
		this.disabled = false;
		this.value = 'on';
		this._firstFocusable = false;
		this._hovering = false;
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
		const tabindex = (!this.disabled && (this.checked || this._firstFocusable)) ? '0' : undefined;
		// TODO: handle secondary content slot
		return html`
			<div class="${classMap(labelClasses)}" @mouseover="${this.#handleMouseOver}" @mouseout="${this.#handleMouseOut}">
				<div
					aria-checked="${this.checked}"
					aria-disabled="${ifDefined(this.disabled ? 'true' : undefined)}"
					aria-labelledby="${this.#labelId}"
					class="${classMap(radioClasses)}"
					role="radio"
					tabindex="${ifDefined(tabindex)}"></div>
				<div id="${this.#labelId}">${this.label}</div>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		// TODO handle programatic changes to checked
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

import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { radioStyles } from './input-radio-styles.js';

class InputRadio extends PropertyRequiredMixin(LitElement) {

	static get properties() {
		return {
			checked: { type: Boolean, reflect: true },
			disabled: { type: Boolean, reflect: true },
			/**
			 * REQUIRED: Label for the input
			 * @type {string}
			 */
			label: { required: true, type: String },
			/**
			 * Hides the label visually
			 * @type {boolean}
			 */
			labelHidden: { attribute: 'label-hidden', reflect: true, type: Boolean },
			/**
			 * Value of the input
			 * @type {string}
			 */
			value: { type: String },
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
				cursor: default
			}
		`];
	}

	constructor() {
		super();
		this.checked = false;
		this.disabled = false;
		this.value = 'on';
		this._hovering = false;
	}

	render() {
		const radioClasses = {
			'd2l-input-radio': true,
			'd2l-hovering': this._hovering
		};
		return html`
			<div class="d2l-input-radio-label" @mouseover="${this.#handleMouseOver}" @mouseout="${this.#handleMouseOut}">
				<div
					aria-checked="${this.checked}"
					aria-labelledby="${this.#labelId}"
					class="${classMap(radioClasses)}"
					?disabled="${this.disabled}"
					role="radio"
					tabindex="${ifDefined(this.checked ? '0' : undefined)}"></div>
				<div id="${this.#labelId}" ?hidden="${this.labelHidden}">${this.label}</div>
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

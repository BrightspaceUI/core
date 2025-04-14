import { css, html, LitElement } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { radioStyles } from './input-radio-styles.js';

class InputRadio extends PropertyRequiredMixin(LitElement) {

	static get properties() {
		// TODO: handle name & value
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
			labelHidden: { attribute: 'label-hidden', reflect: true, type: Boolean }
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
		`];
	}

	constructor() {
		super();
		this.checked = false;
		this.disabled = false;
	}

	render() {
		return html`
			<span class="d2l-input-radio-label">
				<span
					aria-checked="${this.checked}"
					aria-labelledby="${this.#labelId}"
					class="d2l-input-radio"
					?disabled="${this.disabled}"
					role="radio"
					tabindex="${ifDefined(this.checked ? '0' : undefined)}"></span>
				<span id="${this.#labelId}" ?hidden="${this.labelHidden}">${this.label}</span>
			</span>
		`;
	}

	#labelId = getUniqueId();

}
customElements.define('d2l-input-radio', InputRadio);

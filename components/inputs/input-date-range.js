import './input-date.js';
import './input-fieldset.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A component consisting of two input-date components - one for start of range and one for end of range. Values specified for these components (through start-value and/or end-value attributes) should be localized to the user's timezone if applicable and must be in ISO 8601 calendar date format ("YYYY-MM-DD").
 * @fires change - Dispatched when a start or end date is selected or typed. "start-value" and "end-value" reflect the selected values and are in ISO 8601 calendar date format ("YYYY-MM-DD").
 */
class InputDateRange extends RtlMixin(LocalizeCoreElement(LitElement)) {

	static get properties() {
		return {
			/**
			 * Disables the inputs
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Label for the end date input
			 * @default "End Date"
			 */
			endLabel: { attribute: 'end-label', reflect: true, type: String },
			/**
			 * Value of the end date input
			 */
			endValue: { attribute: 'end-value', reflect: true, type: String },
			/**
			 * REQUIRED: Accessible label for the range
			 */
			label: { type: String, reflect: true },
			/**
			 * Hides the label visually
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden', reflect: true },
			/**
			 * Maximum valid date that could be selected by a user
			 */
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			/**
			 * Minimum valid date that could be selected by a user
			 */
			minValue: { attribute: 'min-value', reflect: true, type: String },
			/**
			 * Label for the start date input
			 * @default "Start Date"
			 */
			startLabel: { attribute: 'start-label', reflect: true, type: String },
			/**
			 * Value of the start date input
			 */
			startValue: { attribute: 'start-value', reflect: true, type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				margin-bottom: -1.2rem;
				margin-right: -1.5rem;
			}
			:host([dir="rtl"]) {
				margin-left: -1.5rem;
				margin-right: 0;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-input-date {
				display: inline-block;
				margin-bottom: 1.2rem;
			}
			d2l-input-date.d2l-input-date-range-start {
				margin-right: 1.5rem;
			}
			:host([dir="rtl"]) d2l-input-date.d2l-input-date-range-start {
				margin-left: 1.5rem;
				margin-right: 0;
			}
		`;
	}

	constructor() {
		super();

		this.disabled = false;
		this.labelHidden = false;
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-range component requires label text');
		}
	}

	render() {
		const startLabel = this.startLabel ? this.startLabel : this.localize('components.input-date-range.startDate');
		const endLabel = this.endLabel ? this.endLabel : this.localize('components.input-date-range.endDate');
		return html`
			<d2l-input-fieldset label="${ifDefined(this.label)}" ?label-hidden="${this.labelHidden}">
				<d2l-input-date
					@change="${this._handleChange}"
					class="d2l-input-date-range-start"
					?disabled="${this.disabled}"
					label="${startLabel}"
					max-value="${ifDefined(this.maxValue)}"
					min-value="${ifDefined(this.minValue)}"
					value="${ifDefined(this.startValue)}">
				</d2l-input-date>
				<d2l-input-date
					@change="${this._handleChange}"
					class="d2l-input-date-range-end"
					?disabled="${this.disabled}"
					label="${endLabel}"
					max-value="${ifDefined(this.maxValue)}"
					min-value="${ifDefined(this.minValue)}"
					value="${ifDefined(this.endValue)}">
				</d2l-input-date>
			</d2l-input-fieldset>
		`;
	}

	focus() {
		const input = this.shadowRoot.querySelector('d2l-input-date');
		if (input) input.focus();
	}

	async _handleChange(e) {
		// TODO: validation that start is before end
		const elem = e.target;
		if (elem.classList.contains('d2l-input-date-range-start')) this.startValue = elem.value;
		else this.endValue = elem.value;
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

}
customElements.define('d2l-input-date-range', InputDateRange);

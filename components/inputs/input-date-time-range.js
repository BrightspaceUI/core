import './input-date-time.js';
import './input-fieldset.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A component consisting of two input-date-time components - one for start of range and one for end of range. The time input only appears once a date is selected.
 * @fires change - Dispatched when a start or end date or time is selected or typed. "start-value" and "end-value" reflect the selected values and are in ISO 8601 combined date and time format ("YYYY-MM-DDTHH:mm:ss.sssZ").
 * @slot start - Optional content that would appear below the first input-date-time
 * @slot end - Optional content that would appear below the second input-date-time
 */
class InputDateTimeRange extends RtlMixin(LocalizeCoreElement(LitElement)) {

	static get properties() {
		return {
			/**
			 * Disables the inputs
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Label for the end input
			 * @default "End Date"
			 */
			endLabel: { attribute: 'end-label', reflect: true, type: String },
			/**
			 * Value of the end input
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
			 * Label for the start input
			 * @default "Start Date"
			 */
			startLabel: { attribute: 'start-label', reflect: true, type: String },
			/**
			 * Value of the start input
			 */
			startValue: { attribute: 'start-value', reflect: true, type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-input-date-time {
				display: block;
			}
			.d2l-input-date-time-range-start-container {
				margin-bottom: 1.2rem;
			}
			::slotted(*) {
				margin-top: 0.6rem;
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
			console.warn('d2l-input-date-time-range component requires label text');
		}
	}

	render() {
		const startLabel = this.startLabel ? this.startLabel : this.localize('components.input-date-time-range.startDate');
		const endLabel = this.endLabel ? this.endLabel : this.localize('components.input-date-time-range.endDate');
		return html`
			<d2l-input-fieldset label="${ifDefined(this.label)}" ?label-hidden="${this.labelHidden}">
				<div class="d2l-input-date-time-range-start-container">
					<d2l-input-date-time
						@change="${this._handleChange}"
						class="d2l-input-date-time-range-start"
						?disabled="${this.disabled}"
						label="${startLabel}"
						value="${ifDefined(this.startValue)}">
					</d2l-input-date-time>
					<slot name="start"></slot>
				</div>
				<d2l-input-date-time
					@change="${this._handleChange}"
					class="d2l-input-date-time-range-end"
					?disabled="${this.disabled}"
					label="${endLabel}"
					value="${ifDefined(this.endValue)}">
				</d2l-input-date-time>
				<slot name="end"></slot>
			</d2l-input-fieldset>
		`;
	}

	focus() {
		const input = this.shadowRoot.querySelector('d2l-input-date-time');
		if (input) input.focus();
	}

	async _handleChange(e) {
		// TODO: validation that start is before end
		const elem = e.target;
		if (elem.classList.contains('d2l-input-date-time-range-start')) this.startValue = elem.value;
		else this.endValue = elem.value;
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

}
customElements.define('d2l-input-date-time-range', InputDateTimeRange);

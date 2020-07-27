import './input-fieldset.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatTimeInISO, getDateFromISOTime } from '../../helpers/dateTime.js';
import { getDefaultTime, getIntervalNumber } from './input-time.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A component consisting of two input-time components - one for start of range and one for end of range. Values specified for these components (through start-value and/or end-value attributes) should be localized to the user's timezone if applicable and must be in ISO 8601 time format ("hh:mm:ss").
 * @fires change - Dispatched when a start or end time is selected or typed. "start-value" and "end-value" reflect the selected values and are in ISO 8601 calendar time format ("hh:mm:ss").
 */
class InputTimeRange extends FormElementMixin(RtlMixin(LocalizeCoreElement(LitElement))) {

	static get properties() {
		return {
			/**
			 * Disables the inputs
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Label for the end time input
			 * @default "End Time"
			 */
			endLabel: { attribute: 'end-label', reflect: true, type: String },
			/**
			 * Value of the end time input
			 */
			endValue: { attribute: 'end-value', reflect: true, type: String },
			/**
			 * Rounds up to nearest valid interval time (specified with "time-interval") when user types a time
			 */
			enforceTimeIntervals: { attribute: 'enforce-time-intervals', reflect: true, type: Boolean },
			/**
			 * REQUIRED: Accessible label for the range
			 */
			label: { type: String, reflect: true },
			/**
			 * Hides the label visually
			 */
			labelHidden: { attribute: 'label-hidden', reflect: true, type: Boolean },
			/**
			 * Label for the start time input
			 * @default "Start Time"
			 */
			startLabel: { attribute: 'start-label', reflect: true, type: String },
			/**
			 * Value of the start time input
			 */
			startValue: { attribute: 'start-value', reflect: true, type: String },
			/**
			 * Number of minutes between times shown in dropdown
			 * @type {'five'|'ten'|'fifteen'|'twenty'|'thirty'|'sixty'}
			 */
			timeInterval: { attribute: 'time-interval', reflect: true, type: String },
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
			d2l-input-time {
				display: inline-block;
				margin-bottom: 1.2rem;
			}
			d2l-input-time.d2l-input-time-range-start {
				margin-right: 1.5rem;
			}
			:host([dir="rtl"]) d2l-input-time.d2l-input-time-range-start {
				margin-left: 1.5rem;
				margin-right: 0;
			}
		`;
	}

	constructor() {
		super();

		this.disabled = false;
		this.enforceTimeIntervals = false;
		this.labelHidden = false;
		this.timeInterval = 'thirty';
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-time-range component requires label text');
		}

		const startValue = this.startValue ? getDateFromISOTime(this.startValue) : getDefaultTime();
		let endValue = this.endValue;
		if (!this.endValue) {
			const interval = getIntervalNumber(this.timeInterval);
			endValue = new Date(startValue);
			endValue.setMinutes(endValue.getMinutes() + interval);
		}
		this.startValue = formatTimeInISO({hours: startValue.getHours(), minutes: startValue.getMinutes(), seconds: startValue.getSeconds()});
		this.endValue = formatTimeInISO({hours: endValue.getHours(), minutes: endValue.getMinutes(), seconds: endValue.getSeconds()});
	}

	render() {
		const startLabel = this.startLabel ? this.startLabel : this.localize('components.input-time-range.startTime');
		const endLabel = this.endLabel ? this.endLabel : this.localize('components.input-time-range.endTime');

		/**
		 * @type {'five'|'ten'|'fifteen'|'twenty'|'thirty'|'sixty'}
		 */
		const timeInterval = this.timeInterval;
		return html`
			<d2l-input-fieldset label="${ifDefined(this.label)}" ?label-hidden="${this.labelHidden}">
				<d2l-input-time
					@change="${this._handleChange}"
					class="d2l-input-time-range-start"
					?disabled="${this.disabled}"
					?enforce-time-intervals="${this.enforceTimeIntervals}"
					label="${startLabel}"
					time-interval="${ifDefined(timeInterval)}"
					value="${ifDefined(this.startValue)}">
				</d2l-input-time>
				<d2l-input-time
					@change="${this._handleChange}"
					class="d2l-input-time-range-end"
					?disabled="${this.disabled}"
					?enforce-time-intervals="${this.enforceTimeIntervals}"
					label="${endLabel}"
					time-interval="${ifDefined(timeInterval)}"
					value="${ifDefined(this.endValue)}">
				</d2l-input-time>
			</d2l-input-fieldset>
		`;
	}

	focus() {
		const input = this.shadowRoot.querySelector('d2l-input-time');
		if (input) input.focus();
	}

	get validationMessageBadInput() {
		return this.localize('components.input-date-range.errorBadInput', { startLabel: this._computedStartLabel, endLabel: this._computedEndLabel });
	}

	async _handleChange(e) {
		const elem = e.target;
		if (elem.classList.contains('d2l-input-time-range-start')) {
			this.startValue = elem.value;
		} else {
			this.endValue = elem.value;
		}
		this.setValidity({badInput: (this.startValue && this.endValue && (getDateFromISOTime(this.endValue) <= getDateFromISOTime(this.startValue)))});
		await this.requestValidate();
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

}
customElements.define('d2l-input-time-range', InputTimeRange);

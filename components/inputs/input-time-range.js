import './input-fieldset.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDateInISOTime, getDateFromISOTime, isValidTime } from '../../helpers/dateTime.js';
import { getDefaultTime, getIntervalNumber, getTimeAtInterval } from './input-time.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A component consisting of two input-time components - one for start of range and one for end of range. Values specified for these components (through start-value and/or end-value attributes) should be localized to the user's timezone if applicable and must be in ISO 8601 time format ("hh:mm:ss").
 * @fires change - Dispatched when a start or end time is selected or typed. "start-value" and "end-value" reflect the selected values and are in ISO 8601 calendar time format ("hh:mm:ss").
 */

function getValidISOTimeAtInterval(val, timeInterval) {
	const valAtInterval = getTimeAtInterval(timeInterval, getDateFromISOTime(val));
	return formatDateInISOTime(valAtInterval);
}

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
			_endDropdownOpened: { type: Boolean },
			_startDropdownOpened: { type: Boolean }
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
		this.startValue = formatDateInISOTime(getDefaultTime());
		this.timeInterval = 'thirty';

		this._endDropdownOpened = false;
		this._endInputId = getUniqueId();
		this._initialValues = true; // flag initial values so they do not get set to default interval before timeInterval is set
		this._startDropdownOpened = false;
		this._startInputId = getUniqueId();
	}

	get endValue() { return this._endValue; }
	set endValue(val) {
		const oldValue = this.endValue;
		if (isValidTime(val)) this._endValue = (this.enforceTimeIntervals && !this._initialValues) ? getValidISOTimeAtInterval(val, this.timeInterval) : val;
		else if (!this._initialValues) {
			const endValue = getDateFromISOTime(this.startValue);
			endValue.setMinutes(endValue.getMinutes() + getIntervalNumber(this.timeInterval));
			this._endValue = formatDateInISOTime(endValue);
		}
		this.requestUpdate('endValue', oldValue);
	}

	get startValue() { return this._startValue; }
	set startValue(val) {
		const oldValue = this.startValue;
		if (isValidTime(val)) this._startValue = (this.enforceTimeIntervals && !this._initialValues) ? getValidISOTimeAtInterval(val, this.timeInterval) : val;
		else this._startValue = formatDateInISOTime(getDefaultTime());
		this.requestUpdate('startValue', oldValue);
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-time-range component requires label text');
		}

		if (this.enforceTimeIntervals) this.startValue = getValidISOTimeAtInterval(this.startValue, this.timeInterval);

		if (!this.endValue) {
			const endValue = getDateFromISOTime(this.startValue);
			endValue.setMinutes(endValue.getMinutes() + getIntervalNumber(this.timeInterval));
			this.endValue = formatDateInISOTime(endValue);
			this._defaultEndValue = false;
		} else if (this.endValue && this.enforceTimeIntervals) {
			this.endValue = getValidISOTimeAtInterval(this.endValue, this.timeInterval);
		}
		this._initialValues = false;
	}

	render() {
		const startLabel = this.startLabel ? this.startLabel : this.localize('components.input-time-range.startTime');
		const endLabel = this.endLabel ? this.endLabel : this.localize('components.input-time-range.endTime');

		/**
		 * @type {'five'|'ten'|'fifteen'|'twenty'|'thirty'|'sixty'}
		 */
		const timeInterval = this.timeInterval;
		const tooltipStart = (this.validationError && !this._startDropdownOpened) ? html`<d2l-tooltip align="start" announced for="${this._startInputId}" state="error">${this.validationError}</d2l-tooltip>` : null;
		const tooltipEnd = (this.validationError && !this._endDropdownOpened) ? html`<d2l-tooltip align="start" announced for="${this._endInputId}" state="error">${this.validationError}</d2l-tooltip>` : null;
		return html`
			${tooltipStart}
			${tooltipEnd}
			<d2l-input-fieldset label="${ifDefined(this.label)}" ?label-hidden="${this.labelHidden}">
				<d2l-input-time
					@change="${this._handleChange}"
					class="d2l-input-time-range-start"
					@d2l-input-time-dropdown-toggle="${this._handleDropdownToggle}"
					?disabled="${this.disabled}"
					?enforce-time-intervals="${this.enforceTimeIntervals}"
					.forceInvalid="${this.invalid}"
					id="${this._startInputId}"
					label="${startLabel}"
					time-interval="${ifDefined(timeInterval)}"
					value="${ifDefined(this.startValue)}">
				</d2l-input-time>
				<d2l-input-time
					@change="${this._handleChange}"
					class="d2l-input-time-range-end"
					@d2l-input-time-dropdown-toggle="${this._handleDropdownToggle}"
					?disabled="${this.disabled}"
					?enforce-time-intervals="${this.enforceTimeIntervals}"
					.forceInvalid="${this.invalid}"
					id="${this._endInputId}"
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

	get validationMessage() {
		if (this.validity.badInput) {
			return this.localize('components.input-time-range.errorBadInput', { startLabel: this._computedStartLabel, endLabel: this._computedEndLabel });
		}
		return super.validationMessage;
	}

	get _computedEndLabel() {
		return this.endLabel ? this.endLabel : this.localize('components.input-time-range.endTime');
	}

	get _computedStartLabel() {
		return this.startLabel ? this.startLabel : this.localize('components.input-time-range.startTime');
	}

	async _handleChange(e) {
		const elem = e.target;
		if (elem.classList.contains('d2l-input-time-range-start')) {
			this.startValue = elem.value;
		} else {
			this.endValue = elem.value;
		}
		this.setValidity({ badInput: (this.startValue && this.endValue && (getDateFromISOTime(this.endValue) <= getDateFromISOTime(this.startValue))) });
		await this.requestValidate();
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	_handleDropdownToggle(e) {
		if (e.target.classList.contains('d2l-input-time-range-start')) {
			this._startDropdownOpened = e.detail.opened;
		} else {
			this._endDropdownOpened = e.detail.opened;
		}
	}

}
customElements.define('d2l-input-time-range', InputTimeRange);

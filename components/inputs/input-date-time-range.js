import './input-date-time.js';
import './input-date-time-range-to.js';
import './input-fieldset.js';
import '../tooltip/tooltip.js';
import { convertLocalToUTCDateTime, convertUTCToLocalDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDateTimeInISO, getAdjustedTime, getDateFromISODateTime, getDateNoConversion, parseISODateTime } from '../../helpers/dateTime.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

function _isSameDate(date1, date2) {
	return date1.date === date2.date && date1.month === date2.month && date1.year === date2.year;
}

export function getShiftedEndDateTime(startValue, endValue, prevStartValue, inclusive, localized) {
	const startObj = localized ? parseISODateTime(startValue) : convertUTCToLocalDateTime(parseISODateTime(startValue));
	const endObj = localized ? parseISODateTime(endValue) : convertUTCToLocalDateTime(parseISODateTime(endValue));
	const prevStartObj = localized ? parseISODateTime(prevStartValue) : convertUTCToLocalDateTime(parseISODateTime(prevStartValue));

	const jsStartDate = localized ? getDateNoConversion(startValue) : new Date(startValue);
	const jsEndDate = localized ? getDateNoConversion(endValue) : new Date(endValue);
	const jsPrevStartDate = localized ? getDateNoConversion(prevStartValue) : new Date(prevStartValue);

	if ((inclusive && jsEndDate.getTime() - jsPrevStartDate.getTime() < 0)
		|| (!inclusive && jsEndDate.getTime() - jsPrevStartDate.getTime() <= 0))
		return endValue;

	if (!_isSameDate(startObj, prevStartObj)) {
		// shift dates only
		const diff = jsStartDate.getTime() - jsPrevStartDate.getTime();
		const jsNewEndDate = new Date(jsEndDate.getTime() + diff);

		if (!localized) return jsNewEndDate.toISOString();

		const parsedObject = {
			year: jsNewEndDate.getFullYear(),
			month: jsNewEndDate.getMonth() + 1,
			date: jsNewEndDate.getDate(),
			hours: jsNewEndDate.getHours(),
			minutes: jsNewEndDate.getMinutes(),
			seconds: jsNewEndDate.getSeconds()
		};
		return formatDateTimeInISO(parsedObject, localized);
	} else if (_isSameDate(startObj, endObj) && _isSameDate(startObj, prevStartObj)) {
		const adjustedTime = getAdjustedTime(startObj, prevStartObj, endObj);

		endObj.hours = adjustedTime.hours;
		endObj.minutes = adjustedTime.minutes;

		return formatDateTimeInISO(localized ? endObj : convertLocalToUTCDateTime(endObj), localized);
	} else {
		return endValue;
	}
}

/**
 * A component consisting of two input-date-time components - one for start of range and one for end of range. The time input only appears once a date is selected.
 * @fires change - Dispatched when a start or end date or time is selected or typed. "start-value" and "end-value" reflect the selected values and are in ISO 8601 combined date and time format ("YYYY-MM-DDTHH:mm:ss.sssZ").
 * @slot start - Optional content that would appear below the first input-date-time
 * @slot end - Optional content that would appear below the second input-date-time
 */
class InputDateTimeRange extends SkeletonMixin(FormElementMixin(RtlMixin(LocalizeCoreElement(LitElement)))) {

	static get properties() {
		return {
			/**
			 * Automatically shift end date when start date changes to keep same range
			 */
			autoShiftDates: { attribute: 'auto-shift-dates', reflect: true, type: Boolean },
			/**
			 * Hides the start and end labels visually
			 */
			childLabelsHidden: { attribute: 'child-labels-hidden', reflect: true, type: Boolean },
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
			 * Validate on inclusive range
			 */
			inclusiveDateRange: { attribute: 'inclusive-date-range', reflect: true, type: Boolean },
			/**
			 * REQUIRED: Accessible label for the range
			 */
			label: { type: String, reflect: true },
			/**
			 * Hides the label visually
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden', reflect: true },
			/**
			 * Indicates that any timezone localization will be handeld by the consumer and so any values will not be converted from/to UTC
			 */
			localized: { reflect: true, type: Boolean },
			/**
			 * Maximum valid date/time that could be selected by a user.
			 */
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			/**
			 * Minimum valid date/time that could be selected by a user.
			 */
			minValue: { attribute: 'min-value', reflect: true, type: String },
			/**
			 * Indicates that a value is required
			 */
			required: { type: Boolean, reflect: true },
			/**
			 * Label for the start input
			 * @default "Start Date"
			 */
			startLabel: { attribute: 'start-label', reflect: true, type: String },
			/**
			 * Value of the start input
			 */
			startValue: { attribute: 'start-value', reflect: true, type: String },
			_endDropdownOpened: { type: Boolean },
			_slotOccupied: { type: Boolean },
			_startDropdownOpened: { type: Boolean }
		};
	}

	static get styles() {
		return [super.styles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-input-date-time {
				display: block;
			}
			::slotted(*) {
				margin-top: 0.6rem;
			}

		`];
	}

	constructor() {
		super();

		this.autoShiftDates = false;
		this.childLabelsHidden = false;
		this.disabled = false;
		this.inclusiveDateRange = false;
		this.labelHidden = false;
		this.localized = false;
		this.required = false;

		this._startDropdownOpened = false;
		this._startInputId = getUniqueId();
		this._endDropdownOpened = false;
		this._endInputId = getUniqueId();

		this._slotOccupied = false;
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-time-range component requires label text');
		}

		this.shadowRoot.querySelector('d2l-input-date-time-range-to').setParentNode(this.parentNode);
	}

	render() {
		const startDateTimeInput = this.shadowRoot.querySelector('.d2l-input-date-time-range-start');
		const endDateTimeInput = this.shadowRoot.querySelector('.d2l-input-date-time-range-end');

		const tooltipStart = (this.validationError && !this._startDropdownOpened && !this.childErrors.has(startDateTimeInput)) ? html`<d2l-tooltip align="start" announced for="${this._startInputId}" position="bottom" state="error">${this.validationError}</d2l-tooltip>` : null;
		const tooltipEnd = (this.validationError && !this._endDropdownOpened && !this.childErrors.has(endDateTimeInput)) ? html`<d2l-tooltip align="start" announced for="${this._endInputId}" position="bottom" state="error">${this.validationError}</d2l-tooltip>` : null;
		return html`
			${tooltipStart}
			${tooltipEnd}
			<d2l-input-fieldset
				label="${ifDefined(this.label)}"
				?label-hidden="${this.labelHidden}"
				?required="${this.required}"
				?skeleton="${this.skeleton}">
				<d2l-input-date-time-range-to
					?block-display="${this._slotOccupied}"
					?display-to="${this.childLabelsHidden}"
					?skeleton="${this.skeleton}"
					?top-margin="${this.label && !this.labelHidden && !this.childLabelsHidden}">
					<div slot="left">
						<d2l-input-date-time
							?novalidate="${this.noValidate}"
							@change="${this._handleChange}"
							class="d2l-input-date-time-range-start"
							@d2l-input-date-time-dropdown-toggle="${this._handleDropdownToggle}"
							?disabled="${this.disabled}"
							.forceInvalid=${this.invalid}
							id="${this._startInputId}"
							label="${this._computedStartLabel}"
							?label-hidden="${this.childLabelsHidden}"
							?localized="${this.localized}"
							max-value="${ifDefined(this.maxValue)}"
							min-value="${ifDefined(this.minValue)}"
							?required="${this.required}"
							?skeleton="${this.skeleton}"
							time-default-value="startOfDay"
							value="${ifDefined(this.startValue)}">
						</d2l-input-date-time>
						<slot name="start" @slotchange="${this._onSlotChange}"></slot>
					</div>
					<div slot="right">
						<d2l-input-date-time
							?novalidate="${this.noValidate}"
							@change="${this._handleChange}"
							class="d2l-input-date-time-range-end"
							@d2l-input-date-time-dropdown-toggle="${this._handleDropdownToggle}"
							?disabled="${this.disabled}"
							.forceInvalid=${this.invalid}
							id="${this._endInputId}"
							label="${this._computedEndLabel}"
							?label-hidden="${this.childLabelsHidden}"
							?localized="${this.localized}"
							max-value="${ifDefined(this.maxValue)}"
							min-value="${ifDefined(this.minValue)}"
							?required="${this.required}"
							?skeleton="${this.skeleton}"
							time-default-value="endOfDay"
							value="${ifDefined(this.endValue)}">
						</d2l-input-date-time>
						<slot name="end" @slotchange="${this._onSlotChange}"></slot>
					</div>
				</d2l-input-date-time-range-to>
			</d2l-input-fieldset>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'startValue' || prop === 'endValue') {
				if (!this.invalid && this.autoShiftDates && prop === 'startValue' && this.endValue && oldVal) {
					this.endValue = getShiftedEndDateTime(this.startValue, this.endValue, oldVal, this.inclusiveDateRange, this.localized);
					this.dispatchEvent(new CustomEvent(
						'change',
						{ bubbles: true, composed: false }
					));
				}

				this.setFormValue({
					[`${this.name}-startValue`]: this.startValue,
					[`${this.name}-endValue`]: this.endValue,
				});
				let badInput = false;
				if (this.startValue && this.endValue) {
					if (this.inclusiveDateRange && (getDateFromISODateTime(this.endValue) < getDateFromISODateTime(this.startValue))) {
						badInput = true;
					} else if (!this.inclusiveDateRange && (getDateFromISODateTime(this.endValue) <= getDateFromISODateTime(this.startValue))) {
						badInput = true;
					}
				}
				this.setValidity({ badInput: badInput });
				this.requestValidate(true);
			}
		});
	}

	focus() {
		const input = this.shadowRoot.querySelector('d2l-input-date-time');
		if (input) input.focus();
	}

	async validate() {
		const startDateTimeInput = this.shadowRoot.querySelector('.d2l-input-date-time-range-start');
		const endDateTimeInput = this.shadowRoot.querySelector('.d2l-input-date-time-range-end');
		const errors = await Promise.all([startDateTimeInput.validate(), endDateTimeInput.validate(), super.validate()]);
		return [...errors[0], ...errors[1], ...errors[2]];
	}

	get validationMessage() {
		if (this.validity.badInput) {
			return this.localize('components.input-date-time-range.errorBadInput', { startLabel: this._computedStartLabel, endLabel: this._computedEndLabel });
		}
		return super.validationMessage;
	}

	get _computedEndLabel() {
		return this.endLabel ? this.endLabel : this.localize('components.input-date-time-range.endDate');
	}

	get _computedStartLabel() {
		return this.startLabel ? this.startLabel : this.localize('components.input-date-time-range.startDate');
	}

	async _handleChange(e) {
		const elem = e.target;
		if (elem.classList.contains('d2l-input-date-time-range-start')) {
			this.startValue = elem.value;
		} else {
			this.endValue = elem.value;
		}
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	_handleDropdownToggle(e) {
		if (e.target.classList.contains('d2l-input-date-time-range-start')) {
			this._startDropdownOpened = e.detail.opened;
		} else {
			this._endDropdownOpened = e.detail.opened;
		}
	}

	_onSlotChange(e) {
		const slotContent = e.target.assignedNodes()[0];
		if (slotContent) this._slotOccupied = true;
	}

}
customElements.define('d2l-input-date-time-range', InputDateTimeRange);

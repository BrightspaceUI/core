import './input-date-time.js';
import './input-date-time-range-to.js';
import './input-fieldset.js';
import '../tooltip/tooltip.js';
import { convertLocalToUTCDateTime, convertUTCToLocalDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { css, html, LitElement } from 'lit';
import { formatDateTimeInISO, getAdjustedTime, getDateFromISODateTime, getDateNoConversion, parseISODateTime } from '../../helpers/dateTime.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
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
 * @slot start - Optional content that would appear below the start input-date-time
 * @slot end - Optional content that would appear below the end input-date-time
 * @fires change - Dispatched when there is a change to selected start date-time or selected end date-time. `start-value` and `end-value` correspond to the selected values and are formatted in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`).
 */
class InputDateTimeRange extends FocusMixin(SkeletonMixin(FormElementMixin(RtlMixin(LocalizeCoreElement(LitElement))))) {

	static get properties() {
		return {
			/**
			 * ADVANCED: Automatically shifts end date when start date changes to keep same range. If start and end date are equal, automatically shifts end time when start time changes.
			 * @type {boolean}
			 */
			autoShiftDates: { attribute: 'auto-shift-dates', reflect: true, type: Boolean },
			/**
			 * Hides the start and end labels visually
			 * @type {boolean}
			 */
			childLabelsHidden: { attribute: 'child-labels-hidden', reflect: true, type: Boolean },
			/**
			 * Disables the inputs
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Accessible label for the end date-time input. Defaults to localized "End Date".
			 * @type {string}
			 * @default "End Date"
			 */
			endLabel: { attribute: 'end-label', reflect: true, type: String },
			/**
			 * ADVANCED: Indicates if the end date or time dropdown is open
			 * @type {boolean}
			 */
			endOpened: { attribute: 'end-opened', type: Boolean },
			/**
			 * Value of the end date-time input
			 * @type {string}
			 */
			endValue: { attribute: 'end-value', reflect: true, type: String },
			/**
			 * Validates on inclusive range (i.e., it is valid for start and end date-times to be equal)
			 * @type {boolean}
			 */
			inclusiveDateRange: { attribute: 'inclusive-date-range', reflect: true, type: Boolean },
			/**
			 * REQUIRED: Accessible label for the input fieldset that wraps the date-time inputs
			 * @type {string}
			 */
			label: { type: String, reflect: true },
			/**
			 * Hides the fieldset label visually
			 * @type {boolean}
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden', reflect: true },
			/**
			 * Indicates that localization will be handled by the consumer. `*value` will not be converted from/to UTC.
			 * @type {boolean}
			 */
			localized: { reflect: true, type: Boolean },
			/**
			 * Maximum valid date/time that could be selected by a user
			 * @type {string}
			 */
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			/**
			 * Minimum valid date/time that could be selected by a user
			 * @type {string}
			 */
			minValue: { attribute: 'min-value', reflect: true, type: String },
			/**
			 * Indicates that values are required
			 * @type {boolean}
			 */
			required: { type: Boolean, reflect: true },
			/**
			 * Accessible label for the start date-time input. Defaults to localized "Start Date".
			 * @type {string}
			 * @default "Start Date"
			 */
			startLabel: { attribute: 'start-label', reflect: true, type: String },
			/**
			 * ADVANCED: Indicates if the start date or time dropdown is open
			 * @type {boolean}
			 */
			startOpened: { attribute: 'start-opened', type: Boolean },
			/**
			 * Value of the start date-time input
			 * @type {string}
			 */
			startValue: { attribute: 'start-value', reflect: true, type: String },
			_slotOccupied: { type: Boolean }
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
		this.endOpened = false;
		this.inclusiveDateRange = false;
		this.labelHidden = false;
		this.localized = false;
		this.required = false;
		this.startOpened = false;

		this._startInputId = getUniqueId();
		this._endInputId = getUniqueId();

		this._slotOccupied = false;
	}

	static get focusElementSelector() {
		return 'd2l-input-date-time';
	}

	/** @ignore */
	get validationMessage() {
		if (this.validity.badInput) {
			return this.localize('components.input-date-time-range.errorBadInput', { startLabel: this._computedStartLabel, endLabel: this._computedEndLabel });
		}
		return super.validationMessage;
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-time-range component requires label text');
		}

		this.shadowRoot.querySelector('d2l-input-date-time-range-to').setParentNode(this);
	}

	render() {
		const startDateTimeInput = this.shadowRoot && this.shadowRoot.querySelector('.d2l-input-date-time-range-start');
		const endDateTimeInput = this.shadowRoot && this.shadowRoot.querySelector('.d2l-input-date-time-range-end');

		const tooltipStart = (this.validationError && !this.startOpened && !this.childErrors.has(startDateTimeInput)) ? html`<d2l-tooltip align="start" announced for="${this._startInputId}" position="bottom" state="error" class="vdiff-target">${this.validationError}</d2l-tooltip>` : null;
		const tooltipEnd = (this.validationError && !this.endOpened && !this.childErrors.has(endDateTimeInput)) ? html`<d2l-tooltip align="start" announced for="${this._endInputId}" position="bottom" state="error" class="vdiff-target">${this.validationError}</d2l-tooltip>` : null;
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
							class="d2l-input-date-time-range-start vdiff-target"
							@d2l-input-date-time-dropdown-toggle="${this._handleDropdownToggle}"
							?disabled="${this.disabled}"
							.forceInvalid=${this.invalid}
							id="${this._startInputId}"
							label="${this._computedStartLabel}"
							?label-hidden="${this.childLabelsHidden}"
							?localized="${this.localized}"
							max-value="${ifDefined(this.maxValue)}"
							min-value="${ifDefined(this.minValue)}"
							?opened="${this.startOpened}"
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
							class="d2l-input-date-time-range-end vdiff-target"
							@d2l-input-date-time-dropdown-toggle="${this._handleDropdownToggle}"
							?disabled="${this.disabled}"
							.forceInvalid=${this.invalid}
							id="${this._endInputId}"
							label="${this._computedEndLabel}"
							?label-hidden="${this.childLabelsHidden}"
							?localized="${this.localized}"
							max-value="${ifDefined(this.maxValue)}"
							min-value="${ifDefined(this.minValue)}"
							?opened="${this.endOpened}"
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

	async validate() {
		if (!this.shadowRoot) return;
		const startDateTimeInput = this.shadowRoot.querySelector('.d2l-input-date-time-range-start');
		const endDateTimeInput = this.shadowRoot.querySelector('.d2l-input-date-time-range-end');
		const errors = await Promise.all([startDateTimeInput.validate(), endDateTimeInput.validate(), super.validate()]);
		return [...errors[0], ...errors[1], ...errors[2]];
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
			this.startOpened = e.detail.opened;
		} else {
			this.endOpened = e.detail.opened;
		}
	}

	_onSlotChange(e) {
		const slotContent = e.target.assignedNodes()[0];
		if (slotContent) this._slotOccupied = true;
	}

}
customElements.define('d2l-input-date-time-range', InputDateTimeRange);

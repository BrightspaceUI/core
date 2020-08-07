import './input-date.js';
import './input-fieldset.js';
import './input-time.js';
import '../tooltip/tooltip.js';
import { convertUTCToLocalDateTime, formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDateInISO, getDateFromISODateTime, getLocalDateTimeFromUTCDateTime, getUTCDateTimeFromLocalDateTime, parseISODateTime } from '../../helpers/dateTime.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A component that consists of a "<d2l-input-date>" and a "<d2l-input-time>" component. The time input only appears once a date is selected. This component displays the "value" if one is specified, and reflects the selected value when one is selected or entered.
 * @fires change - Dispatched when there is a change in selected date or selected time. "value" reflects the selected value and is in ISO 8601 combined date and time format ("YYYY-MM-DDTHH:mm:ss.sssZ").
 */
class InputDateTime extends FormElementMixin(LocalizeCoreElement(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Disables the input
			 */
			disabled: { type: Boolean },
			/**
			 * REQUIRED: Accessible label for the input
			 */
			label: { type: String },
			/**
			 * Maximum valid date/time that could be selected by a user.
			 */
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			/**
			 * Minimum valid date/time that could be selected by a user.
			 */
			minValue: { attribute: 'min-value', reflect: true, type: String },
			/**
			 * Value of the input. This should be in ISO 8601 combined date and time format ("YYYY-MM-DDTHH:mm:ss.sssZ") and in UTC time (i.e., do NOT localize to the user's timezone).
			 */
			value: { type: String },
			_dropdownOpened: { type: Boolean },
			_maxValueLocalized: { type: String },
			_minValueLocalized: { type: String },
			_parsedDateTime: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				white-space: nowrap;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-input-date {
				padding-right: 0.3rem;
			}
			:host([dir="rtl"]) d2l-input-date {
				padding-left: 0.3rem;
				padding-right: 0;
			}
		`;
	}

	constructor() {
		super();
		this.disabled = false;
		this._dropdownOpened = false;
		this._inputId = getUniqueId();
		this._namespace = 'components.input-date-time';
		this._parsedDateTime = '';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-time component requires label text');
		}
	}

	render() {
		const timeHidden = !this._parsedDateTime;
		const tooltip = (this.validationError && !this._dropdownOpened) ? html`<d2l-tooltip align="start" for="${this._inputId}" state="error">${this.validationError}</d2l-tooltip>` : null;
		return html`
			${tooltip}
			<d2l-input-fieldset label="${ifDefined(this.label)}">
				<d2l-input-date
					@change="${this._handleDateChange}"
					@d2l-form-element-should-validate="${this._handleNestedFormElementValidation}"
					@d2l-input-date-dropdown-toggle="${this._handleDropdownToggle}"
					?disabled="${this.disabled}"
					.forceInvalid=${this.invalid}
					id="${this._inputId}"
					label="${this.localize('components.input-date-time.date')}"
					label-hidden
					max-value="${ifDefined(this._maxValueLocalized)}"
					min-value="${ifDefined(this._minValueLocalized)}"
					.value="${this._parsedDateTime}">
				</d2l-input-date>
				<d2l-input-time
					@blur="${this._handleInputTimeBlur}"
					@change="${this._handleTimeChange}"
					@d2l-input-time-dropdown-toggle="${this._handleDropdownToggle}"
					?disabled="${this.disabled}"
					@focus="${this._handleInputTimeFocus}"
					.forceInvalid=${this.invalid}
					?hidden="${timeHidden}"
					label="${this.localize('components.input-date-time.time')}"
					label-hidden
					max-height="430"
					.value="${this._parsedDateTime}">
				</d2l-input-time>
			</d2l-input-fieldset>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'value') {
				try {
					this._parsedDateTime = getLocalDateTimeFromUTCDateTime(this.value);
				} catch (e) {
					// set value to empty if invalid value
					this.value = '';
					this._parsedDateTime = '';
				}
			} else if (prop === 'maxValue' && this.maxValue) {
				try {
					const dateObj = parseISODateTime(this.maxValue);
					const localDateTime = convertUTCToLocalDateTime(dateObj);
					this._maxValueLocalized = formatDateInISO(localDateTime);
				} catch (e) {
					this._maxValueLocalized = undefined;
				}
			} else if (prop === 'minValue' && this.minValue) {
				try {
					const dateObj = parseISODateTime(this.minValue);
					const localDateTime = convertUTCToLocalDateTime(dateObj);
					this._minValueLocalized = formatDateInISO(localDateTime);
				} catch (e) {
					this._minValueLocalized = undefined;
				}
			}
		});
	}

	focus() {
		const elem = this.shadowRoot.querySelector('d2l-input-date');
		if (elem) elem.focus();
	}

	get validationMessageRangeOverflow() {
		let failureText = '';
		if (this.minValue && this.maxValue) {
			failureText = this.localize(
				`${this._namespace}.errorOutsideRange`, {
					minDate: formatDateTime(new Date(this.minValue), {format: 'medium'}),
					maxDate: formatDateTime(new Date(this.maxValue), {format: 'medium'})
				}
			);
		} else if (this.maxValue) {
			failureText = this.localize(
				`${this._namespace}.errorMaxDateOnly`, {
					maxDate: formatDateTime(new Date(this.maxValue), {format: 'medium'})
				}
			);
		}
		return failureText;
	}

	get validationMessageRangeUnderflow() {
		let failureText = '';
		if (this.minValue && this.maxValue) {
			failureText = this.localize(
				`${this._namespace}.errorOutsideRange`, {
					minDate: formatDateTime(new Date(this.minValue), {format: 'medium'}),
					maxDate: formatDateTime(new Date(this.maxValue), {format: 'medium'})
				}
			);
		} else if (this.minValue) {
			failureText = this.localize(
				`${this._namespace}.errorMinDateOnly`, {
					minDate: formatDateTime(getDateFromISODateTime(this.minValue), {format: 'medium'})
				}
			);
		}
		return failureText;
	}

	_dispatchChangeEvent() {
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	async _handleDateChange(e) {
		const newDate = e.target.value;
		if (!newDate) {
			this.value = '';
		} else {
			const time = this.shadowRoot.querySelector('d2l-input-time').value;
			this.value = getUTCDateTimeFromLocalDateTime(newDate, time);
		}
		await this._validate();
		this._dispatchChangeEvent();
	}

	async _handleDropdownToggle(e) {
		this._dropdownOpened = e.detail.opened;
		if (e.target.tagName === 'D2L-INPUT-TIME' && !this._dropdownOpened) {
			await this.updateComplete;
			this._handleInputTimeFocus();
		}
	}

	_handleInputTimeBlur() {
		const tooltip = this.shadowRoot.querySelector('d2l-tooltip');
		if (tooltip) tooltip.hide();
	}

	_handleInputTimeFocus() {
		const tooltip = this.shadowRoot.querySelector('d2l-tooltip');
		if (tooltip) tooltip.show();
	}

	_handleNestedFormElementValidation(e) {
		e.preventDefault();
	}

	async _handleTimeChange(e) {
		this.value = getUTCDateTimeFromLocalDateTime(this._parsedDateTime, e.target.value);
		await this._validate();
		this._dispatchChangeEvent();
	}

	async _validate() {
		this.setValidity({
			rangeUnderflow: this.value && this.minValue && getDateFromISODateTime(this.value).getTime() < getDateFromISODateTime(this.minValue).getTime(),
			rangeOverflow: this.value && this.maxValue && getDateFromISODateTime(this.value).getTime() > getDateFromISODateTime(this.maxValue).getTime()
		});
		await this.requestValidate();
	}

}
customElements.define('d2l-input-date-time', InputDateTime);

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
			 * Hides the label visually (moves it to the input's "aria-label" attribute)
			 */
			labelHidden: { attribute: 'label-hidden', reflect: true, type: Boolean },
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
			 * Set default value of time portion of the input. Valid values are times in ISO 8601 time format ("hh:mm:ss"), "startOfDay", "endOfDay".
			 * @type {'startOfDay'|'endOfDay'|string}
			 */
			timeDefaultValue: { attribute: 'time-default-value', reflect: true, type: String },
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
		this.labelHidden = false;
		this.required = false;
		this._dropdownOpened = false;
		this._inputId = getUniqueId();
		this._namespace = 'components.input-date-time';
		this._parsedDateTime = '';
		this._preventDefaultValidation = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-time component requires label text');
		}

		if (this.value) this._preventDefaultValidation = true;
	}

	render() {
		const timeHidden = !this._parsedDateTime;

		const tooltip = (this.validationError && !this._dropdownOpened && this.childErrors.size === 0) ? html`<d2l-tooltip align="start" announced for="${this._inputId}" state="error">${this.validationError}</d2l-tooltip>` : null;
		return html`
			${tooltip}
			<d2l-input-fieldset label="${ifDefined(this.label)}" ?label-hidden="${this.labelHidden}" ?required="${this.required}">
				<d2l-input-date
					novalidateminmax
					@change="${this._handleDateChange}"
					@d2l-input-date-dropdown-toggle="${this._handleDropdownToggle}"
					?disabled="${this.disabled}"
					.forceInvalid=${this.invalid}
					id="${this._inputId}"
					label="${this.localize('components.input-date-time.date')}"
					label-hidden
					max-value="${ifDefined(this._maxValueLocalized)}"
					min-value="${ifDefined(this._minValueLocalized)}"
					?required="${this.required}"
					.value="${this._parsedDateTime}">
				</d2l-input-date>
				<d2l-input-time
					@blur="${this._handleInputTimeBlur}"
					@change="${this._handleTimeChange}"
					@d2l-input-time-dropdown-toggle="${this._handleDropdownToggle}"
					default-value="${ifDefined(this.timeDefaultValue)}"
					?disabled="${this.disabled}"
					@focus="${this._handleInputTimeFocus}"
					.forceInvalid=${this.invalid}
					?hidden="${timeHidden}"
					@mouseout="${this._handleInputTimeBlur}"
					@mouseover="${this._handleInputTimeFocus}"
					label="${this.localize('components.input-date-time.time')}"
					label-hidden
					max-height="430"
					?required="${this.required}"
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
				this.setFormValue(this.value);
				this.setValidity({
					rangeUnderflow: this.value && this.minValue && (new Date(this.value)).getTime() < (new Date(this.minValue)).getTime(),
					rangeOverflow: this.value && this.maxValue && (new Date(this.value)).getTime() > (new Date(this.maxValue)).getTime()
				});
				this.requestValidate(true);
				this._preventDefaultValidation = true;
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

	async validate() {
		const dateInput = this.shadowRoot.querySelector('d2l-input-date');
		const timeInput = this.shadowRoot.querySelector('d2l-input-time');
		const errors = await Promise.all([dateInput.validate(), timeInput.validate(), super.validate()]);
		return [...errors[0], ...errors[1], ...errors[2]];
	}

	get validationMessage() {
		if (this.validity.rangeOverflow || this.validity.rangeUnderflow) {
			const minDate = this.minValue ? formatDateTime(getDateFromISODateTime(this.minValue), { format: 'medium' }) : null;
			const maxDate = this.maxValue ? formatDateTime(getDateFromISODateTime(this.maxValue), { format: 'medium' }) : null;
			if (minDate && maxDate) {
				return this.localize(`${this._namespace}.errorOutsideRange`, { minDate, maxDate });
			} else if (maxDate) {
				return this.localize(`${this._namespace}.errorMaxDateOnly`, { maxDate });
			} else if (this.minValue) {
				return this.localize(`${this._namespace}.errorMinDateOnly`, { minDate });
			}
		}
		return super.validationMessage;
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
		this._dispatchChangeEvent();
	}

	async _handleDropdownToggle(e) {
		this._dropdownOpened = e.detail.opened;
		if (e.target.tagName === 'D2L-INPUT-TIME' && !this._dropdownOpened) {
			await this.updateComplete;
			this._handleInputTimeFocus();
		}
		this.dispatchEvent(new CustomEvent(
			'd2l-input-date-time-dropdown-toggle',
			{ bubbles: false, composed: false, detail: { opened: e.detail.opened } }
		));
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
		if (this._preventDefaultValidation) {
			e.preventDefault();
		}
	}

	async _handleTimeChange(e) {
		this.value = getUTCDateTimeFromLocalDateTime(this._parsedDateTime, e.target.value);
		this._dispatchChangeEvent();
	}

}
customElements.define('d2l-input-date-time', InputDateTime);

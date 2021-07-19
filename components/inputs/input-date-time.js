import './input-date.js';
import './input-fieldset.js';
import '../tooltip/tooltip.js';
import { convertUTCToLocalDateTime, formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDateInISO,
	formatDateInISOTime,
	formatDateTimeInISO,
	getDateFromISODateTime,
	getDateNoConversion,
	getLocalDateTimeFromUTCDateTime,
	getUTCDateTimeFromLocalDateTime,
	parseISODate,
	parseISODateTime,
	parseISOTime } from '../../helpers/dateTime.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getDefaultTime } from './input-time.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

export function _formatLocalDateTimeInISO(date, time) {
	const dateObj = parseISODate(date);
	const timeObj = parseISOTime(time);

	return formatDateTimeInISO(Object.assign(dateObj, timeObj), true);
}

function _getFormattedDefaultTime(defaultValue) {
	const time = getDefaultTime(defaultValue);
	return formatDateInISOTime(time);
}

/**
 * A component that consists of a "<d2l-input-date>" and a "<d2l-input-time>" component. The time input only appears once a date is selected. This component displays the "value" if one is specified, and reflects the selected value when one is selected or entered.
 * @fires change - Dispatched when there is a change in selected date or selected time. "value" contains the selected value and is formatted in ISO 8601 combined date and time format ("YYYY-MM-DDTHH:mm:ss.sssZ").
 */
class InputDateTime extends SkeletonMixin(FormElementMixin(LocalizeCoreElement(RtlMixin(LitElement)))) {

	static get properties() {
		return {
			/**
			 * Disables the input
			 */
			disabled: { type: Boolean },
			/**
			 * REQUIRED: Accessible label for the input fieldset that wraps the date and time inputs
			 */
			label: { type: String },
			/**
			 * Hides the fieldset label visually
			 */
			labelHidden: { attribute: 'label-hidden', reflect: true, type: Boolean },
			/**
			 * Indicates that localization will be handled by the consumer. `*value` will not be converted from/to UTC.
			 */
			localized: { reflect: true, type: Boolean },
			/**
			 * Maximum valid date/time that could be selected by a user
			 */
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			/**
			 * Minimum valid date/time that could be selected by a user
			 */
			minValue: { attribute: 'min-value', reflect: true, type: String },
			/**
			 * Indicates that a value is required
			 */
			required: { type: Boolean, reflect: true },
			/**
			 * Default value of time input. Accepts times formatted as "hh:mm:ss", and the keywords "startOfDay" and "endOfDay".
			 * @type {'startOfDay'|'endOfDay'|string}
			 */
			timeDefaultValue: { attribute: 'time-default-value', reflect: true, type: String },
			/**
			 * Value of the input
			 */
			value: { type: String },
			_dropdownOpened: { type: Boolean },
			_maxValueLocalized: { type: String },
			_minValueLocalized: { type: String }
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
			.d2l-input-date-time-container {
				margin-top: -0.3rem;
			}
			d2l-input-date,
			d2l-input-time {
				margin-top: 0.3rem;
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
		this.labelHidden = false;
		this.localized = false;
		this.required = false;
		this.timeDefaultValue = 'startOfDay';
		this._dropdownOpened = false;
		this._inputId = getUniqueId();
		this._namespace = 'components.input-date-time';
		this._preventDefaultValidation = false;
	}

	get maxValue() { return this._maxValue; }
	set maxValue(val) {
		const oldValue = this.value;
		if (this.localized) this._maxValueLocalized = val;
		else {
			try {
				const dateObj = parseISODateTime(val);
				const localDateTime = convertUTCToLocalDateTime(dateObj);
				this._maxValueLocalized = formatDateInISO(localDateTime);
			} catch (e) {
				this._maxValueLocalized = undefined;
			}
		}
		this._maxValue = val;
		this.requestUpdate('maxValue', oldValue);
	}

	get minValue() { return this._minValue; }
	set minValue(val) {
		const oldValue = this.value;
		if (this.localized) this._minValueLocalized = val;
		else {
			try {
				const dateObj = parseISODateTime(val);
				const localDateTime = convertUTCToLocalDateTime(dateObj);
				this._minValueLocalized = formatDateInISO(localDateTime);
			} catch (e) {
				this._minValueLocalized = undefined;
			}
		}
		this._minValue = val;
		this.requestUpdate('minValue', oldValue);
	}

	get value() { return this._value; }
	set value(val) {
		const oldValue = this.value;
		if (this.localized) this._value = val;
		else {
			try {
				getLocalDateTimeFromUTCDateTime(val);
				this._value = val;
			} catch (e) {
				this._value = '';
			}
		}
		this.requestUpdate('value', oldValue);
	}

	get validationMessage() {
		if (this.validity.rangeOverflow || this.validity.rangeUnderflow) {
			const minDate = this.minValue ? formatDateTime(this.localized ? getDateNoConversion(this.minValue) : getDateFromISODateTime(this.minValue), { format: 'medium' }) : null;
			const maxDate = this.maxValue ? formatDateTime(this.localized ? getDateNoConversion(this.maxValue) : getDateFromISODateTime(this.maxValue), { format: 'medium' }) : null;
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

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-time component requires label text');
		}

		if (this.value) this._preventDefaultValidation = true;
	}

	render() {
		const timeHidden = !this.value;

		const dateStyle = {};
		if (timeHidden) {
			dateStyle.paddingLeft = '0';
			dateStyle.paddingRight = '0';
		} else if (!timeHidden && this.dir === 'rtl') {
			dateStyle.paddingLeft = '0.3rem';
			dateStyle.paddingRight = '0';
		} else if (!timeHidden) {
			dateStyle.paddingLeft = '0';
			dateStyle.paddingRight = '0.3rem';
		}

		const parsedValue = this.value ? (this.localized ? this.value : getLocalDateTimeFromUTCDateTime(this.value)) : '';
		const tooltip = (this.validationError && !this._dropdownOpened && this.childErrors.size === 0) ? html`<d2l-tooltip align="start" announced for="${this._inputId}" state="error">${this.validationError}</d2l-tooltip>` : null;
		const inputTime = !timeHidden ? html`<d2l-input-time
				?novalidate="${this.noValidate}"
				@blur="${this._handleInputTimeBlur}"
				@change="${this._handleTimeChange}"
				@d2l-input-time-dropdown-toggle="${this._handleDropdownToggle}"
				default-value="${ifDefined(this.timeDefaultValue)}"
				?disabled="${this.disabled}"
				@focus="${this._handleInputTimeFocus}"
				.forceInvalid=${this.invalid}
				@mouseout="${this._handleInputTimeBlur}"
				@mouseover="${this._handleInputTimeFocus}"
				label="${this.localize('components.input-date-time.time')}"
				label-hidden
				max-height="430"
				?required="${this.required}"
				?skeleton="${this.skeleton}"
				.value="${parsedValue}">
			</d2l-input-time>` : null;

		return html`
			${tooltip}
			<d2l-input-fieldset
				label="${ifDefined(this.label)}"
				?label-hidden="${this.labelHidden}"
				?required="${this.required}"
				?skeleton="${this.skeleton}">
				<div class="d2l-input-date-time-container">
					<d2l-input-date
						?novalidate="${this.noValidate}"
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
						?skeleton="${this.skeleton}"
						style="${styleMap(dateStyle)}"
						.value="${parsedValue}">
					</d2l-input-date>${inputTime}
				</div>
			</d2l-input-fieldset>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'value') {
				this.setFormValue(this.value);
				this.setValidity({
					rangeUnderflow: this.value && this.minValue && (new Date(this.value)).getTime() < (new Date(this.minValue)).getTime(),
					rangeOverflow: this.value && this.maxValue && (new Date(this.value)).getTime() > (new Date(this.maxValue)).getTime()
				});
				this.requestValidate(true);
				this._preventDefaultValidation = true;
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
			const inputTime = this.shadowRoot.querySelector('d2l-input-time');
			const time = inputTime ? inputTime.value : _getFormattedDefaultTime(this.timeDefaultValue);
			this.value = this.localized ? _formatLocalDateTimeInISO(newDate, time) : getUTCDateTimeFromLocalDateTime(newDate, time);
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

	async _handleTimeChange(e) {
		const date = this.shadowRoot.querySelector('d2l-input-date').value;
		const time = e.target.value;
		this.value = this.localized ? _formatLocalDateTimeInISO(date, time) : getUTCDateTimeFromLocalDateTime(date, time);
		this._dispatchChangeEvent();
	}

}
customElements.define('d2l-input-date-time', InputDateTime);

import './input-date.js';
import './input-fieldset.js';
import '../tooltip/tooltip.js';
import { convertUTCToLocalDateTime, formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { css, html, LitElement } from 'lit';
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
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getDefaultTime } from './input-time.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LabelledMixin } from '../../mixins/labelled/labelled-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

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
 * @fires change - Dispatched when there is a change to selected date or selected time. `value` corresponds to the selected value and is formatted in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`).
 */
class InputDateTime extends FocusMixin(LabelledMixin(SkeletonMixin(FormElementMixin(LocalizeCoreElement(RtlMixin(LitElement)))))) {

	static get properties() {
		return {
			/**
			 * Disables the input
			 * @type {boolean}
			 */
			disabled: { type: Boolean },
			/**
			 * Hides the fieldset label visually
			 * @type {boolean}
			 */
			labelHidden: { attribute: 'label-hidden', reflect: true, type: Boolean },
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
			 * Indicates if the date or time dropdown is open
			 * @type {boolean}
			 */
			opened: { type: Boolean },
			/**
			 * Indicates that a value is required
			 * @type {boolean}
			 */
			required: { type: Boolean, reflect: true },
			/**
			 * Default value of time input. Accepts times formatted as "hh:mm:ss", and the keywords "startOfDay" and "endOfDay".
			 * @type {string}
			 */
			timeDefaultValue: { attribute: 'time-default-value', reflect: true, type: String },
			/**
			 * Value of the input
			 * @type {string}
			 */
			value: { type: String },
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
		this.opened = false;
		this.required = false;
		this.timeDefaultValue = 'startOfDay';
		this._documentLocaleSettings = getDocumentLocaleSettings();
		this._inputId = getUniqueId();
		this._namespace = 'components.input-date-time';
		this._preventDefaultValidation = false;
		this._timeOpened = false;
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

	static get focusElementSelector() {
		return 'd2l-input-date';
	}

	/** @ignore */
	get validationMessage() {
		if (this.validity.rangeOverflow || this.validity.rangeUnderflow) {
			const minDate = this.minValue ? formatDateTime(this.localized ? getDateNoConversion(this.minValue) : getDateFromISODateTime(this.minValue), { format: 'medium' }) : null;
			const maxDate = this.maxValue ? formatDateTime(this.localized ? getDateNoConversion(this.maxValue) : getDateFromISODateTime(this.maxValue), { format: 'medium' }) : null;
			if (minDate && maxDate) {
				return this.localize(`${this._namespace}.errorOutsideRange`, { minDate, maxDate });
			} else if (maxDate) {
				return this.localize(`${this._namespace}.errorMaxDateOnly2`, { maxDate });
			} else if (this.minValue) {
				return this.localize(`${this._namespace}.errorMinDateOnly2`, { minDate });
			}
		}
		return super.validationMessage;
	}

	connectedCallback() {
		super.connectedCallback();
		this._documentLocaleSettings.addChangeListener(this._handleLocaleChange.bind(this));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._documentLocaleSettings.removeChangeListener(this._handleLocaleChange.bind(this));
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

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

		const dateOpened = this.opened && !this._timeOpened && !this.disabled && !this.skeleton;
		const parsedValue = this.value ? (this.localized ? this.value : getLocalDateTimeFromUTCDateTime(this.value)) : '';
		const tooltip = (this.validationError && !this.opened && this.childErrors.size === 0) ? html`<d2l-tooltip align="start" announced for="${this._inputId}" state="error" class="vdiff-target">${this.validationError}</d2l-tooltip>` : null;
		const inputTime = !timeHidden ? html`<d2l-input-time
				?novalidate="${this.noValidate}"
				@blur="${this._handleInputTimeBlur}"
				@change="${this._handleTimeChange}"
				class="vdiff-target"
				@d2l-input-time-dropdown-toggle="${this._handleDropdownToggle}"
				default-value="${ifDefined(this.timeDefaultValue)}"
				?disabled="${this.disabled}"
				@focus="${this._handleInputTimeFocus}"
				.forceInvalid=${this.invalid}
				@mouseout="${this._handleInputTimeBlur}"
				@mouseover="${this._handleInputTimeFocus}"
				label="${this.localize('components.input-date-time.time')}"
				label-hidden
				.labelRequired="${false}"
				max-height="430"
				?required="${this.required}"
				?skeleton="${this.skeleton}"
				.value="${parsedValue}">
			</d2l-input-time>` : null;

		return html`
			${tooltip}
			<d2l-input-fieldset
				label="${ifDefined(this.label)}"
				?label-hidden="${this.labelHidden || this.labelledBy}"
				?required="${this.required}"
				?skeleton="${this.skeleton}">
				<div class="d2l-input-date-time-container">
					<d2l-input-date
						?novalidate="${this.noValidate}"
						novalidateminmax
						has-now
						@change="${this._handleDateChange}"
						class="vdiff-target"
						@d2l-input-date-dropdown-toggle="${this._handleDropdownToggle}"
						?disabled="${this.disabled}"
						.forceInvalid=${this.invalid}
						id="${this._inputId}"
						label="${this.localize('components.input-date-time.date')}"
						label-hidden
						.labelRequired="${false}"
						max-value="${ifDefined(this._maxValueLocalized)}"
						min-value="${ifDefined(this._minValueLocalized)}"
						?opened="${dateOpened}"
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

	async validate() {
		if (!this.shadowRoot) return;
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
			const inputTime = this.shadowRoot && this.shadowRoot.querySelector('d2l-input-time');
			let time;
			if (e.detail && e.detail.setToNow) time = _getFormattedDefaultTime('now');
			else time = inputTime ? inputTime.value : _getFormattedDefaultTime(this.timeDefaultValue);
			this.value = this.localized ? _formatLocalDateTimeInISO(newDate, time) : getUTCDateTimeFromLocalDateTime(newDate, time);
		}
		this._dispatchChangeEvent();
	}

	async _handleDropdownToggle(e) {
		this.opened = e.detail.opened;
		if (e.target.tagName === 'D2L-INPUT-TIME') {
			if (this.opened) this._timeOpened = true;
			else {
				this._timeOpened = false;
				await this.updateComplete;
				this._handleInputTimeFocus();
			}
		}
		/** @ignore */
		this.dispatchEvent(new CustomEvent(
			'd2l-input-date-time-dropdown-toggle',
			{ bubbles: false, composed: false, detail: { opened: e.detail.opened } }
		));
	}

	_handleInputTimeBlur() {
		const tooltip = this.shadowRoot && this.shadowRoot.querySelector('d2l-tooltip');
		if (tooltip) tooltip.hide();
	}

	_handleInputTimeFocus() {
		const tooltip = this.shadowRoot && this.shadowRoot.querySelector('d2l-tooltip');
		if (tooltip) tooltip.show();
	}

	_handleLocaleChange() {
		this.requestUpdate();
	}

	async _handleTimeChange(e) {
		const date = this.shadowRoot && this.shadowRoot.querySelector('d2l-input-date').value;
		const time = e.target.value;
		this.value = this.localized ? _formatLocalDateTimeInISO(date, time) : getUTCDateTimeFromLocalDateTime(date, time);
		this._dispatchChangeEvent();
	}

}
customElements.define('d2l-input-date-time', InputDateTime);

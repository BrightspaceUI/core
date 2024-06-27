import '../inputs/input-date-range.js';
import '../inputs/input-date-time-range.js';
import { getLocalDateTimeFromUTCDateTime, getUTCDateTimeFromLocalDateTime } from '../../helpers/dateTime.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A component to represent a possible custom date range or date-time range value that can be selected for a dimension set (the main filter dimension type).
 * The start-value and end-value will be included in the d2l-filter-change event and formatted as an ISO string in UTC time.
 * This component does not render anything, but instead gathers data needed for the d2l-filter.
 */
class FilterDimensionSetDateTimeRangeValue extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			/**
			 * Whether this value in the filter is disabled or not
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Value of the end date or date-time input. Expected to be in UTC.
			 * @type {string}
			 */
			endValue: { type: String, attribute: 'end-value' },
			/**
			 * REQUIRED: Unique key to represent this value in the dimension
			 * @type {string}
			 */
			key: { type: String },
			/**
			 * Whether this value in the filter is selected or not
			 * @type {boolean}
			 */
			selected: { type: Boolean, reflect: true },
			/**
			 * Value of the start date or date-time input. Expected to be in UTC.
			 * @type {string}
			 */
			startValue: { type: String, attribute: 'start-value' },
			/**
			 * Defaults to "Custom Date Range" (localized). Can be overridden if desired.
			 * @type {string}
			 */
			text: { type: String, reflect: true },
			/**
			 * Date/time range input type
			 * @type {'date'|'date-time'}
			 */
			type: { type: String }
		};
	}

	constructor() {
		super();
		this.disabled = false;
		this.selected = false;
		this.type = 'date-time';
		this._dispatchFilterChangeEvent = false;
		this._enforceSingleSelection = true;
		this._filterSetValue = true;
		this._minWidth = 375;
		this._noSearchSupport = true;

		this._handleDateChange = this._handleDateChange.bind(this);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.text = this.text || this.localize('components.filter-dimension-set-date-time-range-value.text');
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		const changes = new Map();
		let shouldDispatchChangeEvent = false;
		changedProperties.forEach((oldValue, prop) => {
			if (oldValue === undefined && (prop === 'selected' || prop === 'disabled')) return;
			if (this._dispatchFilterChangeEvent && (prop === 'startValue' || prop === 'endValue')) shouldDispatchChangeEvent = true;

			if (prop === 'disabled' || prop === 'selected' || prop === 'startValue' || prop === 'endValue' || prop === 'text') {
				changes.set(prop, this[prop]);
			}
		});
		if (changes.size > 0) {
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-filter-dimension-set-value-data-change', {
				detail: { valueKey: this.key, changes: changes, dispatchChangeEvent: shouldDispatchChangeEvent },
				bubbles: true,
				composed: false
			}));
			this._dispatchFilterChangeEvent = false;
		}
	}

	getValueDetails() {
		return {
			disabled: this.disabled,
			key: this.key,
			selected: this.selected,
			text: this.text,
			additionalContent: this._getAdditionalContent.bind(this),
			getAdditionalEventDetails: this._getAdditionalEventDetails.bind(this),
			clearProperties: this._clearProperties.bind(this)
		};
	}

	_clearProperties() {
		this.startValue = undefined;
		this.endValue = undefined;
	}

	_getAdditionalContent() {
		return this.type === 'date'
			? html`<d2l-input-date-range
				@change="${this._handleDateChange}"
				child-labels-hidden
				end-value="${ifDefined(this.endValue ? getLocalDateTimeFromUTCDateTime(this.endValue) : undefined)}"
				label="${this.localize('components.filter-dimension-set-date-time-range-value.text')}"
				label-hidden
				prefer-fixed-positioning
				start-value="${ifDefined(this.startValue ? getLocalDateTimeFromUTCDateTime(this.startValue) : undefined)}"
			></d2l-input-date-range>`
			: html`<d2l-input-date-time-range
				@change="${this._handleDateChange}"
				child-labels-hidden
				end-value="${ifDefined(this.endValue)}"
				label="${this.localize('components.filter-dimension-set-date-time-range-value.text')}"
				label-hidden
				prefer-fixed-positioning
				start-value="${ifDefined(this.startValue)}"
			></d2l-input-date-time-range>
		`;
	}

	_getAdditionalEventDetails(selected) {
		if (!selected) return {};
		return { startValue: this.startValue, endValue: this.endValue };
	}

	async _handleDateChange(e) {
		if (this.type === 'date') {
			this.startValue = e.target.startValue ? getUTCDateTimeFromLocalDateTime(e.target.startValue, '0:0') : undefined;
			this.endValue = e.target.endValue ? getUTCDateTimeFromLocalDateTime(e.target.endValue, '0:0') : undefined;
		} else {
			this.startValue = e.target.startValue;
			this.endValue = e.target.endValue;
		}

		this._dispatchFilterChangeEvent = true;
	}
}

customElements.define('d2l-filter-dimension-set-date-time-range-value', FilterDimensionSetDateTimeRangeValue);

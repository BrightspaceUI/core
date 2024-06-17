import '../inputs/input-date-time-range.js';
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
			 * @ignore
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
			 * @ignore
			 */
			startValue: { type: String, attribute: 'start-value' },
			/**
			 * Defaults to "Custom Date Range" (localized). Can be overridden if desired.
			 * @type {string}
			 */
			text: { type: String, reflect: true }
		};
	}

	constructor() {
		super();
		this.disabled = false;
		this.selected = false;
		this._enforceSingleSelection = true;
		this._minWidth = 450;
		this._filterSetValue = true;
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
			customSelectionContent: this._getCustomContent.bind(this),
			getAdditionalEventDetails: this._getAdditionalEventDetails.bind(this),
			clearProperties: this._clearProperties.bind(this)
		};
	}

	_clearProperties() {
		this.startValue = undefined;
		this.endValue = undefined;
	}

	_getAdditionalEventDetails(selected) {
		if (!selected) return {};
		return { startValue: this.startValue, endValue: this.endValue };
	}

	_getCustomContent() {
		const dateTimeRangeInputHeight = 515 + 153; // height of date picker and date-time range inputs when wrapped and font-size: 24px
		return html`
			<d2l-input-date-time-range
				@change="${this._handleDateChange}"
				@d2l-dropdown-close="${this._handleDateRangeDropdownClose}"
				child-labels-hidden
				data-dimensionvaluekey="${this.key}"
				end-value="${ifDefined(this.endValue)}"
				label="Custom Range"
				label-hidden
				start-value="2018-02-02T20:00:00.000Z"
				style="min-height: calc(${dateTimeRangeInputHeight}px + 0.5rem); min-width: ${this._minWidth}px"
			></d2l-input-date-time-range>
		`;
	}

	async _handleDateChange(e) {
		this.startValue = e.target.startValue;
		this.endValue = e.target.endValue;

		this._dispatchFilterChangeEvent = true;
	}

	_handleDateRangeDropdownClose(e) {
		e.stopPropagation();
	}
}

customElements.define('d2l-filter-dimension-set-date-time-range-value', FilterDimensionSetDateTimeRangeValue);

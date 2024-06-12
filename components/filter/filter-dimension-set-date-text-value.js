import { getUTCDateTimeRange } from '../../helpers/dateTime.js';
import { LitElement } from 'lit';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A component to represent a possible date value that can be selected for a dimension set (the main filter dimension type) for predefined date ranges.
 * A range property is used to define the preset text shown, as well as the start and end date values formatted as UTC strings.
 * This component does not render anything, but instead gathers data needed for the d2l-filter.
 */
class FilterDimensionSetDateTextValue extends LocalizeCoreElement(LitElement) {

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
			endValue: { type: String },
			/**
			 * REQUIRED: Unique key to represent this value in the dimension
			 * @type {string}
			 */
			key: { type: String },
			/**
			 * REQUIRED: The preset date/time range that the list item represents
			 * @type {'today'|'lastHour'|'24hours'|'48hours'|'7days'|'14days'|'30days'|'6months'}
			 */
			range: { type: String },
			/**
			 * Whether this value in the filter is selected or not
			 * @type {boolean}
			 */
			selected: { type: Boolean, reflect: true },
			/**
			 * @ignore
			 */
			startValue: { type: String },
			/**
			 * @ignore
			 */
			text: { type: String, reflect: true }
		};
	}

	constructor() {
		super();
		this.disabled = false;
		this.selected = false;
		this.text = '';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.selected && this.range) {
			// if the value is initially selected, startValue and endValue should be set in case used by consumer
			const dateTimeRange = getUTCDateTimeRange(this._rangeDetails?.rangeType, this._rangeDetails?.rangeNum);
			this.startValue = dateTimeRange?.startValue;
			this.endValue = dateTimeRange?.endValue;
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		const changes = new Map();
		changedProperties.forEach((oldValue, prop) => {
			if (oldValue === undefined && prop !== 'text') return;

			if (prop === 'disabled' || prop === 'selected' || prop === 'text') {
				changes.set(prop, this[prop]);
			} else if (prop === 'range') {
				changes.set('rangeType', this._rangeDetails?.rangeType);
				changes.set('rangeNum', this._rangeDetails?.rangeNum);
			}
		});
		if (changes.size > 0) {
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-filter-dimension-set-value-data-change', {
				detail: { valueKey: this.key, changes: changes },
				bubbles: true,
				composed: false
			}));
		}
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);

		if (changedProperties.has('range')) this._handleRangeUpdated();
	}

	getValueDetails() {
		this._handleRangeUpdated();

		return {
			disabled: this.disabled,
			key: this.key,
			selected: this.selected,
			text: this.text,
			type: 'date',
			rangeNum: this._rangeDetails.rangeNum,
			rangeType: this._rangeDetails.rangeType
		};
	}

	_handleRangeUpdated() {
		switch (this.range) {
			case 'today':
				this._rangeDetails = { rangeType: 'days', rangeNum: 0 };
				break;
			case 'lastHour':
				this._rangeDetails = { rangeType: 'hours', rangeNum: -1 };
				break;
			case '24hours':
				this._rangeDetails = { rangeType: 'hours', rangeNum: -24 };
				break;
			case '48hours':
				this._rangeDetails = { rangeType: 'hours', rangeNum: -48 };
				break;
			case '7days':
				this._rangeDetails = { rangeType: 'days', rangeNum: -7 };
				break;
			case '14days':
				this._rangeDetails = { rangeType: 'days', rangeNum: -14 };
				break;
			case '30days':
				this._rangeDetails = { rangeType: 'days', rangeNum: -30 };
				break;
			case '6months':
				this._rangeDetails = { rangeType: 'months', rangeNum: -6 };
				break;
			default:
				console.warn('d2l-filter-dimension-set-date-text-value: Invalid range value');
				this._rangeDetails = {};
				break;
		}

		if (this._rangeDetails.rangeType === 'hours') this.text = this.localize('components.filter-dimension-set-date-text-value.textHours', { num: Math.abs(this._rangeDetails.rangeNum) });
		else if (this._rangeDetails.rangeType === 'days') this.text = this.localize('components.filter-dimension-set-date-text-value.textDays', { num: Math.abs(this._rangeDetails.rangeNum) });
		else if (this._rangeDetails.rangeType === 'months') this.text = this.localize('components.filter-dimension-set-date-text-value.textMonths', { num: Math.abs(this._rangeDetails.rangeNum) });
	}
}

customElements.define('d2l-filter-dimension-set-date-text-value', FilterDimensionSetDateTextValue);

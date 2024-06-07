import { formatDateInISO, getToday, getUTCDateTimeFromLocalDateTime } from '../../helpers/dateTime.js';
import { LitElement } from 'lit';

/**
 * A component to represent a possible date value that can be selected for a dimension set (the main filter dimension type) for predefined date ranges.
 * A range property is used to define the preset text shown, as well as the start and end date values formatted as UTC strings.
 * This component does not render anything, but instead gathers data needed for the d2l-filter.
 */
class FilterDimensionSetDateTextValue extends LitElement {

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
			 * @type {'today'|'24hours'|'48hours'|'7days'|'14days'|'30days'|'6months'}
			 */
			range: { stype: String },
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
			 * REQUIRED: The text that is displayed for the value
			 * @type {string}
			 */
			text: { type: String, reflect: true }
		};
	}

	constructor() {
		super();
		this.disabled = false;
		this.selected = false;
		this.text = '';
		/** @ignore */
		this.type = 'date';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.range) return;

		this._handleRange();
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		const changes = new Map();
		changedProperties.forEach((oldValue, prop) => {
			if (prop === 'range') this._handleRange();
			if (oldValue === undefined) return;

			if (prop === 'count' || prop === 'disabled' || prop === 'selected' || prop === 'text' || prop === 'startValue' || prop === 'endValue') {
				changes.set(prop, this[prop]);
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

	_handleRange() {
		switch (this.range) {
			case 'today': {
				this.text = 'Today';
				/**
				 * gets today in user's locale
				 * gets start value as midnight and end value as 23:59:59 on that day
				 * sets startValue and endValue to UTC strings of those values
				 */
				const today = formatDateInISO(getToday());
				this.startValue = getUTCDateTimeFromLocalDateTime(today, '0:0:0');
				this.endValue = getUTCDateTimeFromLocalDateTime(today, '23:59:59');
				break;
			} case '24hours':
				this.text = '24 Hours';
				this._setDateValues(1);
				break;
			case '48hours':
				this.text = '48 Hours';
				this._setDateValues(2);
				break;
			case '7days':
				this.text = '7 Days';
				this._setDateValues(7);
				break;
			case '14days':
				this.text = '14 Days';
				this._setDateValues(14);
				break;
			case '30days':
				this.text = '30 Days';
				this._setDateValues(30);
				break;
			case '6months': {
				this.text = '6 Months';

				const startingVal = new Date();
				this.endValue = startingVal.toISOString();

				const newDate = startingVal.getMonth() - 6;
				startingVal.setMonth(newDate);

				this.startValue = startingVal.toISOString();
				break;
			} default:
				console.warn('d2l-filter-dimension-set-date-text-value: Invalid range value');
		}
	}

	_setDateValues(dateDiff) {
		/**
		 * endValue = now in UTC string
		 * startValue = now minus number of dates in dateDiff then converted to UTC string
		 * locale would not impact this
		 */
		const startingVal = new Date();

		this.endValue = startingVal.toISOString();

		const newDate = startingVal.getDate() - dateDiff;
		startingVal.setDate(newDate);

		this.startValue = startingVal.toISOString();
	}
}

customElements.define('d2l-filter-dimension-set-date-text-value', FilterDimensionSetDateTextValue);

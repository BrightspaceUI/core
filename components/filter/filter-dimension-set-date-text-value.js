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
			 * @type {'today'|'lastHour'|'24hours'|'48hours'|'7days'|'14days'|'30days'|'6months'}
			 */
			range: { type: String },
			/**
			 * @ignore
			 */
			rangeNum: { type: Number, reflect: true },
			/**
			 * @ignore
			 */
			rangeType: { type: String, reflect: true },
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
		/** @ignore */
		this.type = 'date';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.range) return;

		this._handleRange();

		if (this.selected) {
			// if the value is initially selected, startValue and endValue should be set in case used by consumer
			const dateTimeRange = getUTCDateTimeRange(this.rangeType, this.rangeNum);
			this.startValue = dateTimeRange.startValue;
			this.endValue = dateTimeRange.endValue;
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('range')) {
			this._handleRange();
		}

		if (changedProperties.has('rangeType') || changedProperties.has('rangeNum')) {
			this.text = this.localize('components.filter-dimension-set-date-text-value.text', { type: this.rangeType, num: this.rangeNum });
		}

		const changes = new Map();
		changedProperties.forEach((oldValue, prop) => {
			if (oldValue === undefined && prop !== 'rangeType' && prop !== 'rangeNum') return;

			if (prop === 'disabled' || prop === 'selected' || prop === 'text' || prop === 'rangeType' || prop === 'rangeNum') {
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
				this.rangeType = 'days';
				this.rangeNum = 0;
				break;
			} case 'lastHour': {
				this.rangeType = 'hours';
				this.rangeNum = 1;
				break;
			} case '24hours':
				this.rangeType = 'hours';
				this.rangeNum = 24;
				break;
			case '48hours':
				this.rangeType = 'hours';
				this.rangeNum = 48;
				break;
			case '7days':
				this.rangeType = 'days';
				this.rangeNum = 7;
				break;
			case '14days':
				this.rangeType = 'days';
				this.rangeNum = 14;
				break;
			case '30days':
				this.rangeType = 'days';
				this.rangeNum = 30;
				break;
			case '6months': {
				this.rangeType = 'months';
				this.rangeNum = 6;
				break;
			} default:
				console.warn('d2l-filter-dimension-set-date-text-value: Invalid range value');
		}
	}
}

customElements.define('d2l-filter-dimension-set-date-text-value', FilterDimensionSetDateTextValue);

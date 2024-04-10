import { formatPercent } from '@brightspace-ui/intl/lib/number.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

export const MeterMixin = superclass => class extends LocalizeCoreElement(superclass) {

	static get properties() {
		return {
			/**
			 * Max number of units that are being measured by this meter.
			 * Valid values: A number > 0
			 * @type {number}
			 */
			max: { type: Number },
			/**
			 * Shows a percentage instead of "value/max"
			 * @type {boolean}
			 */
			percent: { type: Boolean },
			/**
			 * Context information for the meter. If the text contains {%} or {x/y}, they will be replaced with a percentage or fraction respectively.
			 * @type {string}
			 */
			text: { type: String },
			/**
			 * Displays the text as a label beneath the meter
			 * @type {boolean}
			 */
			textHidden: { type: Boolean, attribute: 'text-hidden' },
			/**
			 * REQUIRED: Current number of completed units.
			 * Valid values: A number between 0 and max
			 * @type {number}
			 */
			value: { type: Number }
		};
	}

	constructor() {
		super();
		this.max = 100;
		this.percent = false;
		this.textHidden = false;
		this.value = 0;

		this._namespace = 'components.meter-mixin';
	}

	_ariaLabel(primary, secondary) {
		const mainLabel = this.localize(`${this._namespace}.commaSeperatedAria`, 'term1', primary, 'term2', this.localize(`${this._namespace}.progressIndicator`));
		return secondary ? this.localize(`${this._namespace}.commaSeperatedAria`, 'term1', secondary, 'term2', mainLabel) : mainLabel;
	}

	_primary(value, max) {
		const percentage = max > 0 ? value / max : 0;

		return this.percent
			? formatPercent(percentage, { maximumFractionDigits: 0 })
			: this.localize(`${this._namespace}.fraction`, 'x', value, 'y', max);
	}

	_secondary(value, max, context) {
		if (!context) {
			return '';
		}

		const percentage = this.max > 0 ? value / max : 0;
		context = context.replace('{%}', formatPercent(percentage, { maximumFractionDigits: 0 }));
		context = context.replace('{x/y}', this.localize(`${this._namespace}.fraction`, 'x', value, 'y', max));
		context = context.replace('{x}', value);
		context = context.replace('{y}', max);

		return context;
	}

};

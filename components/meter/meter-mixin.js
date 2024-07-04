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
		this.value = 0;

		this._namespace = 'components.meter-mixin';
	}

	_ariaLabel(primary, secondary) {
		// todo: these should be using CLDR data/patterns instead of translated message fragments
		// example: https://www.unicode.org/cldr/cldr-aux/charts/37/summary/en.html#4480e9e541ba33de
		const mainLabel = this.localize(`${this._namespace}.commaSeperatedAria`, 'term1', primary, 'term2', this.localize(`${this._namespace}.progressIndicator`));
		return secondary ? this.localize(`${this._namespace}.commaSeperatedAria`, 'term1', secondary, 'term2', mainLabel) : mainLabel;
	}

	_primary(value, max, aria = false) {
		const percentage = max > 0 ? value / max : 0;
		const key = aria ? 'fractionAria' : 'fraction';

		return this.percent
			? formatPercent(percentage, { maximumFractionDigits: 0 })
			: this.localize(`${this._namespace}.${key}`, 'x', value, 'y', max);
	}

	_secondary(value, max, context, aria = false) {
		if (!context) {
			return '';
		}

		const key = aria ? 'fractionAria' : 'fraction';

		const percentage = this.max > 0 ? value / max : 0;
		context = context.replace('{%}', formatPercent(percentage, { maximumFractionDigits: 0 }));
		context = context.replace('{x/y}', this.localize(`${this._namespace}.${key}`, { x: value, y: max }));
		context = context.replace('{x}', value);
		context = context.replace('{y}', max);

		return context;
	}

};

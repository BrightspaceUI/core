import { formatPercent } from '@brightspace-ui/intl/lib/number.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';

export const MeterMixin = superclass => class extends LocalizeCoreElement(superclass) {

	static get properties() {
		return {
			max: { type: Number },
			percent: { type: Boolean },
			text: { type: String },
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
		const mainLabel = this.localize(`${this._namespace}.commaSeperatedAria`, 'term1', primary, 'term2', this.localize(`${this._namespace}.progressIndicator`));
		return secondary ? this.localize(`${this._namespace}.commaSeperatedAria`, 'term1', secondary, 'term2', mainLabel) : mainLabel;
	}

	_primary(value, max, dir) {
		const percentage = max > 0 ? value / max : 0;

		return this.percent
			? formatPercent(percentage, {maximumFractionDigits: 0})
			: (dir !== 'rtl' ? this.localize(`${this._namespace}.fraction`, 'x', value, 'y', max) : this.localize(`${this._namespace}.fraction`, 'x', max, 'y', value));
	}

	_secondary(value, max, context) {
		if (!context) {
			return '';
		}

		const percentage = this.max > 0 ? value / max : 0;
		context = context.replace('{%}', formatPercent(percentage, {maximumFractionDigits: 0}));
		context = context.replace('{x/y}', this.localize(`${this._namespace}.fraction`, 'x', value, 'y', max));
		context = context.replace('{x}', value);
		context = context.replace('{y}', max);

		return context;
	}

};

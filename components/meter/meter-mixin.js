import { getLocalizationResource } from '../../tools/localization-load.js';
import { LocalizeMixin } from '../../mixins/localize-mixin.js';

export const MeterMixin = superclass => class extends LocalizeMixin(superclass) {

	static get properties() {
		return {
			max: { type: Number },
			percent: { type: Boolean },
			text: { type: String },
			value: { type: Number }
		};
	}

	static async getLocalizeResources(langs) {
		return getLocalizationResource('meter', langs);
	}

	constructor() {
		super();
		this.max = 100;
		this.percent = false;
		this.value = 0;
	}

	_primary(value, max, dir) {
		const percentage = max > 0 ? value / max : 0;

		return this.percent
			? this.formatNumber(percentage, {style: 'percent', maximumFractionDigits: 0})
			: ( dir !== 'rtl' ? this.localize('fraction', 'x', value, 'y', max) : this.localize('fraction', 'x', max, 'y', value));
	}

	_secondary(value, max, context) {
		if (!context) {
			return '';
		}

		const percentage = this.max > 0 ? value / max : 0;
		context = context.replace('{%}', this.formatNumber(percentage, {style: 'percent', maximumFractionDigits: 0}));
		context = context.replace('{x/y}', this.localize('fraction', 'x', value, 'y', max));
		context = context.replace('{x}', value);
		context = context.replace('{y}', max);

		return context;
	}

	_ariaLabel(primary, secondary) {
		const mainLabel = this.localize('commaSeperatedAria', 'term1', primary, 'term2', this.localize('progressIndicator'));
		return secondary ? this.localize('commaSeperatedAria', 'term1', secondary, 'term2', mainLabel) : mainLabel;
	}
};

import { formatPercent } from '@brightspace-ui/intl/lib/number.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';

export const MeterMixin = superclass => class extends LocalizeStaticMixin(superclass) {

	static get properties() {
		return {
			max: { type: Number },
			percent: { type: Boolean },
			text: { type: String },
			value: { type: Number }
		};
	}

	static get resources() {
		return {
			'ar': { commaSeperatedAria: '{term1}، ‏{term2}', fraction: '{x}∕{y}', progressIndicator: 'مؤشر التقدم' },
			'de': { commaSeperatedAria: '{term1}, {term2}', fraction: '{x}∕{y}', progressIndicator: 'Fortschrittsanzeige' },
			'en': { commaSeperatedAria: '{term1}, {term2}', fraction: '{x}∕{y}', progressIndicator: 'Progress Indicator' },
			'es': { commaSeperatedAria: '{term1}, {term2}', fraction: '{x}∕{y}', progressIndicator: 'Indicador de progreso' },
			'fr': { commaSeperatedAria: '{term1}, {term2}', fraction: '{x}∕{y}', progressIndicator: 'Indicateur de progrès' },
			'ja': { commaSeperatedAria: '{term1}、{term2}', fraction: '{x}∕{y}', progressIndicator: '進捗状況インジケータ' },
			'ko': { commaSeperatedAria: '{term1}, {term2}', fraction: '{x}∕{y}', progressIndicator: '진도 표시기' },
			'nl': { commaSeperatedAria: '{term1}, {term2}', fraction: '{x}∕{y}', progressIndicator: 'Voortgangsindicator' },
			'pt': { commaSeperatedAria: '{term1}, {term2}', fraction: '{x}∕{y}', progressIndicator: 'Indicador de Progresso' },
			'sv': { commaSeperatedAria: '{term1}, {term2}', fraction: '{x}∕{y}', progressIndicator: 'Förloppsindikator' },
			'tr': { commaSeperatedAria: '{term1}, {term2}', fraction: '{x}∕{y}', progressIndicator: 'Gelişim Göstergesi' },
			'zh': { commaSeperatedAria: '{term1}、{term2}', fraction: '{x}∕{y}', progressIndicator: '进度指示符' },
			'zh-tw': { commaSeperatedAria: '{term1}，{term2}', fraction: '{x}∕{y}', progressIndicator: '進度指示器' }
		};
	}

	constructor() {
		super();
		this.max = 100;
		this.percent = false;
		this.value = 0;
	}

	_ariaLabel(primary, secondary) {
		const mainLabel = this.localize('commaSeperatedAria', 'term1', primary, 'term2', this.localize('progressIndicator'));
		return secondary ? this.localize('commaSeperatedAria', 'term1', secondary, 'term2', mainLabel) : mainLabel;
	}

	_primary(value, max, dir) {
		const percentage = max > 0 ? value / max : 0;

		return this.percent
			? formatPercent(percentage, {maximumFractionDigits: 0})
			: (dir !== 'rtl' ? this.localize('fraction', 'x', value, 'y', max) : this.localize('fraction', 'x', max, 'y', value));
	}

	_secondary(value, max, context) {
		if (!context) {
			return '';
		}

		const percentage = this.max > 0 ? value / max : 0;
		context = context.replace('{%}', formatPercent(percentage, {maximumFractionDigits: 0}));
		context = context.replace('{x/y}', this.localize('fraction', 'x', value, 'y', max));
		context = context.replace('{x}', value);
		context = context.replace('{y}', max);

		return context;
	}

};

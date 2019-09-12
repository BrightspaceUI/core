import {
	addListener, formatDate, formatDateTime, formatFileSize, formatNumber,
	formatTime, getTimezone, localize, parseDate, parseNumber,
	parseTime, removeListener
} from '../helpers/localization.js';

export const LocalizeMixin = superclass => class extends superclass {

	static get properties() {
		return {
			__language: { type: String },
			__resources: { type: Object }
		};
	}

	constructor() {
		super();

		let first = true;
		this.__languageChangeCallback = (documentLanguage, documentLanguageFallback) => {
			const possibleLanguages = this._generatePossibleLanguages(documentLanguage, documentLanguageFallback);
			this.constructor.getLocalizeResources(possibleLanguages)
				.then((res) => {
					if (!res) {
						return;
					}
					this.__language = res.language;
					this.__resources = res.resources;
					if (first) {
						first = false;
					} else {
						this._languageChange();
					}
				});
		};

	}

	connectedCallback() {
		super.connectedCallback();
		addListener(this.__languageChangeCallback);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		removeListener(this.__languageChangeCallback);
	}

	shouldUpdate() {
		const ready = this.__language !== undefined
			&& this.__resources !== undefined;
		if (!ready) {
			return false;
		}
		return super.shouldUpdate();
	}

	localize(key) {
		const args = {};
		for (let i = 1; i < arguments.length; i += 2) {
			args[arguments[i]] = arguments[i + 1];
		}
		return localize(key, this.__resources, this.__language, args);
	}

	getTimezone() {
		return getTimezone();
	}

	formatDateTime(val, opts) {
		return formatDateTime(this.__language, val, opts);
	}

	formatDate(val, opts) {
		return formatDate(this.__language, val, opts);
	}

	formatFileSize(val) {
		return formatFileSize(this.__language, val);
	}

	formatNumber(val, opts) {
		return formatNumber(this.__language, val, opts);
	}

	formatTime(val, opts) {
		return formatTime(this.__language, val, opts);
	}

	parseDate(val) {
		return parseDate(this.__language, val);
	}

	parseNumber(val, opts) {
		return parseNumber(this.__language, val, opts);
	}

	parseTime(val) {
		return parseTime(this.__language, val);
	}

	_generatePossibleLanguages(docLang, docFallbackLang) {
		const langs = [];

		if (docLang) {
			docLang = docLang.toLowerCase();
			langs.push(docLang);

			if (docLang.indexOf('-') !== -1) {
				const baseDocLang = docLang.split('-')[0];
				langs.push(baseDocLang);
			}
		}

		if (docFallbackLang) {
			docFallbackLang = docFallbackLang.toLowerCase();
			langs.push(docFallbackLang);

			if (docFallbackLang.indexOf('-') !== -1) {
				const baseDocFallbackLang = docFallbackLang.split('-')[0];
				langs.push(baseDocFallbackLang);
			}
		}

		langs.push('en-us', 'en');

		return langs;
	}

	_languageChange() {
		this.dispatchEvent(new CustomEvent(
			'd2l-localize-behavior-language-changed', { bubbles: true, composed: true }
		));
	}

};

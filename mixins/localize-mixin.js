import {formatDate, formatDateTime, formatTime, parseDate, parseTime} from '@brightspace-ui/intl/lib/dateTime.js';
import {formatNumber, parseNumber} from '@brightspace-ui/intl/lib/number.js';
import {formatFileSize} from '@brightspace-ui/intl/lib/fileSize.js';
import {getDocumentLocaleSettings} from '@brightspace-ui/intl/lib/common.js';
import IntlMessageFormat from 'intl-messageformat/src/main.js';
window.IntlMessageFormat = IntlMessageFormat;

export const LocalizeMixin = superclass => class extends superclass {

	static get properties() {
		return {
			__language: { type: String, attribute: false  },
			__resources: { type: Object, attribute: false  }
		};
	}

	constructor() {
		super();

		this.__documentLocaleSettings = getDocumentLocaleSettings();
		let first = true;
		this.__languageChangeCallback = () => {

			if (!this._hasResources()) return;
			const possibleLanguages = this._generatePossibleLanguages();
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
		this.__updatedProperties = new Map();

	}

	connectedCallback() {
		super.connectedCallback();
		this.__documentLocaleSettings.addChangeListener(this.__languageChangeCallback);
		this.__languageChangeCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.__documentLocaleSettings.removeChangeListener(this.__languageChangeCallback);
		this.__updatedProperties.clear();
	}

	shouldUpdate(changedProperties) {

		const hasResources = this._hasResources();
		if (!hasResources) {
			return super.shouldUpdate(changedProperties);
		}

		const ready = (this.__language !== undefined && this.__resources !== undefined);
		if (!ready) {
			changedProperties.forEach((oldValue, propName) => {
				this.__updatedProperties.set(propName, oldValue);
			});
			return false;
		}

		this.__updatedProperties.forEach((oldValue, propName) => {
			if (!changedProperties.has(propName)) {
				changedProperties.set(propName, oldValue);
			}
		});
		this.__updatedProperties.clear();

		return super.shouldUpdate(changedProperties);

	}

	getTimezone() {
		return this.__documentLocaleSettings.timezone;
	}

	formatDateTime(val, opts) {
		return formatDateTime(val, opts);
	}

	formatDate(val, opts) {
		return formatDate(val, opts);
	}

	formatFileSize(val) {
		return formatFileSize(val);
	}

	formatNumber(val, opts) {
		return formatNumber(val, opts);
	}

	formatTime(val, opts) {
		return formatTime(val, opts);
	}

	localize(key) {

		if (!key || !this.__resources || !this.__language) {
			return '';
		}

		const translatedValue = this.__resources[key];
		if (!translatedValue) {
			return '';
		}

		let params = {};
		if (arguments.length > 1 && typeof arguments[1] === 'object') {
			// support for key-value replacements as a single arg
			params = arguments[1];
		} else {
			// legacy support for localize-behavior replacements as many args
			for (let i = 1; i < arguments.length; i += 2) {
				params[arguments[i]] = arguments[i + 1];
			}
		}

		const translatedMessage = new IntlMessageFormat(translatedValue, this.__language);
		return translatedMessage.format(params);

	}

	parseDate(val) {
		return parseDate(val);
	}

	parseNumber(val, opts) {
		return parseNumber(val, opts);
	}

	parseTime(val) {
		return parseTime(val);
	}

	_generatePossibleLanguages() {
		const langs = [];

		let docLang = this.__documentLocaleSettings.language;
		if (docLang) {
			docLang = docLang.toLowerCase();
			langs.push(docLang);

			if (docLang.indexOf('-') !== -1) {
				const baseDocLang = docLang.split('-')[0];
				langs.push(baseDocLang);
			}
		}

		let docFallbackLang = this.__documentLocaleSettings.fallbackLanguage;
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

	_hasResources() {
		return this.constructor['getLocalizeResources'] !== undefined;
	}

	_languageChange() {
		this.dispatchEvent(new CustomEvent(
			'd2l-localize-behavior-language-changed', { bubbles: true, composed: true }
		));
	}

};

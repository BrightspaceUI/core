import d2lIntl from 'd2l-intl';
import IntlMessageFormat from 'intl-messageformat/src/main.js';
window.IntlMessageFormat = IntlMessageFormat;

var assign =
	Object.assign ? Object.assign.bind(Object) : function(destination, source) {
		for (var prop in source) {
			if (source.hasOwnProperty(prop)) {
				destination[prop] = source[prop];
			}
		}

		return destination;
	};

export const LocalizeMixin = superclass => class extends superclass {

	static get properties() {
		return {
			__documentLanguage: { type: String },
			__documentLanguageFallback: { type: String },
			__language: { type: String },
			__overrides: { type: Object },
			__resources: { type: Object },
			__timezoneObject: { type: Object },
			__timezone: { type: String }
		};
	}

	connectedCallback() {
		super.connectedCallback();
	}

	constructor() {
		super();

		this.__documentLanguage = window.document.getElementsByTagName('html')[0].getAttribute('lang');
		this.__documentLanguageFallback = window.document.getElementsByTagName('html')[0].getAttribute('data-lang-default');

		this.__overrides = this._tryParseHtmlElemAttr('d2l-intl-overrides', {});
		this.__timezoneObject = this._tryParseHtmlElemAttr('data-timezone', {name: '', identifier: ''});
		this.__timezone = this._computeTimezone();

		this._startObserver();
	}

	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === '__documentLanguage' || propName === '__documentLanguageFallback') {
				var possibleLanguages = this._generatePossibleLanguages(this.__documentLanguage, this.__documentLanguageFallback);
				this.__language = this.getLanguage(possibleLanguages);
			} else if (propName === '__language') {
				this._languageChange();

				// Everytime language or resources change, invalidate the messages cache.
				var proto = this.constructor.prototype;
				this.checkLocalizationCache(proto);
				proto.__localizationCache.messages = {};

				this.getLangResources(this.__language)
					.then((res) => {
						if (!res) {
							return;
						}
						this._onRequestResponse(res, this.__language);
					});
			} else if (propName === '__timezoneObject') {
				this._timezoneChange();
			}
		});
	}

	localize(key) {
		return this._computeLocalize(this.__language, this.__resources, key);
	}

	checkLocalizationCache(proto) {
		// do nothing if proto is undefined.
		if (proto === undefined)
			return;

		// In the event proto not have __localizationCache object, create it.
		if (proto['__localizationCache'] === undefined) {
			proto['__localizationCache'] = {messages: {}, requests: {}};
		}
	}

	getTimezone() {
		return this.__timezoneObject;
	}

	formatDateTime(val, opts) {
		opts = opts || {};
		opts.locale = this.__overrides;
		opts.timezone = opts.timezone || this.__timezone;
		var formatter = new d2lIntl.DateTimeFormat(this.__language, opts);
		return formatter.format(val);
	}

	formatDate(val, opts) {
		opts = opts || {};
		opts.locale = this.__overrides;
		opts.timezone = opts.timezone || this.__timezone;
		var formatter = new d2lIntl.DateTimeFormat(this.__language, opts);
		return formatter.formatDate(val);
	}

	formatFileSize(val) {
		var formatter = new d2lIntl.FileSizeFormat(this.__language);
		return formatter.format(val);
	}

	formatNumber(val, opts) {
		opts = opts || {};
		opts.locale = this.__overrides;
		var formatter = new d2lIntl.NumberFormat(this.__language, opts);
		return formatter.format(val);
	}

	formatTime(val, opts) {
		opts = opts || {};
		opts.locale = this.__overrides;
		opts.timezone = opts.timezone || this.__timezone;
		var formatter = new d2lIntl.DateTimeFormat(this.__language, opts);
		return formatter.formatTime(val);
	}

	parseDate(val) {
		var parser = new d2lIntl.DateTimeParse(
			this.__language,
			{ locale: this.__overrides }
		);
		return parser.parseDate(val);
	}

	parseNumber(val, opts) {
		opts = opts || {};
		opts.locale = this.__overrides;
		var parser = new d2lIntl.NumberParse(this.__language, opts);
		return parser.parse(val);
	}

	parseTime(val) {
		var parser = new d2lIntl.DateTimeParse(this.__language);
		return parser.parseTime(val);
	}

	_startObserver() {
		var htmlElem = window.document.getElementsByTagName('html')[0];

		this._observer = new MutationObserver(function(mutations) {
			for (var i = 0; i < mutations.length; i++) {
				var mutation = mutations[i];
				if (mutation.attributeName === 'lang') {
					this.__documentLanguage = htmlElem.getAttribute('lang');
				} else if (mutation.attributeName === 'data-lang-default') {
					this.__documentLanguageFallback = htmlElem.getAttribute('data-lang-default');
				} else if (mutation.attributeName === 'data-intl-overrides') {
					this.__overrides = this._tryParseHtmlElemAttr('data-intl-overrides', {});
				} else if (mutation.attributeName === 'data-timezone') {
					this.__timezoneObject = this._tryParseHtmlElemAttr('data-timezone', {name: '', identifier: ''});
				}
			}
		}.bind(this));
		this._observer.observe(htmlElem, { attributes: true });
	}

	_generatePossibleLanguages(docLang, docFallbackLang) {
		var langs = [];

		if (docLang) {
			docLang = docLang.toLowerCase();
			langs.push(docLang);

			if (docLang.indexOf('-') !== -1) {
				var baseDocLang = docLang.split('-')[0];
				langs.push(baseDocLang);
			}
		}

		if (docFallbackLang) {
			docFallbackLang = docFallbackLang.toLowerCase();
			langs.push(docFallbackLang);

			if (docFallbackLang.indexOf('-') !== -1) {
				var baseDocFallbackLang = docFallbackLang.split('-')[0];
				langs.push(baseDocFallbackLang);
			}
		}

		langs.push('en-us', 'en');

		return langs;
	}

	_computeTimezone() {
		return this.__timezoneObject && this.__timezoneObject.name;
	}

	_languageChange() {
		this.dispatchEvent(new CustomEvent(
			'd2l-localize-behavior-language-changed', { bubbles: true, composed: true }
		));
	}

	_timezoneChange() {
		this.dispatchEvent(new CustomEvent(
			'd2l-localize-behavior-timezone-changed', { bubbles: true, composed: true }
		));
	}

	_onRequestResponse(newResources, language) {
		var propertyUpdates = {};
		propertyUpdates.resources = assign({}, this.__resources || {});
		propertyUpdates.resources[language] =
				assign(propertyUpdates.resources[language] || {}, newResources);
		this.__resources = propertyUpdates.resources;
	}

	_computeLocalize(language, resources, key) {
		var proto = this.constructor.prototype;
		this.checkLocalizationCache(proto);

		if (!key || !resources || !language || !resources[language])
			return;

		// Cache the key/value pairs for the same language, so that we don't
		// do extra work if we're just reusing strings across an application.
		var translatedValue = resources[language][key];

		if (!translatedValue) {
			return '';
		}

		var messageKey = key + translatedValue;
		var translatedMessage = proto.__localizationCache.messages[messageKey];

		if (!translatedMessage) {
			translatedMessage =
					new IntlMessageFormat(translatedValue, language);
			proto.__localizationCache.messages[messageKey] = translatedMessage;
		}

		var args = {};
		for (var i = 1; i < arguments.length; i += 2) {
			args[arguments[i]] = arguments[i + 1];
		}

		return translatedMessage.format(args);
	}

	_tryParseHtmlElemAttr(attrName, defaultValue) {
		var htmlElems = window.document.getElementsByTagName('html');
		if (htmlElems.length === 1 && htmlElems[0].hasAttribute(attrName)) {
			try {
				return JSON.parse(htmlElems[0].getAttribute(attrName));
			} catch (e) {
				// swallow exception
			}
		}
		return defaultValue;
	}
};

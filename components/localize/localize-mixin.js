import IntlMessageFormat from 'intl-messageformat/src/main.js';
window.IntlMessageFormat = IntlMessageFormat;

export const LocalizeMixin = superclass => class extends superclass {

	static get properties() {
		return {
			language: {type: String},
			langResources: { type: Object },
			__documentLanguage: { type: String },
			__documentLanguageFallback: { type: String }
		};
	}

	connectedCallback() {
		if (super.connectedCallback) {
			super.connectedCallback();
		}
	}

	constructor() {
		super();
		this.__documentLanguage = window.document.getElementsByTagName('html')[0].getAttribute('lang');
		this.__documentLanguageFallback = window.document.getElementsByTagName('html')[0].getAttribute('data-lang-default');
		this._startObserver();
	}

	firstUpdated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'langResources') {
				this._computeLanguage();
			}
		});
	}

	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'language') {
				this._languageChange();
			}
			// to do: add __timezoneObject which calls _timezoneChange()
		});
	}

	localize(key) {
		return this._computeLocalize(this.language, this.langResources, key);
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

	_computeLanguage() {
		this.language = this._tryResolve(this.langResources, this.__documentLanguage)
			|| this._tryResolve(this.langResources, this.__documentLanguageFallback)
			|| this._tryResolve(this.langResources, 'en-us');
	}

	_tryResolve(resources, val) {

		if (val === null) return null;
		val = val.toLowerCase();
		var baseLang = val.split('-')[0];

		var foundBaseLang = null;
		for (var key in resources) {
			var keyLower = key.toLowerCase();
			if (keyLower.toLowerCase() === val) {
				return key;
			} else if (keyLower === baseLang) {
				foundBaseLang = key;
			}
		}

		if (foundBaseLang) {
			return foundBaseLang;
		}

		return null;
	}

	_languageChange() {
		this.fire('d2l-localize-behavior-language-changed');
	}

	// _timezoneChange() {
	// 	this.fire('d2l-localize-behavior-timezone-changed');
	// }

	_computeLocalize(language, resources, key) {
		var proto = this.constructor.prototype;

		// Check if localCache exist just in case.
		this._checkLocalizationCache(proto);

		// Everytime any of the parameters change, invalidate the strings cache.
		if (!proto.__localizationCache) {
			proto['__localizationCache'] = {messages: {}};
		}
		proto.__localizationCache.messages = {};

		return function() {
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
		}.bind(this)();
	}

	_checkLocalizationCache(proto) {
		// do nothing if proto is undefined.
		if (proto === undefined)
			return;

		// In the event proto not have __localizationCache object, create it.
		if (proto['__localizationCache'] === undefined) {
			proto['__localizationCache'] = {messages: {}};
		}
	}
};

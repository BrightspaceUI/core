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
			__resources: { type: Object }
		};
	}

	connectedCallback() {
		super.connectedCallback();
	}

	constructor() {
		super();
		this.__documentLanguage = window.document.getElementsByTagName('html')[0].getAttribute('lang');
		this.__documentLanguageFallback = window.document.getElementsByTagName('html')[0].getAttribute('data-lang-default');
		this._startObserver();
	}

	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === '__documentLanguage' || propName === '__documentLanguageFallback') {
				this.__language = this.getLanguage(this.__documentLanguage, this.__documentLanguageFallback);
			} else if (propName === '__language') {
				this._languageChange();

				// Everytime language or resources change, invalidate the messages cache.
				var proto = this.constructor.prototype;
				this.checkLocalizationCache(proto);
				proto.__localizationCache.messages = {};

				this.getLangResources(this.__language)
					.then((res) => {
						if (!res) {
							// case where request was cached
							return;
						}
						this._onRequestResponse(res, this.__language);
					});
			}
			// to do: add __timezoneObject which calls _timezoneChange()
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

	_languageChange() {
		this.dispatchEvent(new CustomEvent(
			'd2l-localize-behavior-language-changed', { bubbles: true, composed: true }
		));
	}

	// _timezoneChange() {
	// 	this.fire('d2l-localize-behavior-timezone-changed');
	// }

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
};

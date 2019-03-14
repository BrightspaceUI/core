import IntlMessageFormat from 'intl-messageformat/src/main.js';
window.IntlMessageFormat = IntlMessageFormat;

// 	 Internal singleton cache. This is the private implementation of the
// 	 behaviour; don't interact with it directly.
var __localizationCache = {
	requests: {}, /* One iron-request per unique resources path. */
	messages: {}, /* Unique localized strings. Invalidated when the language,
					formats or resources change. */
	ajax: null		/* Global iron-ajax object used to request resource files. */
};

export const AppLocalizeBehavior = superclass => class extends superclass {

	/**
	Fired after the resources have been loaded.
	@event app-localize-resources-loaded
	*/

	/**
	Fired when the resources cannot be loaded due to an error.
	@event app-localize-resources-error
	*/

	static get properties() {
		return {
			language: {type: String},
			resources: {type: Object},
			formats: {
				type: Object,
				value: function() {
					return {
					}
				}
			},
			useKeyIfMissing: {type: Boolean, value: false},
			bubbleEvent: {type: Boolean, value: false}
		}
	}

	connectedCallback() {
		if (super.connectedCallback) {
			super.connectedCallback();
		}
	}

	constructor() {
		super();
		this.language = 'en';
	}

	localize(key) {
		return this.__computeLocalize(this.language, this.resources, key);
	}

	__computeLocalize(language, resources, key) {
		var proto = this.constructor.prototype;

		// Check if localCache exist just in case.
		this.__checkLocalizationCache(proto);

		// Everytime any of the parameters change, invalidate the strings cache.
		if (!proto.__localizationCache) {
			proto['__localizationCache'] = {requests: {}, messages: {}, ajax: null};
		}
		proto.__localizationCache.messages = {};

		return function() {
			if (!key || !resources || !language || !resources[language])
				return;

			// Cache the key/value pairs for the same language, so that we don't
			// do extra work if we're just reusing strings across an application.
			var translatedValue = resources[language][key];

			if (!translatedValue) {
				return this.useKeyIfMissing ? key : '';
			}

			var messageKey = key + translatedValue;
			var translatedMessage = proto.__localizationCache.messages[messageKey];

			if (!translatedMessage) {
				translatedMessage =
						new IntlMessageFormat(translatedValue, language, this.formats);
				proto.__localizationCache.messages[messageKey] = translatedMessage;
			}

			var args = {};
			for (var i = 1; i < arguments.length; i += 2) {
				args[arguments[i]] = arguments[i + 1];
			}

			return translatedMessage.format(args);
		}.bind(this)();
	}

	__checkLocalizationCache(proto) {
		// do nothing if proto is undefined.
		if (proto === undefined)
			return;

		// In the event proto not have __localizationCache object, create it.
		if (proto['__localizationCache'] === undefined) {
			proto['__localizationCache'] = {requests: {}, messages: {}, ajax: null};
		}
	}
};

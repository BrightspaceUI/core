import '@formatjs/intl-pluralrules/dist-es6/polyfill-locales.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import IntlMessageFormat from 'intl-messageformat';

export const LocalizeMixin = dedupeMixin(superclass => class extends superclass {

	static get properties() {
		return {
			__resources: { type: Object, attribute: false  }
		};
	}

	constructor() {
		super();

		this.__documentLocaleSettings = getDocumentLocaleSettings();
		this.__resourcesLoadedPromise = new Promise((resolve) => {
			let first = true;
			this.__languageChangeCallback = () => {
				if (!this._hasResources()) return;
				const possibleLanguages = this._generatePossibleLanguages();
				const localizeResources = this.constructor._getAllLocalizeResources(possibleLanguages);
				const resourcesLoadedPromise = Promise.all(localizeResources);
				resourcesLoadedPromise
					.then((results) => {
						if (results.length === 0) {
							return;
						}
						const resources = {};
						for (const res of results) {
							const language = res.language;
							for (const [key, value] of Object.entries(res.resources)) {
								resources[key] = { language, value };
							}
						}
						this.__resources = resources;
						if (first) {
							resolve();
							first = false;
						} else {
							this._languageChange();
						}
					});
			};
		});

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

		const ready = this.__resources !== undefined;
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

	localize(key) {

		if (!key || !this.__resources) {
			return '';
		}

		const resource = this.__resources[key];
		if (!resource) {
			return '';
		}
		const translatedValue = resource.value;

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

		const translatedMessage = new IntlMessageFormat(translatedValue, resource.language);
		let formattedMessage = translatedValue;
		try {
			formattedMessage = translatedMessage.format(params);
		} catch (e) {
			console.error(e);
		}
		return formattedMessage;

	}

	_generatePossibleLanguages() {
		const langs = new Set();

		let docLang = this.__documentLocaleSettings.language;
		if (docLang) {
			docLang = docLang.toLowerCase();
			langs.add(docLang);

			if (docLang.indexOf('-') !== -1) {
				const baseDocLang = docLang.split('-')[0];
				langs.add(baseDocLang);
			}
		}

		let docFallbackLang = this.__documentLocaleSettings.fallbackLanguage;
		if (docFallbackLang) {
			docFallbackLang = docFallbackLang.toLowerCase();
			langs.add(docFallbackLang);

			if (docFallbackLang.indexOf('-') !== -1) {
				const baseDocFallbackLang = docFallbackLang.split('-')[0];
				langs.add(baseDocFallbackLang);
			}
		}

		langs.add('en-us');
		langs.add('en');

		return Array.from(langs);
	}

	static _getAllLocalizeResources(possibleLanguages, config = this.localizeConfig) {
		let resourcesLoadedPromises;
		const superCtor = Object.getPrototypeOf(this);
		if ('_getAllLocalizeResources' in superCtor) {
			resourcesLoadedPromises = superCtor._getAllLocalizeResources(possibleLanguages, config);
		} else {
			resourcesLoadedPromises = [];
		}
		// eslint-disable-next-line no-prototype-builtins
		if (this.hasOwnProperty('getLocalizeResources') || this.hasOwnProperty('resources')) {
			const res = this.getLocalizeResources([...possibleLanguages], config);
			resourcesLoadedPromises.push(res);
		}
		return resourcesLoadedPromises;
	}

	async _getUpdateComplete() {
		await super._getUpdateComplete();
		const hasResources = this._hasResources();
		const resourcesLoaded = this.__resources !== undefined;
		if (!hasResources || resourcesLoaded) {
			return;
		}
		await this.__resourcesLoadedPromise;
	}

	_hasResources() {
		return this.constructor['getLocalizeResources'] !== undefined;
	}

	_languageChange() {
		this.dispatchEvent(new CustomEvent(
			'd2l-localize-behavior-language-changed', { bubbles: true, composed: true }
		));
	}

});

import '@formatjs/intl-pluralrules/dist-es6/polyfill-locales.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import IntlMessageFormat from 'intl-messageformat';

const markupMap = Object.freeze({
	'[b]': '<strong>',
	'[/b]': '</strong>',
	'[i]': '<em>',
	'[/i]': '</em>',
	'[br]': '<br>',
});

export const LocalizeMixin = dedupeMixin(superclass => class LocalizeMixinClass extends superclass {

	static get properties() {
		return {
			__resources: { type: Object, attribute: false  }
		};
	}

	static #markupRegex = new RegExp(Object.keys(markupMap).join('|').replace(/[[\]]/g, '\\$&'), 'g');

	static documentLocaleSettings = getDocumentLocaleSettings();

	constructor() {
		super();
		this.__resourcesLoadedPromise = new Promise((resolve) => {
			let first = true;
			this.__languageChangeCallback = () => {
				if (!this._hasResources()) return;
				const localizeResources = this.constructor._getAllLocalizeResources();
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
						this._onResourcesChange();
						if (first) {
							resolve();
							first = false;
						}
					});
			};
		});

		this.__updatedProperties = new Map();
	}

	static get markupRegex() {
		return LocalizeMixinClass.#markupRegex;
	}

	connectedCallback() {
		super.connectedCallback();
		this.constructor.documentLocaleSettings.addChangeListener(this.__languageChangeCallback);
		this.__languageChangeCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.constructor.documentLocaleSettings.removeChangeListener(this.__languageChangeCallback);
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

	async getUpdateComplete() {
		await super.getUpdateComplete();
		const hasResources = this._hasResources();
		const resourcesLoaded = this.__resources !== undefined;
		if (!hasResources || resourcesLoaded) {
			return;
		}
		await this.__resourcesLoadedPromise;
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

	localizeHTML(key, {
		...replacements
	} = {}) {
		return this.localize(key, {
			b: chunks => html`<strong>${chunks}</strong>`,
			br: () => html`<br>`,
			p: chunks => html`<p>${chunks}</p>`,
			...replacements
		});
	}

	static _generatePossibleLanguages(config) {

		if (config?.useBrowserLangs) return navigator.languages.map(e => e.toLowerCase()).concat('en');

		const { language, fallbackLanguage } = this.documentLocaleSettings;
		const langs = [ language, fallbackLanguage ]
			.filter(e => e)
			.map(e => [ e.toLowerCase(), e.split('-')[0] ])
			.flat();

		return Array.from(new Set([ ...langs, 'en-us', 'en' ]));
	}

	static _getAllLocalizeResources(config = this.localizeConfig) {
		let resourcesLoadedPromises = [];
		const superCtor = Object.getPrototypeOf(this);
		// get imported terms for each config, head up the chain to get them all
		if ('_getAllLocalizeResources' in superCtor) {
			const superConfig = Object.prototype.hasOwnProperty.call(superCtor, 'localizeConfig') && superCtor.localizeConfig.importFunc ? superCtor.localizeConfig : config;
			resourcesLoadedPromises = superCtor._getAllLocalizeResources(superConfig);
		}
		if (Object.prototype.hasOwnProperty.call(this, 'getLocalizeResources') || Object.prototype.hasOwnProperty.call(this, 'resources')) {
			const possibleLanguages = this._generatePossibleLanguages(config);
			const res = this.getLocalizeResources(possibleLanguages, config);
			resourcesLoadedPromises.push(res);
		}
		return resourcesLoadedPromises;
	}

	_hasResources() {
		return this.constructor['getLocalizeResources'] !== undefined;
	}

	_onResourcesChange() {
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-localize-resources-change'));
	}

});

export const linkGenerator = ({ href, target }) => {
	import('../components/link/link.js');
	return chunks => html`<d2l-link href="${ifDefined(href)}" target="${ifDefined(target)}">${chunks}</d2l-link>`;
};

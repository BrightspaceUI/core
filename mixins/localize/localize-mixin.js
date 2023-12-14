import '@formatjs/intl-pluralrules/dist-es6/polyfill-locales.js';
import { defaultLocale as fallbackLang, getDocumentLocaleSettings, supportedLangpacks } from '@brightspace-ui/intl/lib/common.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { getLocalizeOverrideResources } from '../../helpers/getLocalizeResources.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import IntlMessageFormat from 'intl-messageformat';

export const _LocalizeMixinBase = dedupeMixin(superclass => class LocalizeMixinClass extends superclass {

	static get properties() {
		return {
			__resources: { type: Object, attribute: false }
		};
	}

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

	async getUpdateComplete() {
		await super.getUpdateComplete();
		const hasResources = this._hasResources();
		const resourcesLoaded = this.__resources !== undefined;
		if (!hasResources || resourcesLoaded) {
			return;
		}
		await this.__resourcesLoadedPromise;
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

		const { language, value } = this.__resources?.[key] ?? {};
		if (!value) return '';

		let params = {};
		if (arguments.length > 1 && arguments[1]?.constructor === Object) {
			// support for key-value replacements as a single arg
			params = arguments[1];
		} else {
			// legacy support for localize-behavior replacements as many args
			for (let i = 1; i < arguments.length; i += 2) {
				params[arguments[i]] = arguments[i + 1];
			}
		}

		const translatedMessage = new IntlMessageFormat(value, language);
		let formattedMessage = value;
		try {
			if (Object.values(params).some(v => typeof v === 'function')) throw 'localize() does not support rich text.';
			formattedMessage = translatedMessage.format(params);
		} catch (e) {
			console.error(e);
		}

		return formattedMessage;
	}

	localizeHTML(key, params = {}) {

		const { language, value } = this.__resources?.[key] ?? {};
		if (!value) return '';

		const translatedMessage = new IntlMessageFormat(value, language);
		let formattedMessage = value;
		try {
			const unvalidated = translatedMessage.format({
				b: chunks => localizeMarkup`<b>${chunks}</b>`,
				br: () => localizeMarkup`<br>`,
				em: chunks => localizeMarkup`<em>${chunks}</em>`,
				i: chunks => localizeMarkup`<i>${chunks}</i>`,
				p: chunks => localizeMarkup`<p>${chunks}</p>`,
				strong: chunks => localizeMarkup`<strong>${chunks}</strong>`,
				...params
			});
			validateMarkup(unvalidated);
			formattedMessage = unvalidated;
		} catch (e) {
			console.error(e);
		}

		return formattedMessage;
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

export const LocalizeMixin = superclass => class extends _LocalizeMixinBase(superclass) {

	static async getLocalizeResources(langs, { importFunc, osloCollection, useBrowserLangs }) {

		// in dev, don't request unsupported langpacks
		if (!importFunc.toString().includes('switch') && !useBrowserLangs) {
			langs = langs.filter(lang => supportedLangpacks.includes(lang));
		}

		for (const lang of [...langs, fallbackLang]) {

			const resources = await Promise.resolve(importFunc(lang)).catch(() => {});

			if (resources) {

				if (osloCollection) {
					return await getLocalizeOverrideResources(
						lang,
						resources,
						() => osloCollection
					);
				}

				return {
					language: lang,
					resources
				};
			}
		}
	}

	static get localizeConfig() {
		return {};
	}

};

export const allowedTags = Object.freeze(['d2l-link', 'd2l-tooltip-help', 'p', 'br', 'b', 'strong', 'i', 'em', 'button']);

const markupError = `localizeHTML() rich-text replacements must use localizeMarkup templates with only the following allowed elements: ${allowedTags}. For more information, see: https://github.com/BrightspaceUI/core/blob/main/mixins/localize/`;
const validTerminators = '([>\\s/]|$)';
const allowedAfterTriangleBracket = `/?(${allowedTags.join('|')})?${validTerminators}`;
const disallowedTagsRegex = new RegExp(`<(?!${allowedAfterTriangleBracket})`);

function validateMarkup(content, applyRegex) {
	if (content) {
		if (content.map) return content.forEach(item => validateMarkup(item));
		if (content._localizeMarkup) return;
		if (Object.hasOwn(content, '_$litType$')) throw markupError;
		if (applyRegex && content.constructor === String && disallowedTagsRegex.test(content)) throw markupError;
	}
}

export function localizeMarkup(strings, ...expressions) {
	strings.forEach(str => validateMarkup(str, true));
	expressions.forEach(exp => validateMarkup(exp, true));
	return { ...html(strings, ...expressions), _localizeMarkup: true };
}

export function generateLink({ href, target }) {
	import('../../components/link/link.js');
	return chunks => localizeMarkup`<d2l-link href="${ifDefined(href)}" target="${ifDefined(target)}">${chunks}</d2l-link>`;
}

export function generateTooltipHelp({ contents }) {
	import('../../components/tooltip/tooltip-help.js');
	return chunks => localizeMarkup`<d2l-tooltip-help inherit-font-style text="${ifDefined(chunks)}">${contents}</d2l-tooltip-help>`;
}

import '@formatjs/intl-pluralrules/dist-es6/polyfill-locales.js';
import { defaultLocale as fallbackLang, getDocumentLocaleSettings, supportedLangpacks } from '@brightspace-ui/intl/lib/common.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { getLocalizeOverrideResources } from '../../helpers/getLocalizeResources.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import IntlMessageFormat from 'intl-messageformat';

export const allowedTags = Object.freeze(['d2l-link', 'd2l-tooltip-help', 'p', 'br', 'b', 'strong', 'i', 'em', 'button']);

const getDisallowedTagsRegex = allowedTags => {
	const validTerminators = '([>\\s/]|$)';
	const allowedAfterTriangleBracket = `/?(${allowedTags.join('|')})?${validTerminators}`;
	return new RegExp(`<(?!${allowedAfterTriangleBracket})`);
};

const disallowedTagsRegex = getDisallowedTagsRegex(allowedTags);
const noAllowedTagsRegex = getDisallowedTagsRegex([]);

const getLocalizeClass = (superclass = class {}) => class LocalizeClass extends superclass {

	static documentLocaleSettings = getDocumentLocaleSettings();
	pristine = true;
	#resourcesPromise;
	#resolveResourcesLoaded;

	#localeChangeCallback;
	async #defaultLocaleChangeCallback() {
		if (!this._hasResources()) return;

		const resourcesPromise = this.constructor._getAllLocalizeResources(this.config);
		this.#resourcesPromise = resourcesPromise;
		const localizeResources = (await resourcesPromise).flat(Infinity);
		if (this.#resourcesPromise !== resourcesPromise) return;

		const allResources = {};
		const resolvedLocales = new Set();
		for (const { language, resources } of localizeResources) {
			for (const [key, value] of Object.entries(resources)) {
				allResources[key] = { language, value };
				resolvedLocales.add(language);
			}
		}
		this.localize.resources = allResources;
		this.localize.resolvedLocale = resolvedLocales;
		if (resolvedLocales.size > 1) {
			console.warn(`Resolved multiple locales: ${[...resolvedLocales].join(', ')}`);
		}

		this.#onResourcesChange();

		if (this.pristine) {
			this.pristine = false;
			this.#resolveResourcesLoaded();
		}
	}

	#onResourcesChange() {
		this.dispatchEvent?.(new CustomEvent('d2l-localize-resources-change'));
		this.config?.onResourcesChange?.();
		this.onLocalizeResourcesChange?.();
	}

	connect(cb = () => this.#defaultLocaleChangeCallback()) {
		this.#localeChangeCallback = cb;
		LocalizeClass.documentLocaleSettings.addChangeListener(this.#localeChangeCallback);
		this.#localeChangeCallback();
	}

	disconnect() {
		LocalizeClass.documentLocaleSettings.removeChangeListener(this.#localeChangeCallback);
	}

	localize(key) {

		const { language, value } = this.localize.resources?.[key] ?? {};
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
			validateMarkup(formattedMessage, noAllowedTagsRegex);
			formattedMessage = translatedMessage.format(params);
		} catch (e) {
			if (e.name === 'MarkupError')	{
				e = new Error('localize() does not support rich text. For more information, see: https://github.com/BrightspaceUI/core/blob/main/mixins/localize/'); // eslint-disable-line no-ex-assign
				formattedMessage = '';
			}
			console.error(e);
		}

		return formattedMessage;
	}

	localizeHTML(key, params = {}) {

		const { language, value } = this.localize.resources?.[key] ?? {};
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
			if (e.name === 'MarkupError') formattedMessage = '';
			console.error(e);
		}

		return formattedMessage;
	}

	__resourcesLoadedPromise = new Promise(r => this.#resolveResourcesLoaded = r);

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
		const resourcesLoadedPromises = [];
		const superCtor = Object.getPrototypeOf(this);
		// get imported terms for each config, head up the chain to get them all
		if ('_getAllLocalizeResources' in superCtor) {
			const superConfig = Object.prototype.hasOwnProperty.call(superCtor, 'localizeConfig') && superCtor.localizeConfig.importFunc ? superCtor.localizeConfig : config;
			resourcesLoadedPromises.push(superCtor._getAllLocalizeResources(superConfig));
		}
		if (Object.prototype.hasOwnProperty.call(this, 'getLocalizeResources') || Object.prototype.hasOwnProperty.call(this, 'resources')) {
			const possibleLanguages = this._generatePossibleLanguages(config);
			const resourcesPromise = this.getLocalizeResources(possibleLanguages, config);
			resourcesLoadedPromises.push(resourcesPromise);
		}
		return Promise.all(resourcesLoadedPromises);
	}

	static async _getLocalizeResources(langs, { importFunc, osloCollection, useBrowserLangs }) {

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

	_hasResources() {
		return this.constructor.localizeConfig ? Boolean(this.constructor.localizeConfig.importFunc) : this.constructor.getLocalizeResources !== undefined;
	}

};

export const Localize = class extends getLocalizeClass() {

	static getLocalizeResources() {
		return super._getLocalizeResources(...arguments);
	}

	constructor(config) {
		super();
		this.config = config;
		this.connect();
	}

	get ready() {
		return this.__resourcesLoadedPromise;
	}

	connect() {
		super.connect();
		return this.ready;
	}

};

export const _LocalizeMixinBase = dedupeMixin(superclass => class LocalizeMixinClass extends getLocalizeClass(superclass) {

	#updatedProperties = new Map();

	connectedCallback() {
		super.connectedCallback();
		this.connect();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.disconnect();
		this.#updatedProperties.clear();
	}

	async getUpdateComplete() {
		await super.getUpdateComplete();
		const hasResources = this._hasResources();
		const resourcesLoaded = this.localize.resources !== undefined && !this.pristine;
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

		const ready = this.localize.resources !== undefined && !this.pristine;

		/* is this necessary? > */
		if (!ready) {
			changedProperties.forEach((oldValue, propName) => {
				this.#updatedProperties.set(propName, oldValue);
			});
			return false;
		}

		this.#updatedProperties.forEach((oldValue, propName) => {
			if (!changedProperties.has(propName)) {
				changedProperties.set(propName, oldValue);
			}
		});
		this.#updatedProperties.clear();
		/* < is this necessary? */

		return super.shouldUpdate(changedProperties);
	}

	onLocalizeResourcesChange() {
		this.requestUpdate('localize');
	}

});

export const LocalizeMixin = superclass => class extends _LocalizeMixinBase(superclass) {

	static getLocalizeResources() {
		return super._getLocalizeResources(...arguments);
	}

	static get localizeConfig() {
		return {};
	}

};

class MarkupError extends Error {
	name = this.constructor.name;
}

function validateMarkup(content, disallowedTagsRegex) {
	if (content) {
		if (content.forEach) {
			content.forEach(item => validateMarkup(item));
			return;
		}
		if (content._localizeMarkup) return;
		if (Object.hasOwn(content, '_$litType$')) throw new MarkupError('Rich-text replacements must use localizeMarkup templates. For more information, see: https://github.com/BrightspaceUI/core/blob/main/mixins/localize/');

		if (content.constructor === String && disallowedTagsRegex?.test(content)) throw new MarkupError(`Rich-text replacements may use only the following allowed elements: ${allowedTags}. For more information, see: https://github.com/BrightspaceUI/core/blob/main/mixins/localize/`);
	}
}

export function localizeMarkup(strings, ...expressions) {
	strings.forEach(str => validateMarkup(str, disallowedTagsRegex));
	expressions.forEach(exp => validateMarkup(exp, disallowedTagsRegex));
	return { ...html(strings, ...expressions), _localizeMarkup: true };
}

export function localizeMarkupIntl(strings, ...expressions) {
	strings.forEach(str => validateMarkup(str, disallowedTagsRegex));
	expressions.forEach(exp => validateMarkup(exp, disallowedTagsRegex));
	return strings.reduce((acc, i, idx) => {
		return acc.push(i, expressions[idx] ?? '') && acc;
	}, []).join('');
}

export function generateLink({ href, target }) {
	import('../../components/link/link.js');
	return chunks => localizeMarkup`<d2l-link href="${ifDefined(href)}" target="${ifDefined(target)}">${chunks}</d2l-link>`;
}

export function generateTooltipHelp({ contents }) {
	import('../../components/tooltip/tooltip-help.js');
	return chunks => localizeMarkup`<d2l-tooltip-help inherit-font-style text="${ifDefined(chunks)}">${contents}</d2l-tooltip-help>`;
}

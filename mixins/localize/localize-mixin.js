import { disallowedTagsRegex, getLocalizeClass, validateMarkup } from '@brightspace-ui/intl/lib/localize.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const _LocalizeMixinBase = dedupeMixin(superclass => class LocalizeMixinBaseClass extends getLocalizeClass(superclass) {

	constructor() {
		super();
		super.constructor.setLocalizeMarkup(localizeMarkup);
		if (super.constructor.documentLocaleSettings.pseudoLocalization?.isAvailable) {
			this.localize = (...args) => super.constructor.pseudoLocalize((...args) => super.localize(...args), ...args);
		}
	}

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

		return super.shouldUpdate(changedProperties);
	}

	onLocalizeResourcesChange() {
		this.requestUpdate('localize');
	}

	#updatedProperties = new Map();

});

export const LocalizeMixin = superclass => class extends _LocalizeMixinBase(superclass) {

	static getLocalizeResources() {
		return super._getLocalizeResources(...arguments);
	}

	static get localizeConfig() {
		return {};
	}

};

export function localizeMarkup(strings, ...expressions) {
	strings.forEach(str => validateMarkup(str, disallowedTagsRegex));
	expressions.forEach(exp => validateMarkup(exp, disallowedTagsRegex));
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

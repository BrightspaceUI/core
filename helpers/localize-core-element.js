import { LocalizeMixin } from '../mixins/localize/localize-mixin.js';

/**
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} LitElementConstructor
 */

/**
 * @template {LitElementConstructor} S
 * @param {S} superclass
 */
export const LocalizeCoreElement = superclass => class extends LocalizeMixin(superclass) {

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../lang/${lang}.js`)).default
		};
	}

};

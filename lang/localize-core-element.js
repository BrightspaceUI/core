import { LocalizeDynamicMixin } from '../mixins/localize-dynamic-mixin.js';

export const LocalizeCoreElement = superclass => class extends LocalizeDynamicMixin(superclass) {

	static get localizeConfig() {
		return {
			importFunc: async function(lang) {
				return await import(`./${lang}.js`).default;
			}
		};
	}

};

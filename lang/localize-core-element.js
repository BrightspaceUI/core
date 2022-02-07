import { LocalizeDynamicMixin } from '../mixins/localize-dynamic-mixin.js';

export const LocalizeCoreElement = superclass => class extends LocalizeDynamicMixin(superclass) {

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`./${lang}.js`)).default
		};
	}

};

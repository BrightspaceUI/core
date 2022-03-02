import { LocalizeDynamicMixin } from '../mixins/localize-dynamic-mixin.js';

export const LocalizeCoreElement = superclass => class extends LocalizeDynamicMixin(superclass) {

	static localizeConfig = {
		importFunc: async lang => (await import(`./${lang}.js`)).default
	};

};

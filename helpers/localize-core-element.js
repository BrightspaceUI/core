import { LocalizeDynamicMixin } from '../mixins/localize/localize-mixin.js';

export const LocalizeCoreElement = superclass => class extends LocalizeDynamicMixin(superclass) {

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../lang/${lang}.js`)).default
		};
	}

};

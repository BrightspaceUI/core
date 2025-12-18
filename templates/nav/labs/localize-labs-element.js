import { LocalizeDynamicMixin } from '../../../mixins/localize-dynamic-mixin.js';

export const LocalizeLabsElement = (superclass) => class extends LocalizeDynamicMixin(superclass) {

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`./lang/${lang}.js`)).default
		};
	}

};

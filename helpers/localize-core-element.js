import { LocalizeMixin } from '../mixins/localize/localize-mixin.js';

export const LocalizeCoreElement = superclass => class extends LocalizeMixin(superclass) {

	static get localizeConfig() {
		return {
			importFunc: async lang => {
				await new Promise(r => setTimeout(r, 2000));
				return (await import(`../lang/${lang}.js`)).default;
			},
			lazyLoad: true
		};
	}

};

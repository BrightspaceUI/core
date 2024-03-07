import { LoadingCompleteMixin } from '../../mixins/loading-complete/loading-complete-mixin.js';
import { LocalizeMixin } from '../mixins/localize/localize-mixin.js';

export const LocalizeCoreElement = superclass => class extends LoadingCompleteMixin(LocalizeMixin(superclass)) {

	static get localizeConfig() {
		return {
			importFunc: async lang => {
				await new Promise(r => setTimeout(r, 2000));
				const langterms = (await import(`../lang/${lang}.js`)).default;
				console.log('Loaded langterms');
				return langterms;
			},
			lazyLoad: true
		};
	}

};

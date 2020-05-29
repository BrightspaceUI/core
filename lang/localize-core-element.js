import { LocalizeMixin } from '../mixins/localize-mixin.js';

export const LocalizeCoreElement = superclass => class extends LocalizeMixin(superclass) {

	static async getLocalizeResources(langs) {
		let translations;
		for await (const lang of langs) {
			switch (lang) {
				case 'en':
					translations = await import('./en.js');
					break;
				case 'fr':
					translations = await import('./fr.js');
					break;
			}
			if (translations && translations.default) {
				return {
					language: lang,
					resources: translations.default
				};
			}
		}
		translations = await import('./en.js');
		return {
			language: 'en',
			resources: translations.default
		};
	}
};

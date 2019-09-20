import { LocalizeMixin } from './localize-mixin.js';

export const LocalizeStaticMixin = superclass => class extends LocalizeMixin(superclass) {

	static get resources() {
		return { 'en': {} };
	}

	static async getLocalizeResources(langs) {
		langs.forEach((lang) => {
			if (this.resources[lang] !== undefined) {
				return {
					language: lang,
					resources: this.resources[lang]
				};
			}
		});
		return {
			language: 'en',
			resources: this.resources['en']
		};
	}

};

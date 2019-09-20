import { LocalizeMixin } from './localize-mixin.js';

const fallbackLang = 'en';

export const LocalizeStaticMixin = superclass => class extends LocalizeMixin(superclass) {

	static async getLocalizeResources(langs) {
		let resolvedLang = fallbackLang;
		const resolvedResources = Object.assign({}, this.resources[fallbackLang]);

		langs.reverse().forEach((lang) => {
			if (this.resources[lang]) {
				resolvedLang = lang;
				Object.assign(resolvedResources, this.resources[lang]);
			}
		});

		return {
			language: resolvedLang,
			resources: resolvedResources
		};
	}

	static get resources() {
		return { 'en': {} };
	}

};

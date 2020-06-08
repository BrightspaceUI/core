import { LocalizeMixin } from '../mixins/localize-mixin.js';

export const LocalizeCoreElement = superclass => class extends LocalizeMixin(superclass) {

	static async getLocalizeResources(langs) {
		let translations;
		for await (const lang of langs) {
			switch (lang) {
				case 'ar':
					translations = await import('./ar.js');
					break;
				case 'da':
					translations = await import('./da.js');
					break;
				case 'de':
					translations = await import('./de.js');
					break;
				case 'en':
					translations = await import('./en.js');
					break;
				case 'es':
					translations = await import('./es.js');
					break;
				case 'fr':
					translations = await import('./fr.js');
					break;
				case 'ja':
					translations = await import('./ja.js');
					break;
				case 'ko':
					translations = await import('./ko.js');
					break;
				case 'nl':
					translations = await import('./nl.js');
					break;
				case 'pt':
					translations = await import('./pt.js');
					break;
				case 'sv':
					translations = await import('./sv.js');
					break;
				case 'tr-tr':
					translations = await import('./tr-tr.js');
					break;
				case 'tr':
					translations = await import('./tr.js');
					break;
				case 'zh-cn':
					translations = await import('./zh-cn.js');
					break;
				case 'zh-tw':
					translations = await import('./zh-tw.js');
					break;
				case 'zh':
					translations = await import('./zh.js');
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

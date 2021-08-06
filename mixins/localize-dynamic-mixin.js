import { getLocalizeOverrideResources } from '../helpers/getLocalizeResources.js';
import { LocalizeMixin } from './localize-mixin.js';

const fallbackLang = 'en';

export const LocalizeDynamicMixin = superclass => class extends LocalizeMixin(superclass) {

	static async getLocalizeResources(langs, { importFunc, osloCollection }) {

		// in dev, don't request unsupported langpacks
		if (!importFunc.toString().includes('switch')) {
			const supportedLangpacks = ['ar', 'cy', 'da', 'de', 'en', 'es-es', 'es', 'fi', 'fr-fr', 'fr', 'ja', 'ko', 'nl', 'pt', 'sv', 'tr', 'zh-tw', 'zh-cn'];
			langs = langs.filter(lang => supportedLangpacks.includes(lang));
		}

		for (const lang of [...langs, fallbackLang]) {

			const resources = await importFunc(lang).catch(() => {});

			if (resources) {

				if (osloCollection) {
					return await getLocalizeOverrideResources(
						lang,
						resources,
						() => osloCollection
					);
				}

				return {
					language: lang,
					resources
				};
			}
		}
	}

	static get localizeConfig() {
		return {};
	}

};

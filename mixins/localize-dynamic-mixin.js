import { getLocalizeOverrideResources } from '../helpers/getLocalizeResources.js';
import { LocalizeMixin } from './localize-mixin.js';

const fallbackLang = 'en';
const supportedLangpacks = ['ar', 'cy', 'da', 'de', 'en', 'en-gb', 'es', 'es-es', 'fr', 'fr-fr', 'fr-on', 'hi', 'ja', 'ko', 'nl', 'pt', 'sv', 'tr', 'zh-cn', 'zh-tw'];

export const LocalizeDynamicMixin = superclass => class extends LocalizeMixin(superclass) {

	static async getLocalizeResources(langs, { importFunc, osloCollection, useBrowserLangs }) {

		// in dev, don't request unsupported langpacks
		if (!importFunc.toString().includes('switch') && !useBrowserLangs) {
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

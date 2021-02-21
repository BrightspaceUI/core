import { getLocalizeOverrideResources } from '../helpers/getLocalizeResources.js';
import { LocalizeMixin } from './localize-mixin.js';

const defaultLangs = ['ar', 'cy-gb', 'cy', 'da', 'de', 'en', 'es-es', 'es', 'fr-ca', 'fr', 'ja', 'ko', 'nl', 'pt', 'sv', 'tr', 'zh-tw', 'zh'];
const fallbackLang = 'en';
const defaultExportName = 'default';

export const LocalizeDynamicMixin = superclass => class extends LocalizeMixin(superclass) {

	static get config() {
		return {};
	}

	static async getLocalizeResources(langs, config) {
		const { importFunc, osloCollection, supportedLangs = defaultLangs, exportName = defaultExportName } = config;

		for (const lang of [...langs, fallbackLang]) {

			if (supportedLangs.includes(lang)) {
				const mod = await importFunc(lang);
				const resources = mod[exportName];

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
	}
};

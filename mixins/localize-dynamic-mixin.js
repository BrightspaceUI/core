import { getLocalizeOverrideResources } from '../helpers/getLocalizeResources.js';
import { LocalizeMixin } from './localize-mixin.js';

const fallbackLang = 'en';

export const LocalizeDynamicMixin = superclass => class extends LocalizeMixin(superclass) {

	static async getLocalizeResources(langs, { importFunc, osloCollection }) {

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

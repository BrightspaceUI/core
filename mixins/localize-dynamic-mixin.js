import { getLocalizeOverrideResources } from '../helpers/getLocalizeResources.js';
import { LocalizeMixin } from './localize-mixin.js';

const fallbackLang = 'en';

function warnMissingFiles(failures, resolvedLang) {
	const { path } = failures[0].err.message.match(/https?:\/\/.*?\/(?<path>.*)\/.*\./).groups;
	const langs = failures.map(f => f.lang).join('","');
	console.warn(`Failed to load translation resources for languages "${langs}" from ${path}. Falling back to "${resolvedLang}".`);
}

export const LocalizeDynamicMixin = superclass => class extends LocalizeMixin(superclass) {

	static async getLocalizeResources(langs, { importFunc, osloCollection }) {
		const missingFiles = [];

		for (const lang of [...langs, fallbackLang]) {

			const resources = await importFunc(lang).catch(err => {
				// TypeErrors are unsupported languages that fail to be imported (404). Report them.
				// Errors are unsupported languages that are never imported and fall through. Supress them.
				// In either case fallback languages are used (e.g. gd-ie -> gd -> en)
				if (err.constructor === TypeError) missingFiles.push({ lang, err });
			});

			if (resources) {

				if (missingFiles.length) {
					warnMissingFiles(missingFiles, lang);
				}

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

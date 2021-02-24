import { getLocalizeOverrideResources } from '../helpers/getLocalizeResources.js';
import { LocalizeMixin } from './localize-mixin.js';

const fallbackLang = 'en';
const defaultExportName = 'default';

function warnMissingFiles(failures, resolvedLang) {
	const { path } = failures[0].err.message.match(/(?:https?:\/\/.*?\/)(?<path>.*)\/.*\./).groups;
	const langs = failures.map(f => f.lang).join('","');
	console.warn(
		'WARNING: Unacceptable in production. Consider Manually Retrieved Resources method.\n\n' +
		`Failed to load translation resources for languages "${langs}" from ${path}.`,
		`Falling back to "${resolvedLang}". `);
}

export const LocalizeDynamicMixin = superclass => class extends LocalizeMixin(superclass) {

	static get config() {
		return {};
	}

	static async getLocalizeResources(langs, config) {
		const { importFunc, osloCollection, exportName = defaultExportName } = config;
		const missingFiles = [];

		for (const lang of [...langs, fallbackLang]) {

			const mod = await importFunc(lang).catch(err => {
				// TypeErrors are unsupported languages that fail to be imported (404). Report them.
				// Errors are unsupported languages that are never imported and fall through. Supress them.
				// in either case fallback languages are used (e.g. gd-ie -> gd -> en)
				if (err.constructor === TypeError) missingFiles.push({ lang, err });
			});
			const resources = mod && mod[exportName];

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
};

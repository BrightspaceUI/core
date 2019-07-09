export async function getLocalizationResource(component, langs) {
	for (const lang of langs) {
		let translations;
		switch (lang) {
			case 'en':
				translations = await import('../generated/lang/en.js');
				break;
		}

		if (translations && translations[component]) {
			return {
				language: lang,
				resources: translations[component]
			};
		}
	}

	return null;
}

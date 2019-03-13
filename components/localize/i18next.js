import i18n from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';

var langDetectionOptions = {
	// order and from where user language should be detected
	order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

	// keys or params to lookup language from
	lookupQuerystring: 'lng',
	lookupCookie: 'i18next',
	lookupLocalStorage: 'i18nextLng',
	lookupFromPathIndex: 0,
	lookupFromSubdomainIndex: 0,

	// cache user language on
	caches: ['localStorage', 'cookie'],
	excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

	// optional expire and domain for set cookie
	cookieMinutes: 10,
	cookieDomain: 'myDomain',

	// optional htmlTag with lang attribute, the default is:
	htmlTag: document.documentElement
};

var initOptions = {
	fallbackLng: 'en',
	debug: false,
	detection: langDetectionOptions,
	ns: ['more-less'],
	load: 'all',
	backend: {
		loadPath: 'components/{{ns}}/locales/{{lng}}.json'
	}
};

export const i18next = i18n.use(LngDetector).use(Backend).init(initOptions);

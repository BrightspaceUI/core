import d2lIntl from 'd2l-intl';
import IntlMessageFormat from 'intl-messageformat';

let documentLanguage = 'en';
let documentLanguageFallback = 'en';
let hasInit = false;
const listeners = [];
let htmlElem = null;
let timezoneObject = {name: '', identifier: ''};
let overrides = {};

const observer = new MutationObserver((mutations) => {

	let changed = false;
	for (let i = 0; i < mutations.length; i++) {
		const mutation = mutations[i];
		if (mutation.attributeName === 'lang') {
			documentLanguage = htmlElem.getAttribute('lang');
			changed = true;
		} else if (mutation.attributeName === 'data-lang-default') {
			documentLanguageFallback = htmlElem.getAttribute('data-lang-default');
			changed = true;
		} else if (mutation.attributeName === 'data-intl-overrides') {
			overrides = tryParseHtmlElemAttr('data-intl-overrides', {});
		} else if (mutation.attributeName === 'data-timezone') {
			timezoneObject = tryParseHtmlElemAttr('data-timezone', {name: '', identifier: ''});
		}
	}

	if (changed) {
		listeners.forEach((cb) => cb(documentLanguage, documentLanguageFallback));
	}

});

function init() {

	if (hasInit) return;
	hasInit = true;

	htmlElem = window.document.getElementsByTagName('html')[0];
	documentLanguage = htmlElem.getAttribute('lang');
	documentLanguageFallback = htmlElem.getAttribute('data-lang-default');
	overrides = tryParseHtmlElemAttr('data-intl-overrides', {});
	timezoneObject = tryParseHtmlElemAttr('data-timezone', {name: '', identifier: ''});

	observer.observe(htmlElem, { attributes: true });

}

function tryParseHtmlElemAttr(attrName, defaultValue) {
	if (htmlElem.hasAttribute(attrName)) {
		try {
			return JSON.parse(htmlElem.getAttribute(attrName));
		} catch (e) {
			// swallow exception
		}
	}
	return defaultValue;
}

export function addListener(cb) {
	init();
	listeners.push(cb);
	cb(documentLanguage, documentLanguageFallback);
}

export function removeListener(cb) {
	const index = listeners.indexOf(cb);
	if (index < 0) return;
	listeners.splice(index, 1);
	if (listeners.length === 0) {
		observer.disconnect();
		hasInit = false;
	}
}

export function formatDateTime(language, val, opts) {
	opts = opts || {};
	opts.locale = overrides;
	opts.timezone = opts.timezone || timezoneObject.name;
	const formatter = new d2lIntl.DateTimeFormat(language, opts);
	return formatter.format(val);
}

export function formatDate(language, val, opts) {
	opts = opts || {};
	opts.locale = overrides;
	opts.timezone = opts.timezone || timezoneObject.name;
	const formatter = new d2lIntl.DateTimeFormat(language, opts);
	return formatter.formatDate(val);
}

export function formatFileSize(language, val) {
	const formatter = new d2lIntl.FileSizeFormat(language);
	return formatter.format(val);
}

export function formatNumber(language, val, opts) {
	opts = opts || {};
	opts.locale = overrides;
	const formatter = new d2lIntl.NumberFormat(language, opts);
	return formatter.format(val);
}

export function formatTime(language, val, opts) {
	opts = opts || {};
	opts.locale = overrides;
	opts.timezone = opts.timezone || timezoneObject.name;
	const formatter = new d2lIntl.DateTimeFormat(language, opts);
	return formatter.formatTime(val);
}

export function parseDate(language, val) {
	const parser = new d2lIntl.DateTimeParse(
		language,
		{ locale: overrides }
	);
	return parser.parseDate(val);
}

export function parseNumber(language, val, opts) {
	opts = opts || {};
	opts.locale = overrides;
	const parser = new d2lIntl.NumberParse(language, opts);
	return parser.parse(val);
}

export function parseTime(language, val) {
	const parser = new d2lIntl.DateTimeParse(language);
	return parser.parseTime(val);
}

export function getDocumentLanguage() {
	init();
	return documentLanguage;
}

export function getDocumentLanguageFallback() {
	init();
	return documentLanguageFallback;
}

export function getTimezone() {
	init();
	return timezoneObject;
}

export function localize(key, resources, language, replacements) {

	init();

	if (!key || !resources || !language) {
		return '';
	}

	const translatedValue = resources[key];
	if (!translatedValue) {
		return '';
	}

	const translatedMessage = new IntlMessageFormat(translatedValue, language);
	return translatedMessage.format(replacements);

}

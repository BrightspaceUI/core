# LocalizeMixin

The `LocalizeMixin` adds language resolution, timezone and locale overrides support.

## Automatic Language, Timezone and Override Support

The user's language, timezone and any D2L locale overrides are automatically fetched by `LocalizeMixin` from the `<html>` element's `lang`, `data-timezone` and `data-intl-overrides` attributes respectively.

## Usage

To use `LocalizeMixin` implement the following within your component (examples in "Language Resources"):
* `static async getLocalizeResources(langs)`:
	* `langs`: array of possible languages based upon `__documentLanguage` and `__documentLanguageFallback`. For example `['ar-dz', 'ar', 'en-us', 'en']`
	* Returns object containing `language` (the first language in the array that had resources available) and `resources` (the localization resources for that language). For example:
		```
		{
			"language":"ar",
			"resources":{"more":"المزيد","less":"أقل"}
		}
		```

Consume your web component in a page which has the lang attribute set on the <html> element:
```html
<html lang="ar">
	<head>
		<script type="module">
			import '../my-element.js';
		</script>
	</head>
	<body>
		<my-elem></my-elem>
	</body>
</html>
```

If the language of the page changes (via an update to the `lang` attribute on `<html>`), the mixin will automatically detect the change and re-render the web component. It will fire the event `d2l-localize-behavior-language-changed` when this occurs.

## Language Resources

* Always provide entries for base languages (e.g. "en", "fr", "pt") so that if the user is using a regional language (e.g. "en-gb", "fr-ca", "pt-br") which is missing, it can fall back to the base language.
* If there's no entry for a particular language, and no base language, the value of `data-lang-default` on the `<html>` element will be used.
* If no `data-lang-default` is specified, "en" will be used as a last resort.

### Resources in an Object Example

In this example the language resources for `ar` and `en` are stored in the `langResources` const within `getLocalizeResources`.

```javascript
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
class MyComponent extends LocalizeMixin(LitElement) {

	static async getLocalizeResources(langs) {
		const langResources = {
			'ar': {
				more: 'المزيد',
				less: 'أقل'
			},
			'en': {
				more: 'more',
				less: 'less'
			}
		};

		for (let i = 0; i < langs.length; i++) {
			if (langResources[langs[i]]) {
				return {
					language: langs[i],
					resources: langResources[langs[i]]
				};
			}
		}

		return null;
	}

	render() {
		return html`<div>${this.localize('more')}</div>`;
	}
}
```

### Dynamically Imported Resources Example

This is more ideal for components with many language resources for each language.

ar.js:
```javascript
export const val = {
	'more': 'المزيد',
	'less': 'أقل'
};
```

component:
```javascript
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
class MyComponent extends LocalizeMixin(LitElement) {
	/*
	* Retrieves the localization resources for language from a file.
	* Note that using "translations = await import(`./locales/${lang}.js`);)" does not work
	*/
	static async getLocalizeResources(langs) {
		for await (const lang of langs) {
			let translations;
			switch (lang) {
				case 'en':
					translations = await import('./locales/en.js');
					break;
				case 'ar':
					translations = await import('./locales/ar.js');
					break;
			}

			if (translations && translations.val) {
				return {
					language: lang,
					resources: translations.val
				};
			}
		}
		
		return null;
	}

	render() {
		return html`<div>${this.localize('more')}</div>`;
	}
}
```

## Available Functionality

### Text

Words/phrases with available translations can be localized based on available language resources using the `localize` function. In the example below, 'more' would have a corresponding language resource for different languages.

```javascript
this.localize('more')
```

### Numbers, File Sizes, Dates and Times

While [format.js](https://formatjs.io) has built-in support for date, time and number formatting, D2L has its own rules and also allows complex overriding of the standard locale settings (decimal separator, group separator, 24-hour clocks, etc.).

To support these custom rules, `LocalizeMixin` exposes several methods for formatting and parsing dates, times, numbers and file sizes. These simply leverage the [D2L Intl library](https://github.com/Brightspace/intl).

### Formatting Numbers (decimal and percent)

Use the `formatNumber` method for number formatting:

```javascript
this.formatNumber(1234567.89);
// -> '1,234,567.89' for en-CA
```

To round to various decimal places, use the options `minimumFractionDigits` (0-20, default is 0) and `maximumFractionDigits` (0-20, default is larger of `minimumFractionDigits` and 3):

```javascript
this.formatNumber(
	1234567.89,
	{maximumFractionDigits: 0}
);
// -> '1,234,568' for en-CA
```

To format as a percentage use the `style` option, which can be `decimal` (default) or `percent`:

```javascript
this.formatNumber(0.189, {style: 'percent'});
// -> '18.9 %' for en-CA
```

### Parsing Numbers

To parse user-inputted numbers, use the `parseNumber` method:

```javascript
this.parseNumber('1,234,567.890');
// -> '1234567.89' for en-CA
```

### Formatting Dates and Times

To format dates use the `formatDate` method. An optional `format` can be provided, which can be one of: `full`, `medium`, `short` (default), `monthYear` or `monthDay`.

```javascript
this.formatDate(new Date(2017, 11, 1));
// -> '12/1/2017' for en-CA

this.formatDate(
	new Date(2017, 11, 1),
	{format: 'full'}
);
// -> 'Friday, December 1, 2017' for en-CA
```

To format a time on its own, use the `formatTime` method. An optional `format` can be provided, which can be one of: `full`, `medium` or `short` (default):

```javascript
this.formatTime(new Date(2017, 11, 1, 17, 13));
// -> '5:13 PM' for en-CA

this.formatTime(
	new Date(2017, 11, 1, 17, 13),
	{format: 'full'}
);
// -> '5:13 PM <timezone-name>'
```

To format both a date and a time, use the `formatDateTime` method. Again, the optional `format` can be one of: `full`, `medium` or `short` (default):

```javascript
this.formatDateTime(new Date(2017, 11, 1, 17, 13));
// -> '12/1/2017 5:13 PM' for en-CA

this.formatDateTime(
	new Date(2017, 11, 1, 17, 13),
	{format: 'medium'}
);
// -> 'Dec 1, 2017 5:13 PM' for en-CA
```

### Parsing Dates and Times

To parse a user-entered date, use the `parseDate` method. It will return a [JavaScript Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object.

```javascript
var date = this.parseDate('12/1/2017');
date.getFullYear(); // -> 2017
date.getMonth(); // -> 11
date.getDate(); // -> 1
```

Similarly, `parseTime` can be used to parse user-entered times:

```javascript
var time = this.parseTime('5:13 PM');
time.getHours(); // -> 17
time.getMinutes(); // -> 13
```

### File Size Formatting

To format file sizes in the user's locale, use the `formatFileSize` method:

```javascript
time.formatFileSize(1234567.89);
// -> '1.18 MB' for en-CA
```

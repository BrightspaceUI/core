# Localization Mixins

The`LocalizeMixin` and `LocalizeStaticMixin` allow you to localize text and format & parse numbers, dates, times and file sizes.

## Localizing Text

### Providing Resources

To localize text, your component must provide resources by either implementing a static `resources` getter for local resources, or a `getLocalizeResources` method to fetch resources asynchronously. The `getLocalizeResources` method will be passed an array of lowercase languages in preferential order. These will be based on the language of the page (i.e. `<html lang="fr-ca">`) and D2L organization fallback language (i.e. `<html data-lang-default="fr">`).

Your implementation should find the resources that best match the languages passed in. It should then return an object containing two values:
- `language` (string): the language of the resources
- `resources` (object): localization resources for that language

### Language Resources

Resources should be key-value JSON objects, where the keys are lowercase strings and the values are in [ICU Message Syntax](https://formatjs.io/guides/message-syntax/) format.

The ICU Message Syntax supports some cool features, such as: [simple arguments](https://formatjs.io/guides/message-syntax/#simple-argument), the [`{select}` format](https://formatjs.io/guides/message-syntax/#select-format) and [pluralization](https://formatjs.io/guides/message-syntax/#plural-format).

**Note:** Avoid using the ICU Message Syntax number, date and time formatting functionality. D2L allows our users to customize how these are localized, so use the localize mixin's `formatNumber`, `formatDate` and `formatTime` instead.

Example:

```javascript
{
  "hello": "Hello {firstName}!",
  "goodbye": "Goodbye."
}
```

Always provide language resources for base languages (e.g. `en`, `fr`, `pt`, etc.). That way, if the user prefers a regional language (e.g. `fr-ca`) that isn't recognized, it can fall back to the base language.

### Static vs. Async Resources

For components with local resources, use the `LocalizeStaticMixin` and implement a `static` `resources` getter that returns the local resources. To get resources asynchronously, use the `LocalizeMixin` and implement `getLocalizedResources` as an `async` method.

#### Example 1: Static Resources

If your component has a small number of translations, it may make sense to store them locally within the component in a constant.

```javascript
import { LocalizeStaticMixin } from '@brightspace-ui/core/mixins/localize-static-mixin.js';

class MyComponent extends LocalizeStaticMixin(LitElement) {

  static get resources() {
    return {
      'en': {
        hello: 'Hello {firstName}!'
      },
      'fr': {
        hello: 'Bonjour {firstName}!'
      },
      ...
    };
  }

}
```

#### Example 2: Dynamically Imported Resources

This approach is better for components with many language resources. By importing them dynamically, only the resources for the requested language are actually fetched and downloaded.

Store your resources in individual files, one for each language:
```javascript
// en.js
export const val = {
  'hello': 'Hello {firstName}!'
};
```

Then dynamically import the matching file:
```javascript
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

class MyComponent extends LocalizeMixin(LitElement) {

  static async getLocalizeResources(langs) {
    for await (const lang of langs) {
      let translations;
      switch (lang) {
        case 'en':
          translations = await import('./locales/en.js');
          break;
        case 'fr':
          translations = await import('./locales/fr.js');
          break;
      }
      if (translations && translations.val) {
        return {
          language: lang,
          resources: translations.val
        };
      }
    }
    translations = await import('./locales/en.js');
    return {
      language: 'en',
      resources: translations.val
    };
  }

}
```

### `localize()`

Once your localization resources are available, the `localize()` method is used to localize a piece of text in your `render()` method.

If your localized string contains arguments, pass them as a key-value object as the 2nd parameter:

```javascript
render() {
  return html`<p>${this.localize('hello', {firstName: 'Mary'})}</p>`;
}
```

## Numbers, File Sizes, Dates and Times

While [format.js](https://formatjs.io) has built-in support for date, time and number formatting, D2L has its own rules and also allows complex overriding of the standard locale settings (decimal separator, group separator, 24-hour clocks, etc.).

To support these custom rules, the localization mixins expose several methods for formatting and parsing dates, times, numbers and file sizes. These simply leverage the [D2L Intl library](https://github.com/Brightspace/intl).

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

## Automatic Language, Timezone and Override Support

The user's language, timezone and any D2L locale overrides are automatically fetched by he localization mixins from the `<html>` element's `lang`, `data-timezone` and `data-intl-overrides` attributes respectively.

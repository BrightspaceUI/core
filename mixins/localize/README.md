# Localization Mixins

The `LocalizeMixin` and `LocalizeStaticMixin` allow you to localize text in your components and have it displayed to the user in their preferred language.

## Providing Resources

Your component must provide resources by either implementing a `resources` getter for local resources, or a `localizeConfig` getter to fetch resources asynchronously. The `importFunc` method of `localizeConfig` will be called with lowercase languages in preferential order.

## Language Resources

Resources should be key-value JSON objects, where the keys are lowercase strings and the values are in [ICU Message Syntax](https://formatjs.io/docs/core-concepts/icu-syntax/) format.

The ICU Message Syntax supports some cool features, such as: [simple arguments](https://formatjs.io/docs/core-concepts/icu-syntax/#simple-argument), the [`{select}` format](https://formatjs.io/docs/core-concepts/icu-syntax/#select-format) and [pluralization](https://formatjs.io/docs/core-concepts/icu-syntax/#plural-format).

**Note:** Avoid using the ICU Message Syntax number, date and time formatting functionality. D2L allows our users to customize how these are localized, so use [@brightspace-ui/intl](https://github.com/BrightspaceUI/intl)'s `formatNumber`, `formatDate` and `formatTime` instead.

Example:

```javascript
{
  "hello": "Hello {firstName}!",
  "goodbye": "Goodbye."
}
```

Always provide language resources for base languages (e.g. `en`, `fr`, `pt`, etc.). That way, if the user prefers a regional language (e.g. `pt-br`) that isn't recognized, it can fall back to the base language.

### Static vs. Dynamic Resources

For components with local resources, use the `LocalizeStaticMixin` and implement a `static` `resources` getter that returns the local resources synchronously. To get resources asynchronously, use the `LocalizeMixin` and implement a `static` `localizeConfig` getter that returns details about where to find your resources.

#### Example 1: Static Resources

If your component has a small number of translations, it may make sense to store them locally within the component in a constant.

```javascript
import { LocalizeStaticMixin } from '@brightspace-ui/core/mixins/localize/localize-mixin.js';

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
export default {
  'hello': 'Hello {firstName}!'
};
```

**Note:** To avoid accidental imports and errors, your resource files should have a dedicated directory with nothing else in it.

Then create your `localizeConfig` getter:
```javascript
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize/localize-mixin.js';

class MyComponent extends LocalizeMixin(LitElement) {

  static get localizeConfig() {
    return {
       // Import path must be relative
      importFunc: async lang => (await import(`../lang/${lang}.js`)).default,
      // Optionally enable OSLO
      osloCollection: '@d2l\\my-project\\myComponent',
    };
  }
}
```
Occasionally, it may be desirable to localize based on the user's browser settings. To do this, add `useBrowserLangs: true` to your `localizeConfig` object. This option should only be used if *all* supported *locales* have corresponding files named with their 4-character locale code, and all supported *languages*, in addition, have 2-character files. (e.g. `en-us.js`, `en-ca.js` and `en.js`)

If your build system does not support variable dynamic imports, you'll need to manually set up imports for each supported language:

```javascript
static get localizeConfig() {
  return {
    importFunc: async lang => {
      switch (lang) {
        case 'en':
          return (await import('./locales/en.js')).default;
        case 'fr':
          return (await import('./locales/fr.js')).default;
        ...
      }
    }
  };
}
```

**Note:** If using `LocalizeCoreElement` or a mixin that utilizes `LocalizeCoreElement` as well as `LocalizeMixin` or a mixin that uses `LocalizeMixin`, `LocalizeMixin` **must** appear before `LocalizeCoreElement` in the chain. For example:

```javascript
import { LocalizeCoreElement } from '@brightspace-ui/core/helpers/localize-core-element.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize/localize-mixin.js';

class MyComponent extends LocalizeMixin(LocalizeCoreElement(LitElement)) {
  ...
}
```

## `localize()`

Once your localization resources are available, the `localize()` method is used to localize a piece of text in your `render()` method.

If your localized string contains arguments, pass them as a key-value object as the 2nd parameter:

```javascript
render() {
  return html`<p>${this.localize('hello', { firstName: 'Mary' })}</p>`;
}
```

## `localizeHTML()`

Rich formatting can be included in localization resources and safely converted to HTML with the `localizeHTML()` method.

### Basic Formatting

The following formatting elements are supported out-of-the-box:

* `<p>paragraphs</p>`
* `line<br></br>breaks` (note the end tag is required)
* `<b>bold</b>`
* `<strong>strong</strong>`
* `<i>italic</i>`
* `<em>emphasis</em>`

Remember that `<strong>` is for content of greater importance (browsers show this visually using bold), while `<b>` only bolds the text visually without increasing its importance.

Similarly `<em>` *emphasizes* a particular piece of text (browsers show this visually using italics), whereas `<i>` only italicizes the text visually without emphasis.

### Links

To wrap text in [a link](../../components/link/), define a unique tag in the localization resource:

```json
{
  "myTerm": "Create a <linkNew>new assignment</linkNew>."
}
```

Then import the `generateLink` helper and use it to provide the `href` and optional `target` as replacements:

```javascript
import { generateLink } from '@brightspace-ui/core/mixins/localize/localize-mixin.js';

this.localizeHTML('myTerm', {
  linkNew: generateLink({ href: 'new.html', target: '_blank' })
});
```

### Help Tooltips

To use a [help tooltip](../../components/tooltip/), define a unique tag in the localization resource in addition to the tooltip's text:

```json
{
  "octopus": "An octopus is a member of the <tooltip>cephalopod</tooltip> family.",
  "cephalopodTooltip": "Cephalopods are members of the molluscan class Cephalopoda"
}
```

Then import `generateTooltipHelp` and pass it the tooltip term value:

```javascript
import { generateTooltipHelp } from '@brightspace-ui/core/mixins/localize/localize-mixin.js';

this.localizeHTML('octopus', {
  tooltip: generateTooltipHelp({ contents: this.localize('cephalopodTooltip') })
});
```

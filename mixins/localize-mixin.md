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

For components with local resources, use the `LocalizeStaticMixin` and implement a `static` `resources` getter that returns the local resources synchronously. To get resources asynchronously, use the `LocalizeDynamicMixin` and implement a `static` `localizeConfig` getter that returns details about where to find your resources.

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
export default {
  'hello': 'Hello {firstName}!'
};
```

**Note:** To avoid accidental imports and errors, your resource files should have a dedicated directory with nothing else in it.

Then create your `config` getter:
```javascript
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';

class MyComponent extends LocalizeDynamicMixin(LitElement) {

  static get localizeConfig() {
    return {
       // Import path must be relative
      importFunc: async lang => (await import(`../lang/${lang}.js`)).default,
      // Optionally enable OSLO
      osloCollection: 'my-project\\myComponent',
    };
  }
}
```

If your build system does not support variable dynamic imports, you'll need to manually set up imports for each language:

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

## `localize()`

Once your localization resources are available, the `localize()` method is used to localize a piece of text in your `render()` method.

If your localized string contains arguments, pass them as a key-value object as the 2nd parameter:

```javascript
render() {
  return html`<p>${this.localize('hello', {firstName: 'Mary'})}</p>`;
}
```
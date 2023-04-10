# LocalizeMixin

The `LocalizeMixin` allows text in components to be displayed in the user's preferred language.

## Language Resources

Resources are stored as key-value JSON objects.

### Keys

The key should succinctly and uniquely describe the text being localized. `camelCase` is recommended, although `snake_case` and `kebab-case` are also supported.

For large projects, terms may be grouped using the `:` character. For example: `parentGroup:subGroup:termName`.

### Values

Term values must conform to the [ICU Message Syntax](https://formatjs.io/docs/core-concepts/icu-syntax/) format. It supports features such as: [simple arguments](https://formatjs.io/docs/core-concepts/icu-syntax/#simple-argument), the [`{select}` format](https://formatjs.io/docs/core-concepts/icu-syntax/#select-format) and [pluralization](https://formatjs.io/docs/core-concepts/icu-syntax/#plural-format).

> **Note:** Avoid using the ICU Message Syntax number, date and time formatting functionality. Brightspace allows customization of how these are localized, so use [@brightspace-ui/intl](https://github.com/BrightspaceUI/intl)'s `formatNumber`, `formatDate` and `formatTime` instead.

### Files

Store localization resources in their own directory with nothing else in it. There should be one JavaScript file for each supported locale.

```javascript
// en.js
export default {
  "hello": "Hello {firstName}!"
};
```
```javascript
// fr.js
export default {
  "hello": "Bonjour {firstName}!"
};
```

Always provide language resources for base languages (e.g. `en`, `fr`, `pt`). That way, if the user prefers a regional language (e.g. `pt-br`) that isn't recognized, it can fall back to the base language (`pt`).

## Using `LocalizeMixin`

The component should import and extend `LocalizeMixin`:

```javascript
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize/localize-mixin.js';

class MyComponent extends LocalizeMixin(LitElement) {

}
```

Implement a static getter for `localizeConfig` that defines `importFunc()`. It will be passed a language which can subsequently be dynamically imported from the location of the component's resources.

The dynamic import path must be relative.

```javascript
static get localizeConfig() {
  return {
    importFunc: async lang => (await import(`../lang/${lang}.js`)).default,
  };
}
```

### `localize()`

The `localize()` method is used to localize a piece of text in the component's `render()` method.

If the localized string contains arguments, pass them as a key-value object as the 2nd parameter:

```javascript
render() {
  const message = this.localize('hello', { firstName: 'Mary' });
  return html`<p>${message}</p>`;
}
```

### `localizeHTML()`

Rich formatting can be included in localization resources and safely converted to HTML with the `localizeHTML()` method.

#### Basic Formatting

The following formatting elements are supported out-of-the-box:

* `<p>paragraphs</p>`
* `line<br></br>breaks` (note the end tag is required)
* `<b>bold</b>`
* `<strong>strong</strong>`
* `<i>italic</i>`
* `<em>emphasis</em>`

Remember that `<strong>` is for content of greater importance (browsers show this visually using bold), while `<b>` only bolds the text visually without increasing its importance.

Similarly `<em>` *emphasizes* a particular piece of text (browsers show this visually using italics), whereas `<i>` only italicizes the text visually without emphasis.

```json
{
  "myTerm": "This is <b>bold</b> but <em>not</em> all that <strong>important</strong>."
}
```

#### Links

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

#### Help Tooltips

To use a [help tooltip](../../components/tooltip/), define a unique tag in the localization resource in addition to the tooltip's text:

```json
{
  "octopus": "An octopus is a member of the <tooltip>cephalopod</tooltip> family.",
  "cephalopodTooltip": "Cephalopods are members of the molluscan class Cephalopoda"
}
```

Then import `generateTooltipHelp` and pass it the tooltip contents value:

```javascript
import { generateTooltipHelp } from '@brightspace-ui/core/mixins/localize/localize-mixin.js';

this.localizeHTML('octopus', {
  tooltip: generateTooltipHelp({ contents: this.localize('cephalopodTooltip') })
});
```

## Off-Stack Language Overrides

To enable OSLO, map the project's localization resources to a language collection in Brightspace by defining `osloCollection` in `localizeConfig`:

```javascript
static get localizeConfig() {
  return {
    osloCollection: '@d2l\\my-project\\myComponent',
  };
}
```

> **Important:** When defining language resource keys, avoid using the Full Stop (`.`) character for grouping. OSLO does not support it.

## Advanced

### Chaining `LocalizeMixin`

If combining `LocalizeMixin` with `LocalizeCoreElement` (or a mixin that uses `LocalizeCoreElement`), `LocalizeMixin` **must** appear before `LocalizeCoreElement` in the chain.

```javascript
import { LocalizeCoreElement } from '@brightspace-ui/core/helpers/localize-core-element.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize/localize-mixin.js';

class MyComponent extends LocalizeMixin(LocalizeCoreElement(LitElement)) {
  ...
}
```

### Ignoring the Brightspace Language

Occasionally, it may be desirable to localize based on the browser's language instead of the language in Brightspace.

To do this, define `useBrowserLangs` as `true` in `localizeConfig`. This option should only be used if all supported locales have corresponding files named with their 4-character and 2-character locale codes (e.g. `en-us.js`, `en-ca.js` and `en.js`).

# RtlMixin

> **Obsolete:** new uses of `RtlMixin` should not be introduced. Instead, use [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values).

The `RtlMixin` creates `dir` attributes on host elements based on the document's `dir`, enabling components to define RTL styles for elements within their shadow-DOMs via `:host([dir="rtl"])`. It is possible to opt-out our this behavior by explicitly setting a `dir` attribute (ex. for testing).

## Usage

Apply the mixin and define RTL styles.

```js
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl/rtl-mixin.js';
class MyComponent extends RtlMixin(LitElement) {
  static get styles() {
    return css`
      :host([dir="rtl"]) .some-elem {
        /* some RTL styles */
      }
    `;
  }
}
```

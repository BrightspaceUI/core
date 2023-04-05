# RtlMixin

The `RtlMixin` creates `dir` attributes on host elements based on the document's `dir`, enabling components to define RTL styles for elements within their shadow-DOMs via `:host([dir="rtl"])`. It is possible to opt-out our this behavior by explicitly setting a `dir` attribute (ex. for testing).

## Usage

Apply the mixin and define RTL styles.

```js
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
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

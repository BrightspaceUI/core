# Mixins

## LocalizeMixin

Please see the [LocalizeMixin README](localize-mixin.md).

## RtlMixin

The `RtlMixin` creates `dir` attributes on host elements based on the document's `dir`, enabling components to define RTL styles for elements within their shadow-DOMs via `:host([dir="rtl"])`. It is possible to opt-out our this behavior by explicitly setting a `dir` attribute (ex. for testing).

### Usage

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

## VisibleOnAncestorMixin

The `VisibleOnAncestorMixin` adds a behavior to a component so that it is initially hidden, and becomes visible when user hovers or focuses within an ancestor marked with the `d2l-visible-on-ancestor-target` class. It includes styles that must be included with the component. If the device does not support hovering, the element will be visible regardless of whether the user is hovering or focusing within the target.

### Usage

Apply the mixin and include the required `visibleOnAncestorStyles`.

```js
import { VisibleOnAncestorMixin, visibleOnAncestorStyles } from '@brightspace-ui/core/mixins/visible-on-ancestor-mixin.js';
class MyComponent extends VisibleOnAncestorMixin(LitElement) {
  static get styles() {
    return [ visibleOnAncestorStyles, css`/* MyComponent styles */` ];
  }
}
```

The consumer turns on the behavior using the `visible-on-ancestor` attribute and adds the `d2l-visible-on-ancestor-target` to the element in which hovering/focusing should show the element.

```html
<div class="d2l-visible-on-ancestor-target">
  ...
  <my-component visible-on-ancestor></my-component>
  ...
</div>
```

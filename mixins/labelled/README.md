# LabelMixin & LabelledMixin

The `LabelledMixin` enables elements within a custom element's shadowDOM to be labelled by elements within the DOM tree of its host. Normally this is not possible because referencing ids in other DOM scopes is not possible.

Custom elements that extend the `LabelledMixin` may be labelled by native elements, custom elements that extend `LabelMixin`, or by specifying an explicit label.

## Usage

Apply the `LabelledMixin` to the component containing the element that requires a label, and apply the `label` property defined by `LabelledMixin` as needed:

```js
import { LabelledMixin } from '@brightspace-ui/core/mixins/labelled-mixin.js';

class CustomInput extends LabelledMixin(LitElement) {
  render() {
    return html`
      <input type="text" aria-label="${ifDefined(this.label)}">
    `;
  }
}
```

Optionally, to enable custom elements to act as labels, extend the `LabelMixin` and call `updateLabel()` to reflect the label value change when needed. Alternatively, a custom element within a labelling element's shadowDOM may dispatch the `d2l-label-change` event to update the label value.

```js
import { LabelMixin } from '@brightspace-ui/core/mixins/labelled-mixin.js';

class CustomLabel extends LabelMixin(LitElement) {
  static get properties() {
    return {
      text: { type: String }
    };
  }
  render() {
    return html`
      <span>${this.text}</span>
    `;
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    this.updateLabel(this.text);
  }
}
```

Consumers can then label custom elements by referencing an `id` using the `LabelledMixin`'s `labelled-by` attribute, or specifying an explicit `label`:

```html
<!-- Labelling by referencing a native element -->
<d2l-custom-input labelled-by="label1"></d2l-custom-input>
<span id="label1">Label 1</span></td>

<!-- Labelling by referencing a custom element -->
<d2l-custom-input labelled-by="label2"></d2l-custom-input>
<d2l-custom-label id="label2" text="Label 2"></d2l-custom-label>

<!-- Labelling with an explicit label -->
<d2l-custom-input label="Explicit Label"></d2l-custom-input>
```

**Note:** the labelled element (specifying `labelled-by`) and the element it references must reside in the same DOM scope.

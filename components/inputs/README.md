# Inputs

There are various input components available:

- [Checkboxes (input-checkbox*)](docs/input-checkbox.md)
- [Color Input (input-color)](docs/input-color.md)
- [Date & Time Inputs (input-date, input-time, input-date-time)](docs/input-date-time.md)
- [Numeric Inputs (input-number, input-percent)](docs/input-numeric.md)
- [Radio Buttons (input-radio-*)](docs/input-radio.md)
- [Search (input-search)](docs/input-search.md)
- [Select Lists (input-select-styles)](docs/input-select-styles.md)
- [Text (input-text, input-styles, input-textarea)](docs/input-text.md)

## Labelling Inputs

All inputs *must* have a label. Web component-based inputs like `<d2l-input-checkbox>`, `<d2l-input-number>`, `<d2l-input-percent>`, `<d2l-input-search>`, `<d2l-input-text>`, and `<d2l-input-textarea>` come with built-in labels. For the rest, labelling is accomplished visually using a `<label>` element or with a hidden label via the `aria-label` attribute.

Groups of inputs (like checkboxes or radios) should be wrapped in a `<fieldset>` which can have label styles applied to it.

### Visible labels using the `<label>` element

Import the label styles and `RtlMixin` and include them in your component:

```javascript
import {inputLabelStyles} from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import {RtlMixin} from '@brightspace-ui/core/mixins/rtl/rtl-mixin.js';

class MyElem extends RtlMixin(LitElement) {

  static get styles() {
    return inputLabelStyles;
  }

}
```

Label styles are then applied using the `d2l-input-label` CSS class.

Wrap the input in a `<label>` element and apply the styles to a nested `<span>` element:

```html
<label>
  <span class="d2l-input-label">City</span>
  <select>...</select>
</label>
```

Alternately, associate the `<label>` with the input using the `for` and `id` attributes and apply the styles to the label directly:

```html
<label for="myInput" class="d2l-input-label">City</label>
<select id="myInput">...</select>
```

For required inputs, add the `d2l-input-label-required` CSS class to the label to get a visual indicator. Don't forget to add `aria-required="true"` to the input so that assistive technology is aware as well.

```html
<label for="myInput" class="d2l-input-label d2l-input-label-required">City</label>
<select id="myInput" aria-required="true">...</select>
```

### Hidden labels

If you wish to visually hide the label, use the `aria-label` attribute on your input instead:

```html
<select aria-label="City">...</select>
```

### Grouping inputs with `<fieldset>`

When a page contains multiple inputs which are related (for example to form an address), wrap the inputs with `<fieldset>` and `<legend>` elements. Then apply the `d2l-input-label-fieldset` and `d2l-input-label` CSS classes to the `<fieldset>` and `<legend>` elements respectively.

```html
<fieldset class="d2l-input-label-fieldset">
  <legend class="d2l-input-label">Shipping Address</legend>
  <!-- set of related inputs go here -->
</fieldset>
```

Alternately, the `<d2l-input-fieldset>` component can accomplish this for you. The legend can be visually hidden by applying the `label-hidden` attribute to the component.

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-fieldset.js';
</script>
<d2l-input-fieldset label="Shipping Address">
	<!-- set of related inputs go here -->
</d2l-input-fieldset>
```

## Future Enhancements

- Color input with contrast analysis
- Auto-growing textareas

Looking for an enhancement not listed here? Create a GitHub issue!

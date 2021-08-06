# Select Lists

A Select List allows the user to select a single option out of a relatively large number of items, or to reduce the visual prominence of an option selection.

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use to allow the user to select a single option from a relatively large list of options
* Use to save space / reduce the visual prominence of an exclusive selection option (instead of a choice from 8 radio buttons)
* Use a Select List to tuck away non-critical options, or options where the default selection is likely to be the most desirable.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use if your options are more than 1-2 words. The cognitive load of comparing options in a Select List is relatively high
* Select Lists show the available options offscreen – be careful if the selections you are asking the user to make are on the critical path – see [Dropdowns should be the UI of last resort](https://www.lukew.com/ff/entry.asp?1950) and be careful about your selection.
* Select Lists are form controls, and should not submit data or have instant actions on page occur without an explicit submit action.
Toggling progressive disclosure is OK
* Don't use prompt text in place of a Select List field label – it’s harder to scan and negatively impacts accessibility.
* Don't use for numeric input – a text field with type “number” or a date-picker is much easier to use control
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Applying styles to native select elements

Native `<select>` elements can be styled by importing `input-select-styles.js` into your LitElement and applying the `d2l-input-select` CSS class.

<!-- docs: start hidden content -->
![example screenshot of select inputs](../screenshots/select.gif?raw=true)
<!-- docs: end hidden content -->

Note: in order for RTL to function correctly, make sure your component uses the `RtlMixin`.

```javascript
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';
class MyElem extends RtlMixin(LitElement) {
  static get styles() {
    return selectStyles;
  }
  render() {
    return html`
      <select class="d2l-input-select">
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
      `;
  }
}
```

The example below uses a component similar to that in the code above which allows toggling of properties in order to see what those styles look like.

<!-- docs: demo live name:d2l-test-input-select -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/demo/input-select-test.js';
</script>
<d2l-test-input-select></d2l-test-input-select>
```

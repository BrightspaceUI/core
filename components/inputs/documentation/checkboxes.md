# Checkboxes

The `<d2l-input-checkbox>` element can be used to get a checkbox and optional visible label.

![example screenshot of checkbox input](../screenshots/checkbox.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-checkbox.js';
</script>
<d2l-input-checkbox checked>Label for checkbox</d2l-input-checkbox>
```

**Properties:**

- `aria-label` (String): set instead of placing label inside to hide the visible label
- `checked` (optional, Boolean): checked state
- `disabled` (optional, Boolean): disables the input
- `indeterminate` (optional, Boolean): sets checkbox to an indeterminate state
- `name` (optional, String): name of the input
- `not-tabbable` (optional, Boolean): sets `tabindex="-1"` on the checkbox
- `value` (optional, String): value of the input

**Methods:**

- `simulateClick()`: useful for testing, it simulates the user clicking on the checkbox, which toggles the state of the checkbox and fires the `change` event

**Events:**

When the checkbox's state changes, it dispatches the `change` event:


```javascript
checkbox.addEventListener('change', (e) => {
  console.log(checkbox.checked);
});
```

## Checkbox Spacer

To align related content below checkboxes, the `d2l-input-checkbox-spacer` element can be used:

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-checkbox.js';
  import '@brightspace-ui/core/components/inputs/input-checkbox-spacer.js';
</script>
<d2l-input-checkbox>Label for checkbox</d2l-input-checkbox>
<d2l-input-checkbox-spacer>
  Additional content can go here and will
  line up nicely with the edge of the checkbox.
</d2l-input-checkbox-spacer>
```

## Applying styles to native checkboxes

As an alternative to using the `<d2l-input-checkbox>` custom element, you can style a native checkbox inside your own element. Import `input-checkbox-styles.js` and apply the `d2l-input-checkbox` CSS class to the input:

```javascript
import { checkboxStyles } from '@brightspace-ui/core/components/inputs/input-checkbox-styles.js';

class MyElem extends LitElement {

  static get styles() {
    return checkboxStyles;
  }

  render() {
    return html`<input type="checkbox" class="d2l-input-checkbox">`;
  }

}
```

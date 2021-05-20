# TextAreas

## Text Area

The `<d2l-input-textarea>` is a wrapper around the native `<textarea>` element that provides auto-grow and validation behaviours. It's intended for inputting unformatted multi-line text.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-textarea.js';
</script>
<d2l-input-textarea
  label="Description"
  placeholder="Description of your topic."
  value="Some description..."></d2l-input-textarea>
```

### Accessibility

To make your usage of `d2l-input-textarea` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `aria-invalid` | [Indicate that the `textarea` value is invalid](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-invalid) |
| `description` | Use when label on `textarea` does not provide enough context. |
| `label` | **REQUIRED**  [Acts as a primary label on the `textarea`](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |

### How to Use

**Methods:**

| Method | Returns | Description |
|--|--|--|
| `focus()` | | Places focus in the `textarea` |
| `select()` | | Selects the contents of the `textarea` |

# Applying styles to native textarea

Native `<textarea>` elements can be styled by importing `input-styles.js` into your LitElement and applying the `d2l-input` CSS class.

![example screenshot of textarea inputs](../screenshots/textarea-styles.gif?raw=true)

```javascript
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
class MyElem extends LitElement {
  static get styles() {
    return inputStyles;
  }
  render() {
    return html`
      <textarea class="d2l-input">
      </textarea>
      `;
  }
}
```

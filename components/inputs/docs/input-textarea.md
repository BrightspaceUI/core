# TextAreas

The `<d2l-input-textarea>` is a wrapper around the native `<textarea>` element that provides auto-grow and validation behaviours. It's intended for inputting unformatted multi-line text.

![example screenshot of text input](../screenshots/textarea.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-textarea.js';
</script>
<d2l-input-textarea
  label="Description"
  placeholder="Description of your topic."
  value="Some description..."></d2l-input-textarea>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `aria-invalid` | String | Indicates that the `textarea` value is invalid |
| `description` | String | A description to be added to the `textarea` for accessibility |
| `disabled` | Boolean | Disables the `textarea` |
| `label` | String, required | Label for the `textarea` |
| `label-hidden` | Boolean | Hides the label visually (moves it to the `textarea`'s `aria-label` attribute) |
| `max-height` | String, default: 12rem | Maximum height of the input before scrolling. `none` allows `textarea` to grow infinitely. |
| `min-height` | String, default: none | Minimum height of the input. If `min-height` and `max-height` are equal then auto-grow will be disabled. |
| `maxlength` | Number | Imposes an upper character limit |
| `minlength` | Number | Imposes a lower character limit |
| `placeholder` | String | Placeholder text |
| `required` | Boolean | Indicates that a value is required |
| `value` | String, default: `''` | Value of the `textarea` |

**Accessibility:**

To make your usage of `d2l-input-textarea` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `aria-invalid` | [Indicate that the `textarea` value is invalid](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-invalid) |
| `description` | Use when label on `textarea` does not provide enough context. |
| `label` | **REQUIRED**  [Acts as a primary label on the `textarea`](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |

**Events:**

The `d2l-input-textarea` dispatches the `change` event when an alteration to the value is committed (typically after focus is lost) by the user. To be notified immediately of changes made by the user, use the `input` event.

```javascript
// dispatched when value changes are committed
textarea.addEventListener('change', (e) => {
  console.log(textarea.value);
});

// dispatched whenever value changes occur
textarea.addEventListener('input', (e) => {
  console.log(textarea.value);
});
```

## Applying styles to native textarea

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

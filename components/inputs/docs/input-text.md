# Text Inputs

The `<d2l-input-text>` element is a simple wrapper around the native `<input type="text">` tag. It's intended primarily for inputting generic text, email addresses and URLs.

![example screenshot of text input](../screenshots/text.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-text.js';
</script>
<d2l-input-text
  label="Label"
  placeholder="Enter some text"
  value="hello"></d2l-input-text>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `label` | String, required | Label for the input |
| `aria-haspopup` | String | Indicates that the input has a popup menu |
| `aria-invalid` | String | Indicates that the input value is invalid |
| `autocomplete` | String | Specifies which types of values [can be autofilled](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) by the browser |
| `autofocus` | Boolean | When set, will automatically place focus on the input |
| `description` | String | A description to be added to the `input` for accessibility |
| `disabled` | Boolean | Disables the input |
| `label-hidden` | Boolean | Hides the label visually (moves it to the input's `aria-label` attribute) |
| `max` | String | For number inputs, maximum value |
| `maxlength` | Number | Imposes an upper character limit |
| `min` | String | For number inputs, minimum value |
| `minlength` | Number | Imposes a lower character limit |
| `name` | String | Name of the input |
| `novalidate` | Boolean | Disables the built-in validation |
| `pattern` | String | Regular expression pattern to validate the value |
| `placeholder` | String | Placeholder text |
| `prevent-submit` | Boolean | Prevents pressing ENTER from submitting forms |
| `readonly` | Boolean | Makes the input read-only |
| `required` | Boolean | Indicates that a value is required |
| `size` | Number | Size of the input |
| `step` | String | For number inputs, sets the step size |
| `title` | String | Text for additional screenreader and mouseover context |
| `type` | String, default: `text` | Can be one of `text`, `email`, `password`, `tel`, `url`. Type `number` is deprecated, use [d2l-input-number](./input-number.md) instead. |
| `value` | String, default: `''` | Value of the input |

**Accessibility:**

To make your usage of `d2l-input-text` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `aria-haspopup` | [Indicate clicking the input opens a menu](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup). |
| `aria-invalid` | [Indicate that the input value is invalid](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-invalid) |
| `aria-label` | Use when `label` does not provide enough context. Only applies if no `label-hidden`. |
| `description` | Use when label on input does not provide enough context. |
| `label` | **REQUIRED**  [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `title` | Text for additional screen reader and mouseover context |

**Events:**

The `d2l-input-text` dispatches the `change` event when an alteration to the value is committed (typically after focus is lost) by the user. To be notified immediately of changes made by the user, use the `input` event.

**Slots:**
* `left`: Slot within the input on the left side. Useful for an `icon` or `button-icon`.
* `right`: Slot within the input on the right side. Useful for an `icon` or `button-icon`.


```javascript
// fired when value changes are committed
input.addEventListener('change', (e) => {
  console.log(input.value);
});

// fired whenever value changes occur
input.addEventListener('input', (e) => {
  console.log(input.value);
});
```

## Applying styles to native input

As an alternative to using the `<d2l-input-text>` custom element, you can style a native text input inside your own element. Import `input-styles.js` and apply the `d2l-input` CSS class to the input:

```javascript
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';

class MyElem extends LitElement {

  static get styles() {
    return inputStyles;
  }

  render() {
    return html`<input type="text" class="d2l-input">`;
  }

}
```

## Text Areas

Native `<textarea>` elements can be styled by importing `input-styles.js` into your LitElement and applying the `d2l-input` CSS class.

![example screenshot of textarea inputs](../screenshots/textarea.gif?raw=true)

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

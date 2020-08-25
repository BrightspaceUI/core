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

- `aria-haspopup` (String):  indicates that the input has a popup menu
- `aria-invalid` (String): indicates that the input value is invalid
- `autocomplete` (String): specifies which types of values [can be autofilled](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) by the browser
- `autofocus` (Boolean): when set, will automatically place focus on the input
- `disabled` (Boolean): disables the input
- `label` (String, required): label for the input
- `label-hidden` (Boolean): hides the label visually (moves it to the input's `aria-label` attribute)
- `max` (String): for number inputs, maximum value
- `maxlength` (Number): imposes an upper character limit
- `min` (String): for number inputs, minimum value
- `minlength` (Number): imposes a lower character limit
- `name` (String): name of the input
- `novalidate` (Boolean): disables built-in validation
- `pattern` (String): regular expression pattern to validate the value
- `placeholder` (String): placeholder text
- `prevent-submit` (Boolean): prevents pressing ENTER from submitting forms
- `readonly` (Boolean): makes the input read-only
- `required` (Boolean): indicates that a value is required
- `size` (Number): size of the input
- `step` (String): for number inputs, sets the step size
- `title` (String): text for additional screenreader and mouseover context
- `type` (String, default: `'text'`): can be one of `text`, `email`, `number`, `password`, `tel`, `url`
- `value` (String, default: `''`): value of the input

**Accessibility:**

To make your usage of `d2l-input-text` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `aria-haspopup` | [Indicate clicking the input opens a menu](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup). |
| `aria-invalid` | [Indicate that the input value is invalid](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-invalid) |
| `aria-label` | Use when `label` does not provide enough context. Only applies if no `label-hidden`. |
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

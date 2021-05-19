# Text Inputs

Text inputs allow users to input, edit, and select text.

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Make sure you include an obvious indication of what the field is for. Usually this means a label.
* Design the length of the text input to give the user a scent of how long the expected data should be.
* Ensure the label remains visible when a user focuses on the input using their mobile device. Often this means using a top-aligned label, but a left-aligned label with a very short text input can work also.
* Placeholder text is inaccessible so only use it for decorative or supporting text.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t use placeholder text as the label.
* Don’t use placeholder text if it is redundant (ie: “Click to start typing”)
* Don’t use placeholder text to communicate the required format of the input (ie: “YY/MM/DD”). Use help or label text for this.
* Don’t use different font sizes. Text should always be Compact.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Text Input

The `<d2l-input-text>` element is a simple wrapper around the native `<input type="text">` tag. It's intended primarily for inputting generic text, email addresses and URLs.

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-text.js';
</script>
<d2l-input-text
  label="Label"
  placeholder="Enter some text"
  value="hello"></d2l-input-text>
```

### Accessibility

To make your usage of `d2l-input-text` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `aria-haspopup` | [Indicate clicking the input opens a menu](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup). |
| `aria-invalid` | [Indicate that the input value is invalid](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-invalid) |
| `aria-label` | Use when `label` does not provide enough context. Only applies if no `label-hidden`. |
| `description` | Use when label on input does not provide enough context. |
| `label` | **REQUIRED**  [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `unit` | Use to render the unit (offscreen) as part of the label. |
| `title` | Text for additional screen reader and mouseover context |

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

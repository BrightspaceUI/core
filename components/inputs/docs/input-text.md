# Text & Textarea Inputs

Text inputs allow users to input, edit, and select text.

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-group.js';
  import '@brightspace-ui/core/components/inputs/input-text.js';
  import '@brightspace-ui/core/components/inputs/input-textarea.js';
</script>
<d2l-input-group>
  <d2l-input-text label="Name"></d2l-input-text>
  <d2l-input-textarea label="Description" max-rows="4" rows="4"></d2l-input-textarea>
</d2l-input-group>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Make sure you include an obvious indication of what the field is for. Usually this means a label.
* Design the length of the text input to give the user a scent of how long the expected data should be.
* Ensure the label remains visible when a user focuses on the input using their mobile device. Often this means using a top-aligned label, but a left-aligned label with a very short text input can work also.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t use placeholder text - support for this property is being removed. Find an alternative method of communicating text input instructions.
* Don’t use different font sizes. Text should always be Compact.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Text Input [d2l-input-text]

The `<d2l-input-text>` element is a simple wrapper around the native `<input type="text">` tag. It's intended primarily for inputting generic text, email addresses and URLs.

<!-- docs: demo code properties name:d2l-input-text sandboxTitle:'Text Input' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-text.js';
</script>
<d2l-input-text label="Label"></d2l-input-text>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `label` | String, required | Label for the input |
| `aria-haspopup` | String | Indicates that the input has a popup menu |
| `aria-invalid` | String | Indicates that the input value is invalid |
| `autocomplete` | String | Specifies which types of values [can be autofilled](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) by the browser |
| `autofocus` | Boolean | When set, will automatically place focus on the input |
| `description` | String | A description to be added to the `input` for accessibility |
| `disabled` | Boolean | Disables the input |
| `input-width` | String, default: `100%` | Restricts the maximum width of the input box without restricting the width of the label |
| `instructions` | String | Additional information relating to how to use the component |
| `label-hidden` | Boolean | Hides the label visually (moves it to the input's `aria-label` attribute) |
| `labelled-by` | String | HTML id of an element in the same shadow root which acts as the input's label |
| `max` | String | For number inputs, maximum value |
| `maxlength` | Number | Imposes an upper character limit |
| `min` | String | For number inputs, minimum value |
| `minlength` | Number | Imposes a lower character limit |
| `name` | String | Name of the form control. Submitted with the form as part of a name/value pair. |
| `novalidate` | Boolean | Disables the built-in validation |
| `pattern` | String | Regular expression pattern to validate the value |
| `pattern-failure-text` | String | Text to display when input fails validation against the pattern. If a list of characters is included in the message, use `LocalizeMixin`'s `localizeCharacter`. |
| `prevent-submit` | Boolean | Prevents pressing ENTER from submitting forms |
| `readonly` | Boolean | Makes the input read-only |
| `required` | Boolean | Indicates that a value is required |
| `size` | Number | Size of the input |
| `step` | String | For number inputs, sets the step size |
| `type` | String, default: `text` | Can be one of `text`, `email`, `password`, `tel`, `url`. Type `number` is deprecated, use [d2l-input-number](./input-number.md) instead. |
| `unit` | String | Unit associated with the input value, displayed next to input and announced as part of the label |
| `value` | String, default: `''` | Value of the input |

### Events

The `<d2l-input-text>` dispatches the `change` event when an alteration to the value is committed (typically after focus is lost) by the user. To be notified immediately of changes made by the user, use the `input` event.

```javascript
// dispatched when value changes are committed
input.addEventListener('change', (e) => {
  console.log(input.value);
});

// dispatched whenever value changes occur
input.addEventListener('input', (e) => {
  console.log(input.value);
});
```

### Slots

* `left`: Slot within the input on the left side. Useful for an `icon` or `button-icon`.
* `right`: Slot within the input on the right side. Useful for an `icon` or `button-icon`.
* `inline-help`: Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `<d2l-input-text>` accessible, use the following properties when applicable:

| Attribute | Description |
|---|---|
| `aria-haspopup` | [Indicate clicking the input opens a menu](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup). |
| `aria-invalid` | [Indicate that the input value is invalid](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-invalid) |
| `description` | Use when label on input does not provide enough context. |
| `label` | **REQUIRED**  [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `labelled-by` | Use when another visible element should act as the label |
| `unit` | Use to render the unit (offscreen) as part of the label. |

## Textarea Input [d2l-input-textarea]

The `<d2l-input-textarea>` is a wrapper around the native `<textarea>` element that provides auto-grow and validation behaviours. It's intended for inputting unformatted multi-line text.

<!-- docs: demo code properties name:d2l-input-textarea sandboxTitle:'Textarea Input' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-textarea.js';
</script>
<style>
  d2l-input-textarea {
    width: 100%;
  }
</style>
<d2l-input-textarea label="Description"></d2l-input-textarea>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `label` | String, required | Label for the `textarea` |
| `aria-invalid` | String | Indicates that the `textarea` value is invalid |
| `description` | String | A description to be added to the `textarea` for accessibility |
| `disabled` | Boolean | Disables the `textarea` |
| `label-hidden` | Boolean | Hides the label visually (moves it to the `textarea`'s `aria-label` attribute) |
| `labelled-by` | String | HTML id of an element in the same shadow root which acts as the input's label |
| `max-rows` | Number, default: 11 | Maximum number of rows before scrolling. Less than 1 allows `textarea` to grow infinitely. |
| `maxlength` | Number | Imposes an upper character limit |
| `minlength` | Number | Imposes a lower character limit |
| `name` | String | Name of the form control. Submitted with the form as part of a name/value pair. |
| `no-border` | Boolean | Hides the border |
| `no-padding` | Boolean | Removes left/right padding |
| `required` | Boolean | Indicates that a value is required |
| `rows` | Number, default: 5 | Minimum number of rows. If `rows` and `max-rows` are equal then auto-grow will be disabled. |
| `value` | String, default: `''` | Value of the `textarea` |

### Events

The `<d2l-input-textarea>` dispatches the `change` event when an alteration to the value is committed (typically after focus is lost) by the user. To be notified immediately of changes made by the user, use the `input` event.

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
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-input-textarea` accessible, use the following properties when applicable:

| Attribute | Description |
|---|---|
| `aria-invalid` | [Indicate that the `textarea` value is invalid](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-invalid) |
| `description` | Use when label on `textarea` does not provide enough context. |
| `label` | **REQUIRED**  [Acts as a primary label on the `textarea`](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `labelled-by` | Use when another visible element should act as the label |

### Methods

* `focus()`: Places focus in the `textarea`
* `select()`: Selects the contents of the `textarea`

# Text & Textarea Inputs

Text inputs allow users to input, edit, and select text.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-text.js';
  import '@brightspace-ui/core/components/inputs/input-textarea.js';
</script>
<style>
  div {
    width: 100%;
  }
  d2l-input-text {
    padding-bottom: 1rem;
  }
</style>
<div>
  <d2l-input-text label="Name"></d2l-input-text>
  <d2l-input-textarea label="Description" max-rows="4" rows="4"></d2l-input-textarea>
</div>
```

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

## Accessibility

Due to widespread popularity, users have a strong association that placeholder text in text inputs should appear “light gray” compared to active text colour. This has been confirmed in our own usability tests; any text that appears dark enough to pass WCAG AA colour contrast tests is also interpreted as “editable” by users.

Therefore in text inputs, placeholder text is a light colour (Mica), which fails colour contrast. Because of this, placeholder text should be used sparingly, and never be used to communicate crucial information unless that information is also made available to screen readers via an equivalent experience (hidden label, etc). Text which is decorative or supplemental is okay, as is using a hidden label which provides the same information.

## Text Input [d2l-input-text]

The `<d2l-input-text>` element is a simple wrapper around the native `<input type="text">` tag. It's intended primarily for inputting generic text, email addresses and URLs.

<!-- docs: demo code properties name:d2l-input-text -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-text.js';

  window.addEventListener('load', function () {
    var input = document.querySelector('#text');
    input.addEventListener('change', (e) => {
      console.log('input-text change: ', input.value);
    });
    input.addEventListener('input', (e) => {
      console.log('input-text input: ', input.value);
    });
  });
</script>
<d2l-input-text id="text" label="Label"></d2l-input-text>
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
| `input-width` | String, default: `100%` | Restricts the maximum width of the input box without impacting the width of the label |
| `instructions` | String | Additional information relating to how to use the component |
| `label-hidden` | Boolean | Hides the label visually (moves it to the input's `aria-label` attribute) |
| `labelled-by` | String | HTML id of an element in the same shadow root which acts as the input's label |
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
| `type` | String, default: `text` | Can be one of `text`, `email`, `password`, `tel`, `url`. Type `number` is deprecated, use [d2l-input-number](./input-number.md) instead. |
| `unit` | String | Unit associated with the input value, displayed next to input and announced as part of the label |
| `value` | String, default: `''` | Value of the input |

### Events

The `d2l-input-text` dispatches the `change` event when an alteration to the value is committed (typically after focus is lost) by the user. To be notified immediately of changes made by the user, use the `input` event.

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

To make your usage of `d2l-input-text` accessible, use the following properties when applicable:

| Attribute | Description |
|---|---|
| `aria-haspopup` | [Indicate clicking the input opens a menu](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup). |
| `aria-invalid` | [Indicate that the input value is invalid](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-invalid) |
| `aria-label` | Use when `label` does not provide enough context. Only applies if no `label-hidden`. |
| `description` | Use when label on input does not provide enough context. |
| `label` | **REQUIRED**  [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `labelled-by` | Use when another visible element should act as the label |
| `unit` | Use to render the unit (offscreen) as part of the label. |

## Applying styles to native text input

As an alternative to using the `<d2l-input-text>` custom element, you can style a native text input inside your own element. Import `input-styles.js` and apply the `d2l-input` CSS class to the input:

<!-- docs: demo code -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';

  class MyTextInputElem extends LitElement {

    static get styles() {
      return inputStyles;
    }

    render() {
      return html`<input type="text" class="d2l-input">`;
    }

  }
  customElements.define('d2l-my-text-input-elem', MyTextInputElem);
</script>
<d2l-my-text-input-elem></d2l-my-text-input-elem>
```

## Textarea Input [d2l-input-textarea]

The `<d2l-input-textarea>` is a wrapper around the native `<textarea>` element that provides auto-grow and validation behaviours. It's intended for inputting unformatted multi-line text.

<!-- docs: demo code properties name:d2l-input-textarea -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-textarea.js';

  window.addEventListener('load', function () {
    var input = document.querySelector('#textarea');
    input.addEventListener('change', (e) => {
      console.log('input-textarea change: ', input.value);
    });
    input.addEventListener('input', (e) => {
      console.log('input-textarea input: ', input.value);
    });
  });
</script>
<style>
  d2l-input-textarea {
    width: 100%;
  }
</style>
<d2l-input-textarea id="textarea" label="Description"></d2l-input-textarea>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `aria-invalid` | String | Indicates that the `textarea` value is invalid |
| `description` | String | A description to be added to the `textarea` for accessibility |
| `disabled` | Boolean | Disables the `textarea` |
| `label` | String, required | Label for the `textarea` |
| `label-hidden` | Boolean | Hides the label visually (moves it to the `textarea`'s `aria-label` attribute) |
| `labelled-by` | String | HTML id of an element in the same shadow root which acts as the input's label |
| `max-rows` | Number, default: 11 | Maximum number of rows before scrolling. Less than 1 allows `textarea` to grow infinitely. |
| `maxlength` | Number | Imposes an upper character limit |
| `minlength` | Number | Imposes a lower character limit |
| `no-border` | Boolean | Hides the border |
| `no-padding` | Boolean | Removes left/right padding |
| `placeholder` | String | Placeholder text |
| `required` | Boolean | Indicates that a value is required |
| `rows` | Number, default: 5 | Minimum number of rows. If `rows` and `max-rows` are equal then auto-grow will be disabled. |
| `value` | String, default: `''` | Value of the `textarea` |

### Events

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

## Applying styles to native textarea

Native `<textarea>` elements can be styled by importing `input-styles.js` into your LitElement and applying the `d2l-input` CSS class.

<!-- docs: demo code -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';

  class MyTextareaInputElem extends LitElement {
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
  customElements.define('d2l-my-textarea-input-elem', MyTextareaInputElem);
</script>
<d2l-my-textarea-input-elem></d2l-my-textarea-input-elem>
```

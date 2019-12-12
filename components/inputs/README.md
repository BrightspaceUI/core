# Inputs

There are various input components available:

- [Text](#text-inputs)
- [Text Areas](#text-areas)
- [Search](#search-inputs)
- [Select Lists](#select-lists)
- [Checkboxes](#checkboxes)
- [Radio Buttons](#radio-buttons)

## Labelling Inputs

All inputs *must* have a label. Web component-based inputs like `<d2l-input-checkbox>`, `<d2l-input-search>` and `<d2l-input-text>` come with built-in labels. For the rest, labelling is accomplished visually using a `<label>` element or with a hidden label via the `aria-label` attribute.

Groups of inputs (like checkboxes or radios) should be wrapped in a `<fieldset>` which can have label styles applied to it.

### Visible labels using the `<label>` element

![example screenshot of input label](./screenshots/label.png?raw=true)

Import the label styles and `RtlMixin` and include them in your component:

```javascript
import {labelStyles} from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import {RtlMixin} from '@brightspace-ui/core/mixins/rtl-mixin.js';

class MyElem extends RtlMixin(LitElement) {

  static get styles() {
    return labelStyles;
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

![example screenshot of required input](./screenshots/label-required.png?raw=true)

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

Alternately, the `<d2l-input-fieldset>` component can accomplish this for you:

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-fieldset.js';
</script>
<d2l-input-fieldset label="Shipping Address">
	<!-- set of related inputs go here -->
</d2l-input-fieldset>
```

## Text Inputs

The `<d2l-input-text>` element is a simple wrapper around the native `<input type="text">` tag. It's intended primarily for inputting generic text, email addresses and URLs.

![example screenshot of text input](./screenshots/text.gif?raw=true)

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
- `pattern` (String): regular expression pattern to validate the value
- `placeholder` (String): placeholder text
- `prevent-submit` (Boolean): prevents pressing ENTER from submitting forms
- `readonly` (Boolean): makes the input read-only
- `required` (Boolean): indicates that a value is required
- `size` (Number): size of the input
- `step` (String): for number inputs, sets the step size
- `type` (String, default: `'text'`): can be one of `text`, `email`, `number`, `password`, `tel`, `url`
- `value` (String, default: `''`): value of the input

**Events:**

The `d2l-input-text` dispatches the `change` event when text is entered, modified or removed:


```javascript
input.addEventListener('change', (e) => {
  console.log(input.value);
});
```

### Applying styles to native input

As an alternative to using the `<d2l-input-text>` custom element, you can style a native text input inside your own element. Import `input-styles.js` and apply the `d2l-input` CSS class to the input:

```javascript
import { inputStyles } from '@brightspace-ui/core/inputs/input-styles.js';

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

![example screenshot of textarea inputs](./screenshots/textarea.gif?raw=true)

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

## Search Inputs

For text searches use `<d2l-input-search>`, which wraps the native `<input type="search">` element.

![example screenshot of search input](./screenshots/search.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-search.js';
</script>
<d2l-input-search
  label="Search"
  value="Apples"
  placeholder="Search for fruit">
</d2l-input-search>
```

**Properties:**

- `label` (String, required): accessible label for the input
- `disabled` (Boolean): disables the input
- `maxlength` (Number): imposes an upper character limit
- `no-clear` (Boolean): prevents the "clear" button from appearing
- `placeholder` (String): placeholder text
- `value` (String, default: `''`): value of the input

**Events:**

The `d2l-input-search` component dispatches the `d2l-input-search-searched` event when a search is performed:

```javascript
search.addEventListener('d2l-input-search-searched', (e) => {
  // e.detail.value contains the search value
  console.log(e.detail.value);
});
```

When the input is cleared, the same event will be fired with an empty value.

## Select Lists

Native `<select>` elements can be styled by importing `input-select-styles.js` into your LitElement and applying the `d2l-input-select` CSS class.

![example screenshot of select inputs](./screenshots/select.gif?raw=true)

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

## Checkboxes

The `<d2l-input-checkbox>` element can be used to get a checkbox and optional visible label.

![example screenshot of checkbox input](./screenshots/checkbox.gif?raw=true)

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

### Checkbox Spacer

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

### Applying styles to native checkboxes

As an alternative to using the `<d2l-input-checkbox>` custom element, you can style a native checkbox inside your own element. Import `input-checkbox-styles.js` and apply the `d2l-input-checkbox` CSS class to the input:

```javascript
import { checkboxStyles } from '@brightspace-ui/core/inputs/input-checkbox-styles.js';

class MyElem extends LitElement {

  static get styles() {
    return checkboxStyles;
  }

  render() {
    return html`<input type="checkbox" class="d2l-input-checkbox">`;
  }

}
```

## Radio Buttons

Unlike checkboxes, individual radio buttons cannot be placed in a custom element. Items belonging to a radio group cannot span across different shadow roots -- all radios in the same group must be in the same shadow root.

As a result, we have to apply styles to native radio inputs.

Note: in order for RTL to function correctly, make sure your component uses the `RtlMixin`.

### Radio Inputs With Labels

The simplest way to apply radio styles is to use the `d2l-input-radio-label` CSS class on a `<label>` element that wraps the input.

![example screenshot of radio inputs](./screenshots/radio.gif?raw=true)

For disabled items, add the `d2l-input-radio-label-disabled` class on the label and the `disabled` attribute on the input itself.

```javascript
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { radioStyles } from '@brightspace-ui/core/components/inputs/input-radio-styles.js';

class MyElem extends RtlMixin(LitElement) {

  static get styles() {
    return radioStyles;
  }

  render() {
    return html`
      <label class="d2l-input-radio-label">
        <input type="radio" name="myGroup" selected>
        Option 1 (selected)
      </label>
      <label class="d2l-input-radio-label d2l-input-radio-label-disabled">
        <input type="radio" name="myGroup" disabled>
        Option 2 (disabled)
      </label>
      <label class="d2l-input-radio-label">
        <input type="radio" name="myGroup">
        Option 3
      </label>
    `;
  }

}
```

### Individual Radio Inputs

If you'd like to manually link the radio input with a label, or use an ARIA label, place the `d2l-radio-input` CSS class on the input itself to style it.

```javascript
import { radioStyles } from './input-radio-styles.js';

class MyElem extends LitElement {

  static get styles() {
    return radioStyles;
  }

  render() {
    return html`
      <input type="radio" class="d2l-input-radio" aria-label="Option 1">
    `;
  }

}
```

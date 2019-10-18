# Inputs

There are various input components available:

- [Text](#text-inputs)
- [Search](#search-inputs)
- [Select Lists](#select-lists)
- [Checkboxes](#checkboxes)
- [Radio Buttons](#radio-buttons)

## Text Inputs

The `<d2l-input-text>` element is a simple wrapper around the native `<input type="text">` tag. It's intended primarily for inputting generic text, email addresses and URLs.

![example screenshot of text input](./screenshots/text.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-text.js';
</script>
<d2l-input-text value="hello"></d2l-input-text>
```

**Properties:**

- `aria-invalid` (String): indicates that the input value is invalid
- `aria-label` (String): sets an accessible label
- `autocomplete` (String): specifies which types of values [can be autofilled](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) by the browser
- `autofocus` (Boolean): when set, will automatically place focus on the input
- `disabled` (Boolean): disables the input
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

Instead, apply styles to native radio inputs.

### Radio Inputs With Labels

The simplest way to apply radio styles is to use the `d2l-input-radio-label` CSS class on a `<label>` element that wraps the input.

![example screenshot of radio inputs](./screenshots/radio.gif?raw=true)

For disabled items, add the `d2l-input-radio-label-disabled` class on the label and the `disabled` attribute on the input itself.

```javascript
import { radioStyles } from './input-radio-styles.js';

class MyElem extends LitElement {

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

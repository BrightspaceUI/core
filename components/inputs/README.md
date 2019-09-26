# Inputs

There are various input components available:

- - [Text](#text-inputs)
- - [Search](#search-inputs)

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

- `aria-invalid` (optional, String): indicates that the input value is invalid
- `aria-label` (optional, String): sets an accessible label
- `autocomplete` (optional, String): specifies which types of values [can be autofilled](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) by the browser
- `autofocus` (optional, Boolean): when set, will automatically place focus on the input
- `disabled` (optional, Boolean): disables the input
- `max` (optional, String): for number inputs, maximum value
- `maxlength` (optional, Number): imposes an upper character limit
- `min` (optional, String): for number inputs, minimum value
- `minlength` (optional, Number): imposes a lower character limit
- `name` (optional, String): name of the input
- `pattern` (optional, String): regular expression pattern to validate the value
- `placeholder` (optional, String): placeholder text
- `prevent-submit` (optional, Boolean): prevents pressing ENTER from submitting forms
- `readonly` (optional, Boolean): makes the input read-only
- `required` (optional, Boolean): indicates that a value is required
- `size` (optional, Number): size of the input
- `step` (optional, String): for number inputs, sets the step size
- `type` (optional, String): can be one of `text` (default), `email`, `number`, `password`, `tel`, `url`
- `value` (optional, String): value of the input

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

- `disabled` (optional, Boolean): disables the input
- `label` (required, String): accessible label for the input
- `maxlength` (optional, Number): imposes an upper character limit
- `no-clear` (optional, Boolean): prevents the "clear" button from appearing
- `placeholder` (optional, String): placeholder text
- `value` (optional, String): value of the input

**Events:**

The `d2l-input-search` component dispatches the `d2l-input-search-searched` event when a search is performed:

```javascript
search.addEventListener('d2l-input-search-searched', (e) => {
  // e.detail.value contains the search value
  console.log(e.detail.value);
});
```

When the input is cleared, the same event will be fired with an empty value.

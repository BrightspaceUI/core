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

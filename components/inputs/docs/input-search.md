# Search Inputs

For text searches use `<d2l-input-search>`, which wraps the native `<input type="search">` element.

![example screenshot of search input](../screenshots/search.gif?raw=true)

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

**Accessibility:**

To make your usage of `d2l-input-search` accessible, use the following property when applicable:

| Attribute | Description |
|--|--|
| label | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Not visible. |

**Events:**

The `d2l-input-search` component dispatches the `d2l-input-search-searched` event when a search is performed:

```javascript
search.addEventListener('d2l-input-search-searched', (e) => {
  // e.detail.value contains the search value
  console.log(e.detail.value);
});
```

When the input is cleared, the same event will be fired with an empty value.

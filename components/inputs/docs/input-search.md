# Search Inputs

Search inputs allow users to input text, execute a search, and clear results. A search input may be used in conjunction with filters, sort, and/or auto-complete.

<!-- docs: demo -->
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

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Specify a label for the search input and include it as part of your design. (e.g. “Search Question Library”) This is typically hidden off-screen, but may be visible when warranted. Use your discretion.
* Add inline help to communicate when search is limited to specific facets. (e.g. “Search by question text or title”)
* Use “Search…” (ellipsis inclusive) for placeholder text to distinguish a search input from a straight-up text input.
* Place the search input in proximity to the content being searched. Best if directly above that content.
* Persist the search input on-screen if it is a primary or secondary action on the page. Otherwise consider a subtle button to trigger the search input.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use placeholder text as a label or to indicate which facets the search is limited to.
* Don't add a separate control for clearing search results. Use the “Clear Search” button in the search input.
* Don't rely on search as the only way for users to find things. There are other ways to support finding, including filters, categories, etc.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Search Input [d2l-input-search]

For text searches use `<d2l-input-search>`, which wraps the native `<input type="search">` element.

<!-- docs: demo code properties name:d2l-input-search -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-search.js';

  window.addEventListener('load', function () {
    document.querySelector('#search').addEventListener('d2l-input-search-searched', (e) => {
      console.log('searched term:', e.detail.value);
    });
  });
</script>
<d2l-input-search id="search" label="Search">
</d2l-input-search>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `label` | String, required | Acts as the primary label for the input. Not visible. |
| `description` | String | Additional information communicated to screenreaders when users focus on the input |
| `disabled` | Boolean | Disables the input |
| `maxlength` | Number | Imposes an upper character limit |
| `no-clear` | Boolean | Prevents the "clear" button from appearing |
| `search-on-input` | Boolean | Dispatch search events after each input event |
| `placeholder` | String, default:`'Search...'` | Placeholder text |
| `value` | String, default: `''` | Value of the input |

### Events

The `d2l-input-search` component dispatches the `d2l-input-search-searched` event when a search is performed:

```javascript
search.addEventListener('d2l-input-search-searched', (e) => {
  // e.detail.value contains the search value
  console.log(e.detail.value);
});
```

When the input is cleared, the same event will be fired with an empty value.

### Slots

* `inline-help`: Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
<!-- docs: end hidden content -->

## Accessbility

- While the component does not have a visible label, the search icon clearly indicates its purpose.
	- While not required to meet WCAG, this [pattern](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p07-icons-used/) is a great way to help individuals with cognitive accessibility needs.
	- The contrast ratio of the placeholder text can be safely ignored since the search icon serves the same purpose, and meets that criteria.
- It is important to note that `placeholder` is not a suitable replacement for using `label` or `description`, as once something is typed in, users will lose the context the placeholder provided.
- Using a helper like [`announce`](https://github.com/BrightspaceUI/core/blob/main/helpers/announce.js) to inform screenreaders when search results have been returned helps vision-impaired users to inform them that they can start looking through the results.
	- It can also be used to help confirm what exactly was searched, along with how many results were found.

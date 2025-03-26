# More/Less

The `d2l-more-less` element can be used to minimize the display of long content, while providing a way to reveal the full content.

## More-Less [d2l-more-less]

<!-- docs: demo code properties name:d2l-more-less sandboxTitle:'More-Less' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/more-less/more-less.js';
</script>
<d2l-more-less>
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</d2l-more-less>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `expanded` | Boolean | Specifies the expanded/collapsed state of the content |
| `h-align` | String | Possible values are undefined (default), `text` or `text-end`. If `text` or `text-end`, aligns the button content to the leading (or trailing) edge of text. |
| `height` | String, default: `'4em'` | Maximum height of the content when in "less" mode. The `d2l-more-less` element itself will take up additional vertical space for the fading effect as well as the more/less button itself. |
| `inactive` | Boolean | Whether the component is active or inactive |
<!-- docs: end hidden content -->

## Accessibility

The implementation of the `d2l-more-less` component follows the [W3C Disclosure (Show/Hide) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/). It is worth noting that the content that is visually hidden is not actually hidden from screen reader users since those users can interrupt the screen reader if they do not want to continue listening to the content.

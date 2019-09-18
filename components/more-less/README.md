# More-Less

The `d2l-more-less` element can be used to minimize the display of long content, while providing a way to reveal the full content.

![More-Less](./screenshots/more-less.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/more-less/more-less.js';
</script>
<d2l-more-less>
  Grumpy wizards make toxic brew for the evil Queen and Jack.
</d2l-more-less>
```

**Properties:**

- `expanded` (optional, Boolean): Specifies the expanded/collapsed state of the content
- `blur-color` (optional, String): Gradient HEX formatted color of the blurring effect (defaults to white).
- `h-align` (optional, String): `text` aligns the leading edge of text
- `height` (optional, String): Maximum height of the content when in "less" mode (defaults to 4em). The `d2l-more-less` element itself will take up additional vertical space for the fading effect as well as the more/less button itself.

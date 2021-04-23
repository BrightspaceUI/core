# Scroll Wrapper

The `d2l-scroll-wrapper` element can be used to wrap content which may overflow its horizontal boundaries, optionally providing left/right scroll buttons.

![scroll wrapper](./screenshots/scroll-wrapper.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/scroll-wrapper/scroll-wrapper.js';
</script>
<d2l-scroll-wrapper show-actions>
	<!-- content which may overflow horizontall -->
</d2l-scroll-wrapper>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `show-actions` | Boolean, default: `false` | Whether to show left/right scroll buttons |

Looking for an enhancement not listed here? Create a GitHub issue!

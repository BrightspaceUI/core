# d2l-floating-buttons

Floating workflow buttons behavior can be added by using the `<d2l-floating-buttons>` custom element. When the normal position of the workflow buttons is below the bottom edge of the viewport, they will dock at the bottom edge. When the normal position becomes visible, they will undock.

![Floating Buttons](./screenshots/floating-buttons.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/button/floating-buttons.js';
  import '@brightspace-ui/core/components/button/button.js';
</script>
<p>Some content</p>
<d2l-floating-buttons>
	<d2l-button primary>Save</d2l-button>
	<d2l-button>Cancel</d2l-button>
</d2l-floating-buttons>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `always-float` | Boolean | Indicates to display buttons as always floating |
| `min-height` | String, default: `'500px'` | The minimum height of the viewport to display floating buttons at (where applicable). If viewport is less than `min-height`, buttons will never appear floating (unless `always-float` is used). If viewport is greater than `min-height` then buttons will float when applicable. |

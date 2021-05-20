# Percent Inputs

The `<d2l-input-percent>` element is similar to `<d2l-input-number>`, except it provides a "%" symbol beside the number.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-percent.js';
</script>
<d2l-input-percent label="Label" value="100"></d2l-input-percent>
```

## Accessibility

To make your usage of `d2l-input-percent` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED.** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users. |
| `title` | Use for additional screen reader and mouseover context. |

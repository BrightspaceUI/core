# Number Inputs

The `<d2l-input-number>` element is similar to `<d2l-input-text>`, except it's intended for inputting numbers only.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-number.js';
</script>
<d2l-input-number label="Label" value="0"></d2l-input-number>
```

## Accessibility

To make your usage of `d2l-input-number` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED.** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users. |
| `unit` | Use to render the unit (offscreen) as part of the label. |
| `title` | Use for additional screen reader and mouseover context. |

## How to Use

### Integers Only

To accept only integer numbers, set `max-fraction-digits` to zero:

```html
<d2l-input-number label="Apples" max-fraction-digits="0">
</d2l-input-number>
```

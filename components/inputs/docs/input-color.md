# Color Inputs

Color inputs allow users to select a color from a palette and perform color contrast analysis.

> **Note**: Color inputs rely on functionality only available in the MVC framework, and can therefore only be used inside a MVC page. This restriction may go away in the future as more functionality is built into the color input web component itself.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-color.js';
</script>
<d2l-input-color type="foreground" value="#ff0000"></d2l-input-color>
```

## Color Input [d2l-input-color]

The `<d2l-input-color>` will open a dialog to allow the user to select a color from a palette.

<!-- docs: demo live name:d2l-input-color -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-color.js';
</script>
<d2l-input-color type="background" value="#00ff00"></d2l-input-color>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `associated-value` | String | Optional value of an associated color as a HEX which will be used for color contrast analysis. |
| `disabled` | Boolean, default: `false` | Disables the input. |
| `disallow-none` | Boolean, default: `false` | Disallows the user from selecting "None" as a color value. |
| `label` | String, required | Label for the input. Comes with a default value for background & foreground types. |
| `label-hidden` | Boolean, default: `false` | Hides the label visually. |
| `readonly` | Boolean, default: `false` | Puts the input into a read-only state. |
| `type` | String, default: `custom` | Type of color being chosen. Can be one of: `custom`, `background`, `foreground`. |
| `value` | Number | Value of the input. |

### Events

* `change`: Dispatched when the value is changed.

```javascript
// fired when value changes are committed
input.addEventListener('change', (e) => {
  console.log(input.value);
});
```
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-input-color` accessible, use the following properties when applicable:

| Attribute | Description |
|---|---|
| `label` | **REQUIRED** when type is `custom`. [Acts as a primary label for the button](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden. |

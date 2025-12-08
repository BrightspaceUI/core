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

<!-- docs: demo code properties name:d2l-input-color sandboxTitle:'Color Input' -->
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
| `name` | String | Name of the form control. Submitted with the form as part of a name/value pair. |
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

### Slots

* `inline-help`: Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
<!-- docs: end hidden content -->

## Accessibility

At its core, the color input is a button, so it relies on standard button semantics and adheres to [W3C's Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button) to ensure a smooth experience for all assistive technologies, but there are a few interesting details to note:

 * `label` is required if `type` is `custom`, since it acts as a primary label for the button
   * However, if `type` is set to `background` or `foreground` a simple default will be used if `label` is left empty
 * `label-hidden` can be used to hide the label when there is sufficient visual context for sighted users; the label will remain available to screen reader users who may lack the visual context
 * `associated-value` allows you to set a hex color against which the input's color contrast will be measured, which ensures end users will get appropriate warnings if they choose inaccessible color combinations
 * The color input remains focusable even when `disabled` or in `read-only` mode, so that users can access the tooltip giving the current value
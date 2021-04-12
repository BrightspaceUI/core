# Number Inputs

The `<d2l-input-number>` element is similar to `<d2l-input-text>`, except it's intended for inputting numbers only.

![example screenshot of number input](../screenshots/number.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-number.js';
</script>
<d2l-input-number label="Label" value="0"></d2l-input-number>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `label` | String, required | Label for the input. |
| `autocomplete` | String | Specifies which types of values [can be autofilled](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) by the browser. |
| `autofocus` | Boolean, default: `false` | When set, will automatically place focus on the input. |
| `disabled` | Boolean, default: `false` | Disables the input. |
| `input-width` | String, default: `4rem` | Restricts the maximum width of the input box without impacting the width of the label. |
| `label-hidden` | Boolean, default: `false` | Hides the label visually (moves it to the input's `aria-label` attribute). |
| `max` | Number | Maximum value allowed. |
| `max-exclusive` | Boolean, default: `false` | Indicates whether the max value is exclusive. |
| `max-fraction-digits` | Number, default: Greater of `minFractionDigits` or `3` | Maximum number of digits allowed after the decimal place. Must be between 0 and 20 and greater than or equal to `minFractionDigits` |
| `min` | Number | Minimum value allowed. |
| `min-exclusive` | Boolean, default: `false` | Indicates whether the min value is exclusive. |
| `min-fraction-digits` | Number, default: `0` | Minimum number of digits allowed after the decimal place. Must be between 0 and 20 and less than or equal to `maxFractionDigits` |
| `placeholder` | String | Placeholder text. |
| `required` | Boolean, default: `false` | Indicates that a value is required. |
| `title` | String | Text for additional screen reader and mouseover context. |
| `unit` | String | Unit associated with the input value, displayed next to input and announced as part of the label |
| `value` | Number | Value of the input. |

**Accessibility:**

To make your usage of `d2l-input-number` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED.** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users. |
| `unit` | Use to render the unit (offscreen) as part of the label. |
| `title` | Use for additional screen reader and mouseover context. |

**Events:**

* `change`: Dispatched when the value is changed. The `value` attribute reflects a JavaScript Number which is parsed from the formatted input value.

```javascript
// fired when value changes are committed
numberInput.addEventListener('change', (e) => {
  console.log(numberInput.value);
});
```

## Integers Only

To accept only integer numbers, set `max-fraction-digits` to zero:

```html
<d2l-input-number label="Apples" max-fraction-digits="0">
</d2l-input-number>
```
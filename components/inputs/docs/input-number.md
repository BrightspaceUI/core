# Number Inputs

The `<d2l-input-number>` element is similar to `<d2l-input-text>`, except it's intended for inputting numbers only.

![example screenshot of number input](../screenshots/number.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-number.js';
</script>
<d2l-input-number
  label="Label"
  value="0">
</d2l-input-number>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `label` | String, required | Label for the input. |
| `autocomplete` | String | Specifies which types of values [can be autofilled](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) by the browser. |
| `autofocus` | Boolean | When set, will automatically place focus on the input. |
| `disabled` | Boolean | Disables the input. |
| `label-hidden` | Boolean | Hides the label visually (moves it to the input's `aria-label` attribute). |
| `max` | Number | Maximum value allowed. |
| `max-fraction-digits` | Number | Maximum number of digits allowed after the decimal place. |
| `min` | Number | Minimum value allowed. |
| `min-fraction-digits` | Number | Minimum number of digits allowed after the decimal place. |
| `placeholder` | String | Placeholder text. |
| `required` | Boolean | Indicates that a value is required. |
| `value` | Number | Value of the input. |

**Accessibility:**

To make your usage of `d2l-input-number` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED.** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users. |

**Events:**

* `change`: Dispatched when the value is changed. The `value` attribute reflects a JavaScript Number which is parsed from the formatted input value.

```javascript
// fired when value changes are committed
numberInput.addEventListener('change', (e) => {
  console.log(numberInput.value);
});
```
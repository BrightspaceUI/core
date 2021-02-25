# Percent Inputs

The `<d2l-input-percent>` element is similar to `<d2l-input-number>`, except it provides a "%" symbol beside the number.

![example screenshot of number input](../screenshots/percent.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-percent.js';
</script>
<d2l-input-percent label="Label" value="100"></d2l-input-percent>
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
| `max-fraction-digits` | Number | Maximum number of digits allowed after the decimal place. |
| `min-fraction-digits` | Number | Minimum number of digits allowed after the decimal place. |
| `placeholder` | String | Placeholder text. |
| `required` | Boolean, default: `false` | Indicates that a value is required. |
| `title` | String | Text for additional screen reader and mouseover context. |
| `value` | Number | Value of the input. |

**Accessibility:**

To make your usage of `d2l-input-percent` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED.** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users. |
| `title` | Use for additional screen reader and mouseover context. |

**Events:**

* `change`: Dispatched when the value is changed. The `value` attribute reflects a JavaScript Number which is parsed from the formatted input value.

```javascript
// fired when value changes are committed
numberInput.addEventListener('change', (e) => {
  console.log(numberInput.value);
});
```

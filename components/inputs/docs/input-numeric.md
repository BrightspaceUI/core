# Numeric Inputs

Numeric inputs allow users to input numbers. These include the more generic `d2l-input-number`, as well as the percentage input `d2l-input-percent`.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-percent.js';
</script>
<style>
  d2l-input-number,
  d2l-input-percent {
    width: unset;
  }
</style>
<d2l-input-number label="Number Input"></d2l-input-number>
<d2l-input-percent label="Percent Input"></d2l-input-percent>
```

## Number Input [d2l-input-number]

The `<d2l-input-number>` element is similar to `<d2l-input-text>`, except it's intended for inputting numbers only.

<!-- docs: demo code properties name:d2l-input-number -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-number.js';

  window.addEventListener('load', function () {
    var input = document.querySelector('#number');
    input.addEventListener('change', (e) => {
      console.log('numeric value: ', input.value);
    });
  });
</script>
<d2l-input-number id="number" label="Label"></d2l-input-number>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `label` | String, required | Label for the input. |
| `autocomplete` | String | Specifies which types of values [can be autofilled](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) by the browser. |
| `autofocus` | Boolean, default: `false` | When set, will automatically place focus on the input. |
| `disabled` | Boolean, default: `false` | Disables the input. |
| `input-width` | String, default: `4rem` | Restricts the maximum width of the input box without impacting the width of the label. |
| `label-hidden` | Boolean, default: `false` | Hides the label visually (moves it to the input's `aria-label` attribute). |
| `labelled-by` | String | HTML id of an element in the same shadow root which acts as the input's label |
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

### Events

* `change`: Dispatched when the value is changed. The `value` attribute reflects a JavaScript Number which is parsed from the formatted input value.

```javascript
// fired when value changes are committed
numberInput.addEventListener('change', (e) => {
  console.log(numberInput.value);
});
```
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-input-number` accessible, use the following properties when applicable:

| Attribute | Description |
|---|---|
| `label` | **REQUIRED.** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users. |
| `labelled-by` | Use when another visible element should act as the label |
| `unit` | Use to render the unit (offscreen) as part of the label. |
| `title` | Use for additional screen reader and mouseover context. |

### Usage

**Integers Only:**

To accept only integer numbers, set `max-fraction-digits` to zero:

```html
<d2l-input-number label="Apples" max-fraction-digits="0">
</d2l-input-number>
```

## Percent Input [d2l-input-percent]

The `<d2l-input-percent>` element is similar to `<d2l-input-number>`, except it provides a "%" symbol beside the number.

<!-- docs: demo code properties name:d2l-input-percent -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-percent.js';

  window.addEventListener('load', function () {
    var input = document.querySelector('#percent');
    input.addEventListener('change', (e) => {
      console.log('percentage value: ', input.value);
    });
  });
</script>
<d2l-input-percent id="percent" label="Label"></d2l-input-percent>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `label` | String, required | Label for the input. |
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

### Events

* `change`: Dispatched when the value is changed. The `value` attribute reflects a JavaScript Number which is parsed from the formatted input value.

```javascript
// fired when value changes are committed
numberInput.addEventListener('change', (e) => {
  console.log(numberInput.value);
});
```
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-input-percent` accessible, use the following properties when applicable:

| Attribute | Description |
|---|---|
| `label` | **REQUIRED.** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users. |
| `title` | Use for additional screen reader and mouseover context. |

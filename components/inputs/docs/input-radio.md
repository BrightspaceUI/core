# Radio Inputs

Radio inputs are used in forms to offer a single choice among mutually exclusive options.

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-radio-group.js';
  import '@brightspace-ui/core/components/inputs/input-radio.js';
</script>
<d2l-input-radio-group label="Bread">
  <d2l-input-radio label="Whole wheat" checked></d2l-input-radio>
  <d2l-input-radio label="Baguette"></d2l-input-radio>
  <d2l-input-radio label="Marble Rye"></d2l-input-radio>
</d2l-input-radio-group>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use as an input for traditional forms
* Use when there are 3 or more mutually exclusive options
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t use two radio inputs if a single checkbox works better
* Don’t use for triggering an immediate action. Notable exceptions are forms that autosave with clear indication and as a trigger for progressive disclosure on traditional forms, so long as users are made aware that new options have been made available.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Radio Input Group [d2l-input-radio-group]

The group is a required parent of `<d2l-input-radio>`. It internally renders a `<fieldset>` and `<legend>` with the provided `label`, which gives additional accessibility context. The label can be hidden visually if desired.

When provided with a `name`, the group will participate in forms with the `value` of the currently checked input.

<!-- docs: demo code properties name:d2l-input-radio-group sandboxTitle:'Checkbox Group' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-radio.js';
  import '@brightspace-ui/core/components/inputs/input-radio-group.js';
</script>
<d2l-input-radio-group label="Bread" name="bread">
  <d2l-input-radio label="Whole wheat" value="whole-wheat" checked></d2l-input-radio>
  <d2l-input-radio label="Baguette" value="baguette"></d2l-input-radio>
  <d2l-input-radio label="Marble Rye" value="marble-rye"></d2l-input-radio>
</d2l-input-radio-group>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `label` | String, required | Label for the group of radio inputs |
| `label-hidden` | Boolean | Hides the label visually |
| `name` | String | Name of the form control. Submitted with the form as part of a name/value pair. |
| `required` | Boolean | Indicates that a value is required |

### Events

When the radio group's state changes, it dispatches the `change` event:

```javascript
group.addEventListener('change', e => {
  const newValue = e.target.detail.value;
  const oldValue = e.target.detail.oldValue; // may be undefined
});
```
<!-- docs: end hidden content -->

## Radio Input [d2l-input-radio]

The `<d2l-input-radio>` element represents an option within its parent `<d2l-input-radio-group>`.

<!-- docs: demo code properties name:d2l-input-radio sandboxTitle:'Radio Input' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-radio.js';
  import '@brightspace-ui/core/components/inputs/input-radio-group.js';
</script>
<d2l-input-radio-group label="Bread" name="bread">
  <d2l-input-radio label="Whole wheat" value="whole-wheat" checked></d2l-input-radio>
  <d2l-input-radio label="Baguette" value="baguette"></d2l-input-radio>
  <d2l-input-radio label="Marble Rye" value="marble-rye"></d2l-input-radio>
</d2l-input-radio-group>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `label` | String, required | Label for the input |
| `checked` | Boolean | Checked state |
| `description` | String | Additional information communicated to screenreader users when focusing on the input |
| `disabled` | Boolean | Disables the input |
| `supporting-hidden-when-unchecked` | Boolean | Hides the supporting slot when unchecked |
| `value` | String | Value of the input |

### Slots

* `inline-help`: Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
* `supporting`: Supporting information which will appear below and be aligned with the input.
<!-- docs: end hidden content -->

## Accessibility

The `d2l-input-radio-group` and `d2l-input-radio` components follow W3C's best practice recommendations for a [radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/).

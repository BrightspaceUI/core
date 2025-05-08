# Checkbox Input

Checkboxes are used in forms to toggle an option or preference. They may be grouped to form a set of options.

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-checkbox.js';
  import '@brightspace-ui/core/components/inputs/input-checkbox-group.js';
</script>
<d2l-input-checkbox-group label="Toppings">
  <d2l-input-checkbox label="Ketchup" checked></d2l-input-checkbox>
  <d2l-input-checkbox label="Mustard"></d2l-input-checkbox>
  <d2l-input-checkbox label="Relish"></d2l-input-checkbox>
</d2l-input-checkbox-group>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use in a form to indicate an option or preference
* Use to allow the user to select multiple, independent options from a set
* When multiple options are presented together, [wrap them in a group](#d2l-input-checkbox-group)
* Use an indeterminate state to indicate a mixed state where some child items are checked and some are not
* Use as progressive disclosure in forms, so long as users are made aware both visually and non-visually that new options have been made available
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use as a toggle that performs an immediate action, use a Switch component
* Don't use for mutually exclusive options, use radio input groups
* Don't use labels as “instructions” or “phrases”. Good label: “Visible to Students”. Bad label: (“Check this to make it visible to students”)
* Don't use labels to describe the default or “off” state of the option. As much as possible, use the label to refer to the “on” state. Good label: “Visible”. Bad label: “Hidden”.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Checkbox Input Group [d2l-input-checkbox-group]

When multiple checkboxes are displayed together, wrap them in a `<d2l-input-checkbox-group>`.

This will not only provide consistent spacing between checkboxes, but the group also internally renders a `<fieldset>` and `<legend>` with the provided `label`, which gives additional accessibility context. The label can be hidden visually if desired.

<!-- docs: demo code properties name:d2l-input-checkbox-group sandboxTitle:'Checkbox Group' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-checkbox.js';
  import '@brightspace-ui/core/components/inputs/input-checkbox-group.js';
</script>
<d2l-input-checkbox-group label="Toppings">
  <d2l-input-checkbox label="Ketchup"></d2l-input-checkbox>
  <d2l-input-checkbox label="Mustard"></d2l-input-checkbox>
  <d2l-input-checkbox label="Relish"></d2l-input-checkbox>
</d2l-input-checkbox-group>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `label` | String, required | Label for the group of checkboxes |
| `label-hidden` | Boolean | Hides the label visually |
<!-- docs: end hidden content -->

## Checkbox Input [d2l-input-checkbox]

The `<d2l-input-checkbox>` element can be used on its own or as an option within a `<d2l-input-checkbox-group>` collection. It will display a checkbox and optional visible label.

When provided with a `name`, the checkbox will participate in forms if it is `checked` and enabled.

<!-- docs: demo code properties name:d2l-input-checkbox sandboxTitle:'Checkbox Input' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-checkbox.js';
</script>
<d2l-input-checkbox label="Label for checkbox"></d2l-input-checkbox>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `checked` | Boolean | Checked state |
| `description` | String | Additional information communicated to screenreader users when focusing on the input |
| `disabled` | Boolean | Disables the input |
| `indeterminate` | Boolean | Sets checkbox to an indeterminate state |
| `label` | String, required | Label for the input |
| `label-hidden` | Boolean | Hides the label visually (moves it to the input's `aria-label` attribute) |
| `name` | String | Name of the form control. Submitted with the form as part of a name/value pair. |
| `not-tabbable` | Boolean | Sets `tabindex="-1"` on the checkbox. Note that an alternative method of focusing is necessary to implement if using this property. |
| `value` | String | Value of the input |

### Events

When the checkbox's state changes, it dispatches the `change` event:

```javascript
checkbox.addEventListener('change', e => {
  console.log(e.target.checked);
});
```

### Slots

* `inline-help`: Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
* `supporting`: Supporting information which will appear below and be aligned with the checkbox.
<!-- docs: end hidden content -->

## Accessibility

The `d2l-input-checkbox` component follows W3C's best practice recommendations for a [checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/). This means that the component works in the following way:
- The `Space` key is used to select a focused checkbox (not the `Enter` key)
- The `aria-checked` state is set to `true`, `false` or `mixed` to represent if it's selected, unselected, or partially selected

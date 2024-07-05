# Switches

A switch is used to toggle between two states, on and off, just like a light switch.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/switch/switch.js';
  import '@brightspace-ui/core/components/switch/switch-visibility.js';
</script>
<d2l-switch text="My Switch" on></d2l-switch>
<d2l-switch-visibility on></d2l-switch-visibility>
```

## Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use a switch to toggle ON/OFF states with immediate effect
* Use a visible label near the switch to indicate its purpose
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't toggle the language in the label, it should remain static
  * The [Visibility Switch](#d2l-switch-visibility) is a necessary exception to this rule
* Don't use a switch in a form, use a checkbox or radio options in stead
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Switch [d2l-switch]
The `d2l-switch` element is a generic switch with on/off semantics.

<!-- docs: demo code properties name:d2l-switch autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/switch/switch.js';
</script>
<d2l-switch text="My Switch"></d2l-switch>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `text` | String, required | Acts as the [primary label](https://www.w3.org/WAI/tutorials/forms/labels/) for the switch. Visible unless text-position is `hidden`. |
| `disabled` | Boolean | Disables the switch |
| `on` | Boolean | Whether the switch is "on" or "off" |
| `text-position` | String | Valid values are: `start`, `end` (default), and `hidden` |
### Events

- `change`: dispatched when the `on` property is updated
<!-- docs: end hidden content -->

## Visibility Switch [d2l-switch-visibility]

The d2l-switch-visibility component is a special variant for toggling the visibility of activities. Activities can be set to "on" but still not appear for users due to availability conditions. Therefore, the d2l-switch-visibility can display as "Hidden", "Visible", or "Visible. Conditions must be met" if a description of the conditions is provided.

See also [Visibility Switch with Conditions](https://daylight.d2l.dev/components/switch/#visibility-switch-with-conditions).

<!-- docs: demo code properties name:d2l-switch-visibility autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/switch/switch-visibility.js';
</script>
<d2l-switch-visibility></d2l-switch-visibility>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `disabled` | Boolean | Disabled the switch |
| `on` | Boolean | Whether the switch is "on" or "off". If content is passed into the switch slot, the switch will be "on with conditions". |
| `text-position` | String | Valid values are: `start`, `end` (default), and `hidden` |

### Events

- `change`: dispatched when the `on` property is updated

### Slots

- Optional default slot content - Content that will be displayed within the "conditions" opener tooltip when the switch is on.

<!-- docs: end hidden content -->

### Visibility Switch with Conditions
If an activity is set to `Visible` but also has other conditions affecting its visibility, information about the conditions can be passed in the default slot so it will be available in a tooltip.

<!-- docs: demo code autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/switch/switch-visibility.js';
</script>
<d2l-switch-visibility on>
  These are some conditions that must be met for the activity to be visible.
  <ul>
    <li> Condition 1 </li>
    <li> Condition 2 </li>
    <li> Condition 3 </li>
  </ul>
</d2l-switch-visibility>
```

## Accessbility

- When `text-position` is set to `hidden`, the required `text` will be used for the switch's hidden label so that it is [accessible](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA14) to non-sighted users.

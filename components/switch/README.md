# Switches

Switch components are similar to button toggles and checkboxes, except that they have on/off semantics that reflect their appearance more closely. In contrast to checkboxes, changes are generally expected to be immediate as opposed to submitted as part of a form.

<!-- docs: demo name:d2l-switch -->
```html
<script type="module">
  import '@brightspace-ui/core/components/switch/switch.js';
  import '@brightspace-ui/core/components/switch/switch-visibility.js';
</script>
<d2l-switch text="My Switch" tooltip="Click to toggle!"></d2l-switch>
<d2l-switch-visibility tooltip="Click to toggle!" on></d2l-switch-visibility>
```

## Switch [d2l-switch]	
The `d2l-switch` element is a generic switch with on/off semantics.
<!-- docs: start hidden content -->
![Switch](./screenshots/switch.png?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-switch -->
```html
<script type="module">
  import '@brightspace-ui/core/components/switch/switch.js';
  import '@brightspace-ui/core/components/switch/switch-visibility.js';
</script>
<d2l-switch text="My Switch"></d2l-switch>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Accessible text for the switch |
| `disabled` | Boolean | Disables the switch |
| `on` | Boolean | Whether the switch is "on" or "off" |
| `text-position` | String | Valid values are: `start`, `end` (default), and `hidden` |
| `tooltip` | String | Text to display in a tooltip for the switch |
### Events

- `change`: dispatched when the `on` property is updated
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-switch` accessible, use the following property:

| Attribute | Description |
|--|--|
| text | **REQUIRED** [Acts as a primary label on the switch](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless text-position is `hidden`. |

## Visibility Switch [d2l-switch-visibility]

The `d2l-switch-visibility` element is a variant of the generic switch configured with special icons and default text for toggling "visibility".

<!-- docs: start hidden content -->
![Visibility Switch](./screenshots/switch-visibility.png?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-switch-visibility -->
```html
<script type="module">
  import '@brightspace-ui/core/components/switch/switch-visibility.js';
</script>

<d2l-switch-visibility></d2l-switch-visibility>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text`| String, required | Accessible text for the switch; defaults to "Visibility" |
| `disabled` | Boolean | Disabled the switch |
| `on` | Boolean | Whether the switch is "on" or "off" |
| `text-position` | String | Valid values are: `start`, `end` (default), and `hidden` |
| `tooltip` | String | Text to display in a tooltip for the switch |

### Events

- `change`: dispatched when the `on` property is updated

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->

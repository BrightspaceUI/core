# Switches

Switch components are similar to button toggles and checkboxes, except that they have on/off semantics that reflect their appearance more closely. In contrast to checkboxes, changes are generally expected to be immediate as opposed to submitted as part of a form.

## d2l-switch

The `d2l-switch` element is a generic switch with on/off semantics.

![Switch](./screenshots/switch.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/switch/switch.js';
</script>

<d2l-switch label="Dark Mode" on></d2l-switch>
```

**Properties:**

- `label` (String, required): accessible label for the switch
- `label-hidden` (Boolean): whether the label is visible or hidden
- `disabled` (Boolean): disables the switch
- `on` (Boolean): whether the switch is on or off

**Accessibility:**

To make your usage of `d2l-switch` accessible, use the following property:

| Attribute | Description |
|--|--|
| label | **REQUIRED** [Acts as a primary label on the switch](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless label-hidden is also used. |

**Events:**

- `change`: dispatched when the `on` property is updated

## d2l-switch-visibility

The `d2l-switch-visibility` element is a variant of the generic switch configured with special icons and a default label for toggling "visibility".

![Visibility Switch](./screenshots/switch-visibility.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/switch/switch-visibility.js';
</script>

<d2l-switch-visibility></d2l-switch-visibility>
```

**Properties:**

- `label` (String, required): accessible label for the switch
- `label-hidden` (Boolean): whether the label is visible or hidden
- `disabled` (Boolean): disables the switch
- `on` (Boolean): whether the switch is "on" or "off"

**Accessibility:**

To make your usage of `d2l-switch` accessible, use the following property:

| Attribute | Description |
|--|--|
| label | **REQUIRED** [Acts as a primary label on the switch](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless label-hidden is also used. |

**Events:**

- `change`: dispatched when the `on` property is updated

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!

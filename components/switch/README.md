# Switches

Switch components are similar to button toggles and checkboxes, except that they have on/off semantics that reflect their appearance more closely. In contrast to checkboxes, changes are generally expected to be immediate as opposed to submitted as part of a form.

## d2l-switch

The `d2l-switch` element is a generic switch with on/off semantics.

![Switch](./screenshots/switch.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/switch/switch.js';
</script>

<d2l-switch text="Dark Mode" on></d2l-switch>
```

**Properties:**

- `disabled` (Boolean): disables the switch
- `on` (Boolean): whether the switch is "on" or "off"
- `text` (String, required): accessible text for the switch
- `text-position` (String): valid values are: `start`, `end` (default), and `hidden`
- `tooltip` (String): text to display in a tooltip for the switch

**Accessibility:**

To make your usage of `d2l-switch` accessible, use the following property:

| Attribute | Description |
|--|--|
| text | **REQUIRED** [Acts as a primary label on the switch](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless text-position is `hidden`. |

**Events:**

- `change`: dispatched when the `on` property is updated

## d2l-switch-visibility

The `d2l-switch-visibility` element is a variant of the generic switch configured with special icons and default text for toggling "visibility".

![Visibility Switch](./screenshots/switch-visibility.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/switch/switch-visibility.js';
</script>

<d2l-switch-visibility></d2l-switch-visibility>
```

**Properties:**

- `disabled` (Boolean): disables the switch
- `on` (Boolean): whether the switch is "on" or "off"
- `text` (String, required): accessible text for the switch; defaults to "Visibility"
- `text-position` (String): valid values are: `start`, `end` (default), and `hidden`
- `tooltip` (String): text to display in a tooltip for the switch

**Events:**

- `change`: dispatched when the `on` property is updated

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!

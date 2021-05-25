# Switches

Switch components are similar to button toggles and checkboxes, except that they have on/off semantics that reflect their appearance more closely. In contrast to checkboxes, changes are generally expected to be immediate as opposed to submitted as part of a form.

```html
<!-- docs: demo -->
<script type="module">
  import '@brightspace-ui/core/components/switch/switch.js';
  import '@brightspace-ui/core/components/switch/switch-visibility.js';
</script>

<d2l-switch text="Dark Mode" on></d2l-switch>
<d2l-switch-visibility></d2l-switch-visibility>
```

## Switch

The `d2l-switch` element is a generic switch with on/off semantics.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/switch/switch.js';
</script>

<d2l-switch text="Dark Mode" on></d2l-switch>
```

### Accessibility

To make your usage of `d2l-switch` accessible, use the following property:

| Attribute | Description |
|--|--|
| text | **REQUIRED** [Acts as a primary label on the switch](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless text-position is `hidden`. |

## Visibility Switch

The `d2l-switch-visibility` element is a variant of the generic switch configured with special icons and default text for toggling "visibility".

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/switch/switch-visibility.js';
</script>

<d2l-switch-visibility></d2l-switch-visibility>
```

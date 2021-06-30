# Buttons

A Button is used to communicate and perform an action.

```html
<!-- docs: demo -->
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/button/button-subtle.js';
  import '@brightspace-ui/core/components/button/button-icon.js';
</script>
<d2l-button>Button</d2l-button>
<d2l-button primary>Primary Button</d2l-button>
<d2l-button-subtle text="Subtle Button" icon="tier1:gear"></d2l-button-subtle>
<d2l-button-icon text="Icon Button" icon="tier1:gear"></d2l-button-icon>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use buttons to cause an action or launch a workflow
* Keep button text short - see "Writing" guidelines
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use multiple Primary buttons - the primary action should always be clear and obvious
* Avoid icon-only buttons with unfamiliar icons, only use these for familiar concepts
* Don't use buttons for navigation, use a link instead
* Don't open menus with buttons - use a dropdown instead
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Button [d2l-button]

The `d2l-button` element can be used just like the native button element, but also supports the `primary` attribute for denoting the primary button.

```html
<!-- docs: live demo
name: d2l-button
-->
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
</script>
<d2l-button $attributes>My Button</d2l-button>
```

### Accessibility Properties

To make your `d2l-button` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `aria-expanded` | [Indicate expansion state of a collapsible element](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-expanded). Example: [d2l-more-less](https://github.com/BrightspaceUI/core/blob/f9f30d0975ee5a8479263a84541fc3b781e8830f/components/more-less/more-less.js#L158). |
| `aria-haspopup` | [Indicate clicking the button opens a menu](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup). Example: [d2l-dropdown](https://github.com/BrightspaceUI/core/blob/master/components/dropdown/dropdown-opener-mixin.js#L46). |
| `description` | Use when text on button does not provide enough context. |

## Subtle Button [d2l-button-subtle]

The `d2l-button-subtle` element can be used just like the native `button`, but for advanced or de-emphasized actions.

**Note:** It is strongly recommended to use `text` and `icon` as opposed to putting content in the `slot` to ensure that the recommended subtle button style is maintained.

```html
<!-- docs: live demo
name: d2l-button-subtle
defaults: { "text": "My Button", "icon": "tier1:gear" }
-->
<script type="module">
  import '@brightspace-ui/core/components/button/button-subtle.js';
</script>
<d2l-button-subtle $attributes></d2l-button-subtle>
```

### Accessibility Properties

To make your `d2l-button-subtle` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `aria-expanded` | [Indicate expansion state of a collapsible element](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-expanded). Example: [d2l-more-less](https://github.com/BrightspaceUI/core/blob/f9f30d0975ee5a8479263a84541fc3b781e8830f/components/more-less/more-less.js#L158). |
| `aria-haspopup` | [Indicate clicking the button opens a menu](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup). Example: [d2l-dropdown](https://github.com/BrightspaceUI/core/blob/master/components/dropdown/dropdown-opener-mixin.js#L46). |
| `description` | Use when text on button does not provide enough context. |

## Icon Button [d2l-button-icon]

The `d2l-button-icon` element can be used just like the native `button`, for instances where only an icon is displayed.

```html
<!-- docs: live demo
name: d2l-button-icon
defaults: { "text": "My Button", "icon": "tier1:gear" }
-->
<script type="module">
  import '@brightspace-ui/core/components/button/button-icon.js';
</script>
<d2l-button-icon $attributes></d2l-button-icon>
```

### Accessibility Properties

To make your `d2l-button-icon` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `text` | **REQUIRED**. Acts as a primary label and tooltip. |
| `aria-expanded` | [Indicate expansion state of a collapsible element](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-expanded). Example: [d2l-more-less](https://github.com/BrightspaceUI/core/blob/f9f30d0975ee5a8479263a84541fc3b781e8830f/components/more-less/more-less.js#L158). |
| `aria-haspopup` | [Indicate clicking the button opens a menu](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup). Example: [d2l-dropdown](https://github.com/BrightspaceUI/core/blob/master/components/dropdown/dropdown-opener-mixin.js#L46). |
| `aria-label` | Acts as a primary label. If `text` AND `aria-label` are provided, `aria-label` is used as the primary label, `text` is used as the tooltip. |

## Floating Buttons [d2l-floating-buttons]

See [floating buttons](./floating-buttons.md).

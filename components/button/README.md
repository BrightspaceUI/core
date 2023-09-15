# Buttons

A Button is used to communicate and perform an action.

<!-- docs: demo -->
```html
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
* Don't use buttons for navigation, use a [link](../../components/link) instead
* Don't open menus with buttons - use a [dropdown](../../components/dropdown) instead
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Button [d2l-button]

The `d2l-button` element can be used just like the native button element, but also supports the `primary` attribute for denoting the primary button.

<!-- docs: demo code properties name:d2l-button -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
</script>
<d2l-button>My Button</d2l-button>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `description` | String | A description to be added to the `button` for accessibility for additional context |
| `disabled` | Boolean | Disables the button |
| `disabledTooltip` | String | Tooltip text when disabled |
| `primary` | Boolean | Styles the button as a primary button |
<!-- docs: end hidden content -->

### Accessibility Properties

To make your `d2l-button` accessible, use the following properties when applicable:

| Attribute | Description |
|---|---|
| `aria-expanded` | [Indicate expansion state of a collapsible element](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-expanded). Example: [d2l-more-less](https://github.com/BrightspaceUI/core/blob/f9f30d0975ee5a8479263a84541fc3b781e8830f/components/more-less/more-less.js#L158). |
| `aria-haspopup` | [Indicate clicking the button opens a menu](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup). Example: [d2l-dropdown](https://github.com/BrightspaceUI/core/blob/main/components/dropdown/dropdown-opener-mixin.js#L46). |
| `description` | Use when text on button does not provide enough context. |

## Subtle Button [d2l-button-subtle]

The `d2l-button-subtle` element can be used just like the native `button`, but for advanced or de-emphasized actions.

**Note:** It is strongly recommended to use `text` and `icon` as opposed to putting content in the `slot` to ensure that the recommended subtle button style is maintained.

<!-- docs: demo code properties name:d2l-button-subtle -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button-subtle.js';
</script>
<d2l-button-subtle text="My Button" icon="tier1:gear"></d2l-button-subtle>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text for the button |
| `description` | String | A description to be added to the `button` for accessibility for additional context |
| `disabled` | Boolean | Disables the button |
| `disabledTooltip` | String | Tooltip text when disabled |
| `h-align` | String | Possible values are undefined (default) or `text`. If `text`, aligns the button content to the leading edge of text. |
| `icon` | String | [Preset icon key](../../components/icons#preset-icons) (e.g. `tier1:gear`) |
| `icon-right` | Boolean | Render the icon on the right of the button |
<!-- docs: end hidden content -->

### Accessibility Properties

To make your `d2l-button-subtle` accessible, use the following properties when applicable:

| Attribute | Description |
|---|---|
| `aria-expanded` | [Indicate expansion state of a collapsible element](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-expanded). Example: [d2l-more-less](https://github.com/BrightspaceUI/core/blob/f9f30d0975ee5a8479263a84541fc3b781e8830f/components/more-less/more-less.js#L158). |
| `aria-haspopup` | [Indicate clicking the button opens a menu](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup). Example: [d2l-dropdown](https://github.com/BrightspaceUI/core/blob/main/components/dropdown/dropdown-opener-mixin.js#L46). |
| `description` | Use when text on button does not provide enough context. |

### Subtle Button with Custom Icon

<!-- docs: demo code  -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button-subtle.js';
  import '@brightspace-ui/core/components/icons/icon-custom.js';
</script>
<d2l-button-subtle text="Subtle Button">
  <d2l-icon-custom slot="icon">
    <svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
      <path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
      <path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
    </svg>
  </d2l-icon-custom>
</d2l-button-subtle>
```

## Icon Button [d2l-button-icon]

The `d2l-button-icon` element can be used just like the native `button`, for instances where only an icon is displayed.

<!-- docs: demo code properties name:d2l-button-icon -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button-icon.js';
</script>
<d2l-button-icon text="My Button" icon="tier1:gear"></d2l-button-icon>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `description` | String | A description to be added to the `button` for accessibility for additional context |
| `icon` | String, required | [Preset icon key](../../components/icons#preset-icons) (e.g. `tier1:gear`) |
| `text` | String, required | Accessible text for the buton |
| `disabled` | Boolean | Disables the button |
| `disabledTooltip` | String | Tooltip text when disabled |
| `h-align` | String | Possible values are undefined (default) or `text`. If `text`, aligns the button content to the leading edge of text. |
| `translucent` | Boolean | Indicates to display translucent (ex. on rich backgrounds) |
<!-- docs: end hidden content -->

### Accessibility Properties

To make your `d2l-button-icon` accessible, use the following properties when applicable:

| Attribute | Description |
|---|---|
| `text` | **REQUIRED**. Acts as a primary label and tooltip. |
| `aria-expanded` | [Indicate expansion state of a collapsible element](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-expanded). Example: [d2l-more-less](https://github.com/BrightspaceUI/core/blob/f9f30d0975ee5a8479263a84541fc3b781e8830f/components/more-less/more-less.js#L158). |
| `aria-haspopup` | [Indicate clicking the button opens a menu](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup). Example: [d2l-dropdown](https://github.com/BrightspaceUI/core/blob/main/components/dropdown/dropdown-opener-mixin.js#L46). |
| `aria-label` | Acts as a primary label. If `text` AND `aria-label` are provided, `aria-label` is used as the primary label, `text` is used as the tooltip. |
| `description` | Use when text on button does not provide enough context. |

### Icon Button with Custom Icon

<!-- docs: demo code  -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button-icon.js';
  import '@brightspace-ui/core/components/icons/icon-custom.js';
</script>
<d2l-button-icon text="Custom Icon Button">
  <d2l-icon-custom slot="icon">
    <svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
      <path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
      <path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
    </svg>
  </d2l-icon-custom>
</d2l-button-icon>
```

## Floating Buttons [d2l-floating-buttons]

See [floating buttons](https://github.com/BrightspaceUI/core/tree/main/components/button/floating-buttons.md).

<!-- docs: start hidden content -->
## Future Improvements

- `<d2l-button-preset type="save">` for common button types that will have built-in language support

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->

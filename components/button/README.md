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

<!-- docs: demo code properties name:d2l-button sandboxTitle:'Button' -->
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

## Subtle Button [d2l-button-subtle]

The `d2l-button-subtle` element can be used just like the native `button`, but for advanced or de-emphasized actions.

**Note:** It is strongly recommended to use `text` and `icon` as opposed to putting content in the `slot` to ensure that the recommended subtle button style is maintained.

<!-- docs: demo code properties name:d2l-button-subtle sandboxTitle:'Subtle Button' -->
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
| `h-align` | String | Possible values are undefined (default), `text` or `text-end`. If `text` or `text-end`, aligns the button content to the leading (or trailing) edge of text. |
| `icon` | String | [Preset icon key](../../components/icons#preset-icons) (e.g. `tier1:gear`) |
| `icon-right` | Boolean | Render the icon on the right of the button |
<!-- docs: end hidden content -->

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

<!-- docs: demo code properties name:d2l-button-icon sandboxTitle:'Icon Button' -->
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
| `text` | String, required | Accessible text for the button |
| `disabled` | Boolean | Disables the button |
| `disabledTooltip` | String | Tooltip text when disabled |
| `h-align` | String | Possible values are undefined (default), `text` or `text-end`. If `text` or `text-end`, aligns the button content to the leading (or trailing) edge of text. |
| `translucent` | Boolean | Indicates to display translucent (ex. on rich backgrounds) |
<!-- docs: end hidden content -->

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

## Toggle Button [d2l-button-toggle]

The `d2l-button-toggle` element is a container for buttons that toggle a `pressed` state. The component will automatically show or hide the buttons and manage focus based on the `pressed` state. Simply place a `d2l-button-icon` or `d2l-button-subtle` element in each of the `not-pressed` and `pressed` slots. Each button should describe the state and action the user can take.

<!-- docs: demo code properties name:d2l-button-toggle sandboxTitle:'Toggle Button' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button-subtle.js';
  import '@brightspace-ui/core/components/button/button-toggle.js';
</script>
<d2l-button-toggle pressed>
  <d2l-button-subtle slot="not-pressed" icon="tier1:lock-unlock" text="Unlocked" description="Click to lock."></d2l-button-subtle>
  <d2l-button-subtle slot="pressed" icon="tier1:lock-locked" text="Locked" description="Click to unlock."></d2l-button-subtle>
</d2l-button-toggle>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `pressed` | Boolean | Pressed state |

### Events

- `d2l-button-toggle-change`: dispatched when the `pressed` state changes
<!-- docs: end hidden content -->

## Split Button [d2l-button-split]

The `d2l-button-split` element is a button component that provides a main button and a slot for `d2l-button-split-item` elements. Simply provide a `key` and `text` for the main button and each item. The `d2l-button-split`'s `click` event provides the `key` of the selected action.

<!-- docs: demo code properties name:d2l-button-split sandboxTitle:'Split Button' align:flex-start autoSize:false size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button-split.js';
  import '@brightspace-ui/core/components/button/button-split-item.js';
</script>
<d2l-button-split key="save" text="Save" primary>
  <d2l-button-split-item key="saveAsDraft" text="Save as Draft"></d2l-button-split-item>
  <d2l-button-split-item key="saveAndClose" text="Save and Close"></d2l-button-split-item>
  <d2l-button-split-item key="saveAndNew" text="Save and New"></d2l-button-split-item>
</d2l-button-split>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `description` | String | A description to be added to the main button for accessibility for additional context |
| `disabled` | Boolean | Disables the main button and menu opener |
| `disabledTooltip` | String | Tooltip text when disabled |
| `key` | String, required | Key of the main button, provided on the `click` event detail |
| `primary` | Boolean | Styles the main button and menu opener as primary buttons |
| `text` | String, required | Accessible text for the main button |

### Item Properties

| Property | Type | Description |
|--|--|--|
| `disabled` | Boolean | Disables the menu item |
| `key` | String, required | Key of the menu item, provided on the `click` event detail |
| `text` | String, required | Accessible text for the menu item |

### Events

- `click`: dispatched when the user clicks the main action or menu item. The `key` is provided on the event detail.
<!-- docs: end hidden content -->

## Add Button [d2l-button-add]

The `d2l-button-add` is for quickly adding new items at a specific location, such as when adding items to a curated list. Since the Add button is meant to be subtle, it should always be used in combination with more obvious methods to add items (like a menu or primary button).

<!-- docs: demo code properties name:d2l-button-add sandboxTitle:'Add Button' display:block autoSize:false size:xsmall -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button-add.js';
</script>
<d2l-button-add text="Add New Item"></d2l-button-add>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | The text associated with the button. When mode is "icon-and-text", this text is displayed next to the icon. Otherwise this text is in a tooltip. |
| `mode` | String | Display mode of the component. Defaults to "icon" (plus icon is always visible). Other options are "icon-and-text" (plus icon and text are always visible), and "icon-when-interacted" (plus icon is only visible when hover or focus). |
<!-- docs: end hidden content -->

## Floating Buttons [d2l-floating-buttons]

Floating workflow buttons `<d2l-floating-buttons>` cause buttons to float or 'dock' to the bottom of the viewport when they would otherwise be below the bottom of the viewport. When their normal position becomes visible, they will undock.

The best time to use floating workflow buttons is when users need immediate access to the buttons without scrolling. An example is a long or complex form page where it's common for users to make frequent isolated edits rather than sequentially completing the form.

<!-- docs: demo code properties name:d2l-floating-buttons sandboxTitle:'Floating Buttons' autoSize:false display:block size:xlarge -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/floating-buttons.js';
  import '@brightspace-ui/core/components/button/button.js';
</script>
<!-- docs: start hidden content -->
<style>
  .d2l-typography p {
    margin: 0.5rem;
  }
  .content-placeholder {
    align-items: center;
    background-color: var(--d2l-color-regolith);
    border: 2px dashed lightgrey;
    border-radius: 8px;
    display: flex;
    height: 600px;
    justify-content: center;
    width: 100%;
  }
  .empty-space {
    height: 5rem;
  }
</style>
<!-- docs: end hidden content -->
<div class="content-placeholder d2l-body-compact">
  Scroll to unstick
</div>
<d2l-floating-buttons>
  <d2l-button primary>Primary</d2l-button>
  <d2l-button>Secondary</d2l-button>
</d2l-floating-buttons>
<div class="empty-space"></div>
```

## Accessibility

Daylight buttons rely on standard button semantics to ensure a smooth experience for all assistive technologies, but there are a few interesting details to note:

* If the button's context is implied by visual layout, then `description` can be used to add missing context
  * Example: if multiple page sections have an Edit button relying on visual layout to indicate which section it edits, there could be extra information in the `description` to help differentiate the Edit buttons for non-sighted users

* If expanding other content in a dropdown, use the [Dropdown](../../components/dropdown) component; if building custom expand/collapse behaviour, be sure to use [`expanded`](https://www.w3.org/TR/wai-aria/states_and_properties#aria-expanded) and [`aria-haspopup`](https://www.w3.org/TR/wai-aria/states_and_properties#aria-haspopup) attributes in accordance with best practices.

* Disabled buttons are normally not focusable as per web standards, but if the disabled state needs explaining you can use `disabled-tooltip` to provide an explanation that appears in a [tooltip](../../components/tooltip) via [aria-describedby](https://www.w3.org/TR/wai-aria/states_and_properties#aria-describedby)

* For [Icon Buttons](#d2l-button-icon) where there is no visible label, `text` will be displayed in a tooltip
  * If both `text` and `aria-label` are used, then `aria-label` will be used as the primary label while `text` will be used in a [tooltip](../../components/tooltip)

* [Toggle buttons](#d2l-button-toggle) should describe the current state and the action the user can perform. As such, `aria-pressed` should not be used on the buttons as per [W3C's Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/#:~:text=Alternatively%2C%20if%20the%20design%20were%20to%20call%20for%20the%20button%20label%20to%20change%20from%20%22Mute%22%20to%20%22Unmute%2C%22%20the%20aria%2Dpressed%20attribute%20would%20not%20be%20needed.).
  * Example: "Unpinned, click to pin" and "Pinned, click to unpin"

* [Floating Buttons](#d2l-floating-buttons) maintain their position in the document's structure, despite sticking to the bottom of the viewport, so the tab order is unaffected and the effect is imperceptible to screen reader users
  * Be cautious when using `always-float`, since screen magnifier users may find it difficult to locate the buttons at the bottom of a large viewport

<!-- docs: start hidden content -->
## Future Improvements

- `<d2l-button-preset type="save">` for common button types that will have built-in language support

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->

# Templates
Page templates to provide common ways to arrange content on a page

## Primary-Secondary
Two Panel (primary and secondary) page template with header and optional footer

Use this template when:
- There are primary and secondary elements on the page
- The user may need to see the primary and secondary elements at the same time

Mental Models and Page Structure:
- The page includes basic settings (primary) and advanced settings (secondary)
- There is a primary object which users are modifying or supplementing with secondary tools/settings/options

![Primary-Secondary](./screenshots/primary-secondary.gif?raw=true)

### Usage
```html
<script type="module">
  import '@brightspace-ui/core/templates/primary-secondary/primary-secondary.js';
</script>

<d2l-template-primary-secondary>
    <div slot="header">Header</div>
    <div slot="primary">The primary slot</div>
    <div slot="secondary">The secondary slot</div>
    <div slot="footer">Footer</div>
</d2l-template-primary-secondary>
```

If no nodes are assigned to the `footer` slot, the footer is hidden.

**Note:** this template automatically includes `<header>`, `<main>`, `<aside>` and `<footer>` elements, so there's no need to include them inside the various slots.

**Properties:**

| Property | Type | Description |
|--|--|--|
| `background-shading` | String, default: `'none'` | Controls whether the primary and secondary panels have shaded backgrounds. Can be one of `'primary'`, `'secondary'`, `'none'`. |
| `primary-overflow` | String, default: `'default'` | Controls how the primary panel's contents overflow. Can be one of `'default'`, `'hidden'`. |
| `resizable` | Boolean, default: `false` | Whether the panels are user resizable. This only applies to desktop users, mobile users will always be able to resize. |
| `storage-key` | String | The key used to persist the divider's position to local storage. This key should not be shared between pages so that users can save different divider positions on different pages. If no key is provided, the template will fall back its default size. |
| `width-type` | String, default: `'fullscreen'` | Whether content fills the screen or not. When set to `normal`, the width of the template is constrained to `1230px`. Can be one of `'fullscreen'`, `'normal'`. |

**Events:**
* `d2l-template-primary-secondary-resize-start`: dispatched when a user begins moving the divider
* `d2l-template-primary-secondary-resize-end`: dispatched when a user finishes moving the divider

**Slots:**
* `header`: page header content
* `footer`: page footer content
* `primary`: main page content
* `secondary`: supplementary page content

### iframes

If either of the panels contain an `iframe`, resizing may not work properly. This occurs because `iframe`s prevent the page template from receiving mouse events. To handle situations like these, setting `pointer-events: none` for the `iframe` is recommended during resizing. This can be done by listening for `d2l-template-primary-secondary-resize-start` and `d2l-template-primary-secondary-resize-end` events.

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!

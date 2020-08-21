# Card

## d2l-card

The `d2l-card` element is a container element that provides specific layout using several slots such as `content`, `header`, `footer`, `badge`, and `actions`. It can also be configured as a link for navigation.

![Card](./screenshots/card.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
</script>

<d2l-card align-center text="..." href="...">
  <img slot="header" alt="" src="...">
  <d2l-button-icon slot="actions" text="..." icon="..."></d2l-button-icon>
  <div slot="content">
    <div>Hydrology</div>
    <d2l-card-content-meta>Some extra content meta data.</d2l-card-content-meta>
  </div>
  <div slot="footer">
    <d2l-card-footer-link icon="..." text="..." secondary-text="..." href="..."></d2l-card-footer-link>
  </div>
</d2l-card>
```

**Slots:**

| Slot | Type | Description |
|--|--|--|
| `content` | required | Primary content such as title and supplementary info (no actionable elements) |
| `actions` | optional | Buttons and dropdown openers to be placed in top right corner of header |
| `badge` | optional | Badge content, such as a profile image or status indicator |
| `footer` | optional | Footer content, such secondary actions |
| `header` | optional | Header content, such as course image (no actionable elements) |

**Properties:**

| Property | Type | Description |
|--|--|--|
| `align-center` | Boolean | Style the card's content and footer as centered horizontally |
| `download` | Boolean | Download a URL instead of navigating to it |
| `href` | String | Location for the primary action/navigation |
| `rel` | String | Relationship of the target object to the link object |
| `subtle` | Boolean | Subtle aesthetic on non-white backgrounds |
| `target` | String | Where to display the linked URL |
| `text` | String | Accessible text for the card (will be announced when AT user focuses) |

See the [anchor element docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information on standard link attributes and their values.

## d2l-card-footer-link

The `d2l-card-footer-link` element is an icon link that can be placed in the `footer` slot.

```html
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/card/card-footer-link.js';
</script>

<d2l-card>
  <div slot="content">
    <div>Hydrology</div>
  </div>
  <div slot="footer">
    <d2l-card-footer-link icon="..." text="..." secondary-text="..." href="..."></d2l-card-footer-link>
  </div>
</d2l-card>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `icon` | String, required | Preset icon key (ex. "tier1:gear") |
| `text` | String, required | Accessible text for the link (not visible, gets announced when user focuses) |
| `download` | Boolean | Download a URL instead of navigating to it |
| `href` | String | Location for the primary action/navigation |
| `rel` | String | Relationship of the target object to the link object |
| `secondary-text` | String | Text to display as a superscript on the icon |
| `secondary-text-type` | String | Controls the style of the secondary text bubble; options are 'notification' and 'count' |
| `target` | String | Where to display the linked URL |

See the [anchor element docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information on standard link attributes and their values.

## d2l-card-content-title

The `d2l-card-content-title` element is a helper for providing layout/style for a title within the `content` slot.

```html
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/card/card-content-title.js';
</script>

<d2l-card>
  <div slot="content">
    <d2l-card-content-title>Hydrology</d2l-card-content-title>
  </div>
</d2l-card>
```

## d2l-card-content-meta

The `d2l-card-content-meta` element is a helper for providing layout/style for a meta data within the `content` slot.

```html
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
  import '@brightspace-ui/core/components/card/card-content-meta.js';
</script>

<d2l-card>
  <div slot="content">
    <div>Hydrology</div>
    <d2l-card-content-meta>Some extra content meta data.</d2l-card-content-meta>
  </div>
</d2l-card>
```

## Future Enhancements

* scroll API for the dialog content (see [#341](https://github.com/BrightspaceUI/core/issues/341))

Looking for an enhancement not listed here? Create a GitHub issue!

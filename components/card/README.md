# Card

## d2l-card

The `d2l-card` element is a container element that provides specific layout using several slots such as `content`, `header`, `footer`, `badge`, and `actions`. It can also be configured as a link for navigation.

![Card](./screenshots/card.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/card/card.js';
</script>

<d2l-card align-center text="Hydrology" href="..." style="width: 245px; height: 300px;">
  <img slot="header" alt="" style="display: block; width: 100%;" src="...">
  <d2l-button-icon slot="actions" translucent text="Unpin" icon="tier1:pin-filled"></d2l-button-icon>
  <div slot="content">
    <div>Hydrology</div>
    <d2l-card-content-meta>Some extra content meta data.</d2l-card-content-meta>
  </div>
  <div slot="footer">
    <d2l-card-footer-link id="link1" icon="tier1:google-drive" text="Google Drive" secondary-text="99+" href="..."></d2l-card-footer-link>
    <d2l-tooltip for="link1">Go to Google Drive</d2l-tooltip>
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
| `text` | String | Accessible text for the card (will be announced when AT user focuses) |
| `align-center` | Boolean | Style the card's content and footer as centered horizontally |
| `download` | Boolean | Download a URL instead of navigating to it |
| `href` | String | Location for the primary action/navigation |
| `rel` | String | Relationship of the target object to the link object |
| `subtle` | Boolean | Subtle aesthetic on non-white backgrounds |
| `target` | String | Where to display the linked URL |

See the [anchor element docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information on standard link attributes and their values.



## Future Enhancements

* scroll API for the dialog content (see [#341](https://github.com/BrightspaceUI/core/issues/341))

Looking for an enhancement not listed here? Create a GitHub issue!

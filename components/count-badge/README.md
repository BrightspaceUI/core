# Count Badge

## d2l-count-badge

The `d2l-count-badge` element is a web component to display a number count, either in a `"notification"` or `"count"` style.


![Notification Badge](./screenshots/count-badge-notification-small.png?raw=true)
![Count Badge](./screenshots/count-badge-count-large.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/count-badge/count-badge.js';
</script>
<d2l-count-badge size="small" type="notification" text="100 new notifications" number="100"></d2l-count-badge>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `number` | Number, required | The number to display on the badge.  Must be a positive integer. |
| `size`, default: `small` | String | The size of the badge. Valid options are `"small"` and `"large"`. |
| `type`, default: `count` | String | The type of the badge. Valid options are `"notification"` and `"count"`. Notification badges are orange and count badges are grey. |
| `max-digits`, default: `2` when `type="notification"` | Number | Optionally specify a digit limit, after which numbers are truncated. Defaults to two for `"notification"` type and no limit for `"count"` type.
| `hide-zero`, default: `false` | Boolean | Optionally choose not to show the count badge when the number is zero. |
| `text`, required | String | Descriptive text for the badge which will act as an accessible label and tooltip text when tooltips are enabled. |
| `tab-stop`, default: `false` | Boolean | Optionally choose to make the badge a tab stop. |
| `announce-changes`, default: `false` | Boolean | Optionally choose to announce changes to the badge with an aria-live region. If the text property is changed, the text will be read by screen-readers. |
| `has-tooltip`, default: `false` | Boolean | Optionally choose to have a tooltip below the badge. |

### Accessibility Properties

To make your `d2l-count-badge` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `text`, required | Only the text will be read by screen-readers (not the number), so include the number in the text. |
| `tab-stop` | A tab stop allows screen-reader users to easily tab to the badge. Otherwise, screen-reader users will need to arrow through to the badge. |
| `announce-changes` | Use "announce-changes" if screen-reader users should be notified that the badge has been updated, such as a new notification. The "text" property will be read as soon as the screen-reader is idle. |
| `has-tooltip` | The tooltip will be visible on hover/tab-stop, and read out by screen-readers. |



## d2l-count-badge-icon

The `d2l-count-badge-icon` element is a web component to display a number count, either in a `"notification"` or `"count"` style with an icon.

![Count Badge with icon](./screenshots/count-badge-icon.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/count-badge/count-badge-icon.js';
</script>
<d2l-count-badge-icon size="small" icon="tier1:gear" type="notification" text="100 new settings applied." number="100"></d2l-count-badge>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `number` | Number, required | The number to display on the badge.  Must be a positive integer. |
| `icon` | String, required | [Preset icon key](../icons#preset-icons) (e.g. `tier1:gear`) |
| `size`, default: `small` | String | The size of the badge. Valid options are `"small"` and `"large"`. |
| `type`, default: `count` | String | The type of the badge. Valid options are `"notification"` and `"count"`. Notification badges are orange and count badges are grey. |
| `max-digits`, default: `2` when `type="notification"` | Number | Optionally specify a digit limit, after which numbers are truncated. Defaults to two for `"notification"` type and no limit for `"count"` type.
| `hide-zero`, default: `false` | Boolean | Optionally choose not to show the count badge when the number is zero. |
| `text`, required | String | Descriptive text for the badge which will act as an accessible label and tooltip text when tooltips are enabled. |
| `tab-stop`, default: `false` | Boolean | Optionally choose to make the badge a tab stop. |
| `announce-changes`, default: `false` | Boolean | Optionally choose to announce changes to the badge with an aria-live region. If the text property is changed, the text will be read by screen-readers. |
| `has-tooltip`, default: `false` | Boolean | Optionally choose to have a tooltip below the badge. |

### Accessibility Properties

To make your `d2l-count-badge-icon` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `text`, required | Only the text will be read by screen-readers (not the number), so include the number in the text. |
| `tab-stop` | A tab stop allows screen-reader users to easily tab to the badge. Otherwise, screen-reader users will need to arrow through to the badge. |
| `announce-changes` | Use "announce-changes" if screen-reader users should be notified that the badge has been updated, such as a new notification. The "text" property will be read as soon as the screen-reader is idle. |
| `has-tooltip` | The tooltip will be visible on hover/tab-stop, and read out by screen-readers. |

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!

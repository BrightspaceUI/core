# Count Badge
Badges can be used to provide additional contextual information to users in regards to a task or action.

<!-- docs: demo autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/count-badge/count-badge.js';
  import '@brightspace-ui/core/components/count-badge/count-badge-icon.js';
</script>
<d2l-count-badge size="small" type="notification" text="100 new notifications" number="100"></d2l-count-badge>
<d2l-count-badge size="small" type="count" text="100 new notifications" number="100"></d2l-count-badge>
<d2l-count-badge-icon size="small" icon="tier1:gear" type="notification" text="100 new settings applied." number="100" tab-stop></d2l-count-badge-icon>
<d2l-count-badge-icon size="small" icon="tier1:gear" type="count" text="100 new settings applied." number="100" tab-stop></d2l-count-badge-icon>
```

## Count Badge: Basic [d2l-count-badge]

The `d2l-count-badge` element is a web component to display a number count, depending on your use case different styling options are available.

<!-- docs: demo code properties name:d2l-count-badge -->
```html
<script type="module">
  import '@brightspace-ui/core/components/count-badge/count-badge.js';
</script>
<d2l-count-badge size="small" type="notification" text="100 new notifications" number="100" has-tooltip tab-stop></d2l-count-badge>
```

### Accessibility Properties
| Attribute | Description |
|---|---|
| `text`  | REQUIRED: Only the text will be read by screen-readers (not the number), so include the number in the text. |
| `tab-stop` | A tab stop allows screen-reader users to easily tab to the badge. Otherwise, screen-reader users will need to arrow through to the badge. |
| `announce-changes` | Use "announce-changes" if screen-reader users should be notified that the badge has been updated, such as a new notification. The "text" property will be read as soon as the screen-reader is idle. |
| `has-tooltip` | The tooltip will be visible on hover/tab-stop, and read out by screen-readers. |

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `number` | Number, required | The number to display on the badge.  Must be a positive integer. |
| `size`, default: `small` | String | The size of the badge. Valid options are `"small"` and `"large"`. |
| `type`, default: `count` | String | The type of the badge. Valid options are `"notification"` and `"count"`. Notification badges are orange and count badges are grey. |
| `max-digits`, default: `2` when `type="notification"`, `5` when `type="count"` | Number | Optionally specify a digit limit, after which numbers are truncated. Defaults to two for `"notification"` type and five for `"count"` type. Must be between 1-5.
| `hide-zero`, default: `false` | Boolean | Optionally choose not to show the count badge when the number is zero. |
| `text`, required | String | Descriptive text for the badge which will act as an accessible label and tooltip text when tooltips are enabled. |
| `tab-stop`, default: `false` | Boolean | Optionally choose to make the badge a tab stop. |
| `announce-changes`, default: `false` | Boolean | Optionally choose to announce changes to the badge with an aria-live region. If the text property is changed, the text will be read by screen-readers. |
| `has-tooltip`, default: `false` | Boolean | Optionally choose to have a tooltip below the badge. |
| `focus-ring`, default: `false` | Boolean | Optionally force a focus ring around the badge. This property can be used to highlight the badge when the parent element is focused. |
<!-- docs: end hidden content -->

## Count Badge: Icon [d2l-count-badge-icon]

The `d2l-count-badge-icon` element is a web component to display a number count, either in a `"notification"` or `"count"` style with an icon.

<!-- docs: demo code properties name:d2l-count-badge-icon -->
```html
<script type="module">
  import '@brightspace-ui/core/components/count-badge/count-badge-icon.js';
</script>
<d2l-count-badge-icon size="small" icon="tier1:gear" type="notification" text="100 new settings applied." number="100" tab-stop has-tooltip></d2l-count-badge-icon>
```

### Accessibility Properties
| Attribute | Description |
|---|---|
| `text` | REQUIRED: Only the text will be read by screen-readers (not the number), so include the number in the text. |
| `tab-stop` | A tab stop allows screen-reader users to easily tab to the badge. Otherwise, screen-reader users will need to arrow through to the badge. |
| `announce-changes` | Use "announce-changes" if screen-reader users should be notified that the badge has been updated, such as a new notification. The "text" property will be read as soon as the screen-reader is idle. |
| `has-tooltip` | The tooltip will be visible on hover/tab-stop, and read out by screen-readers. |

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `number` | Number | Required: The number to display on the badge.  Must be a positive integer. |
| `icon` | String | Required: [Preset icon key](../icons#preset-icons) (e.g. `tier1:gear`) |
| `size`, default: `small` | String | The size of the badge. Valid options are `"small"` and `"large"`. |
| `type`, default: `count` | String | The type of the badge. Valid options are `"notification"` and `"count"`. Notification badges are orange and count badges are grey. |
| `max-digits`, default: `2` when `type="notification"`, `5` when `type="count"` | Number | Optionally specify a digit limit, after which numbers are truncated. Defaults to two for `"notification"` type and five for `"count"` type. Must be between 1-5.
| `hide-zero`, default: `false` | Boolean | Optionally choose not to show the count badge when the number is zero. |
| `text`  | String | REQUIRED: Descriptive text for the badge which will act as an accessible label and tooltip text when tooltips are enabled. |
| `tab-stop`, default: `false` | Boolean | Optionally choose to make the badge a tab stop. |
| `announce-changes`, default: `false` | Boolean | Optionally choose to announce changes to the badge with an aria-live region. If the text property is changed, the text will be read by screen-readers. |
| `has-tooltip`, default: `false` | Boolean | Optionally choose to have a tooltip below the badge. |
| `focus-ring`, default: `false` | Boolean | Optionally force a focus ring around the badge. This property can be used to highlight the badge when the parent element is focused. |
<!-- docs: end hidden content -->

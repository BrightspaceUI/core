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

<!-- docs: demo code properties name:d2l-count-badge sandboxTitle:'Count Badge' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/count-badge/count-badge.js';
</script>
<d2l-count-badge size="small" type="notification" text="100 new notifications" number="100" has-tooltip tab-stop></d2l-count-badge>
```
<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `number` | Number, required | The number to display on the badge.  Must be a positive integer. |
| `size` | String, default: `small` | The size of the badge. Valid options are `"small"` and `"large"`. |
| `type` | String, default: `count` | The type of the badge. Valid options are `"notification"` and `"count"`. Notification badges are orange and count badges are grey. |
| `max-digits` | Number, default: `2` when `type="notification"`, `5` when `type="count"` | Specifies a digit limit, after which numbers are truncated. Defaults to two for `"notification"` type and five for `"count"` type. Must be between 1-5.
| `hide-zero` | Boolean, default: `false` | Hides the count badge when `number` is zero. |
| `text` | String, required | Descriptive text for the badge which will act as an accessible label and tooltip text when tooltips are enabled. |
| `tab-stop` | Boolean, default: `false` | Adds a tab stop to the badge, which allows screen-reader users to easily tab to the badge. |
| `announce-changes` | Boolean, default: `false` | Announces changes to the badge with an `aria-live` region. If the number property is changed, the text will be read by screenreaders. |
| `has-tooltip` | Boolean, default: `false` | Adds a tooltip on the badge, which will be visible on hover/tab-stop, and read out by screen-readers. |
| `focus-ring` | Boolean, default: `false` | Forces the focus ring around the badge. This property can be used to highlight the badge when the parent element is focused. |
<!-- docs: end hidden content -->

## Count Badge: Icon [d2l-count-badge-icon]

The `d2l-count-badge-icon` element is a web component to display a number count, either in a `"notification"` or `"count"` style with an icon.

<!-- docs: demo code properties name:d2l-count-badge-icon sandboxTitle:'Count Badge Icon' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/count-badge/count-badge-icon.js';
</script>
<d2l-count-badge-icon size="small" icon="tier1:gear" type="notification" text="100 new settings applied." number="100" tab-stop has-tooltip></d2l-count-badge-icon>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `number` | Number, required | The number to display on the badge.  Must be a positive integer. |
| `icon` | String, required | [Preset icon key](../icons#preset-icons) (e.g. `tier1:gear`) |
| `size` | String, default: `small` | The size of the badge. Valid options are `"small"` and `"large"`. |
| `type` | String, default: `count` | The type of the badge. Valid options are `"notification"` and `"count"`. Notification badges are orange and count badges are grey. |
| `max-digits` | Number, default: `2` when `type="notification"`, `5` when `type="count"` | Specifies a digit limit, after which numbers are truncated. Defaults to two for `"notification"` type and five for `"count"` type. Must be between 1-5.
| `hide-zero` | Boolean, default: `false` | Hides the count badge when `number` is zero. |
| `text` | String, required | Descriptive text for the badge which will act as an accessible label and tooltip text when tooltips are enabled. |
| `tab-stop` | Boolean, default: `false` |  Adds a tab stop to the badge, which allows screen-reader users to easily tab to the badge. |
| `announce-changes` | Boolean, default: `false` | Announces changes to the badge with an `aria-live` region. If the number property is changed, the text will be read by screenreaders. |
| `has-tooltip` | Boolean, default: `false` | Adds a tooltip on the badge, which will be visible on hover/tab-stop, and read out by screen-readers. |
| `focus-ring` | Boolean, default: `false` | Forces a focus ring around the badge. This property can be used to highlight the badge when the parent element is focused. |
<!-- docs: end hidden content -->

## Accessibility

- While non-interactable components traditionally shouldn't be focusable, the `tab-stop` property greatly helps screen-reader users find the the count badge
  - Otherwise, screen-reader users would have to use the arrow keys to get to the badge, which can take considerably longer
  - If the optional tooltip is used, then `tab-stop` isn't necessary, as the count-badge becomes focusable to render the tooltip
- The optional tooltip makes use of the [`d2l-toolip`](../../components/tooltip), which follows the [W3C best practices for Tooltips](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
  - The use of this tooltip can help provide additional context such as providing the exact number, if it were to go above the limit set in `max-digits`

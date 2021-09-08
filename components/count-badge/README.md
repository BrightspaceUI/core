# Count Badge

## d2l-count-badge

The `d2l-count-badge` element is a web component to display a number count, either in a `"notification"` or `"count"` style.


![Notification Badge](./screenshots/count-badge-notification-small.png?raw=true)
![Count Badge](./screenshots/count-badge-count-large.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/count-badge/count-badge.js';
</script>
<d2l-count-badge size="small" type="notification" number="100"></d2l-count-badge>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `number` | Number, required | The number to display on the badge.  Must be a positive integer. |
| `size`, default: `small` | String | The size of the badge. Valid options are `"small"` and `"large"`. |
| `type`, default: `count` | String | The type of the badge. Valid options are `"notification"` and `"count"`. Notification badges are orange and count badges are grey. |
| `max-digits`, default: `2` when `type="notification"` | Number | Optionally specify a digit limit, after which numbers are truncated. Defaults to two for `"notification"` type and no limit for `"count"` type.
| `hide-zero`, default: `false` | Boolean | Optionally choose not to show the count badge when the number is zero. |

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!

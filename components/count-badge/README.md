# Count Badge

## d2l-count-badge

The `d2l-count-badge` element is a web component to display a number count, either in a `"notification"` or `"count"` style.


![Notification Badge](./screenshots/count-badge-notification.png?raw=true)
![Count Badge](./screenshots/count-badge-count.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/count-badge/count-badge.js';
</script>
<d2l-count-badge badge-size="small" badge-type="notification" number="100"></d2l-count-badge>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `number` | Number, required | The number to display on the badge. |
| `badge-size`, default: `small` | String | The size of the badge. Valid options are `"small"` and `"large"`. |
| `badge-type`, default: `count` | String | The type of the badge. Valid options are `"notification"` and `"count"`. Notification badges are orange and truncate numbers above 99 to `99+`, while count badges are grey and do not truncate the number. |

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!

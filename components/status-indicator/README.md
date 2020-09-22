# Status Indicator

## d2l-status-indicator

The `d2l-status-indicator` element can be used to communicate the status of an item. It is non-interactive and used to assert prominence on state.

![screenshot of status-indicator component](./screenshots/default-indicator.png)

```html
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>

<d2l-status-indicator state="default" text="Due Today"></d2l-status-indicator>
```

### Variants

#### Subtle
![screenshot of all subtle status indicator variants](./screenshots/subtle-indicators.png)
```html
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>

<d2l-status-indicator state="default" text="due today"></d2l-status-indicator>
<d2l-status-indicator state="success" text="complete"></d2l-status-indicator>
<d2l-status-indicator state="alert" text="overdue"></d2l-status-indicator>
<d2l-status-indicator state="none" text="closed"></d2l-status-indicator>
```

#### Bold
![screenshot of all bold status indicator variants](./screenshots/bold-indicators.png)
```html
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>

<d2l-status-indicator state="default" text="due today" bold></d2l-status-indicator>
<d2l-status-indicator state="success" text="complete" bold></d2l-status-indicator>
<d2l-status-indicator state="alert" text="overdue" bold></d2l-status-indicator>
<d2l-status-indicator state="none" text="closed" bold></d2l-status-indicator>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `text` | String, required | The text that is displayed within the status indicator |
| `bold` | Boolean | Use when the status is very important and needs to have a lot of prominence |
| `state` | String, default: `default` | State of status indicator to display. Can be one of  `default`, `success`, `alert` , `none` |

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!

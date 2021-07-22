# Status Indicators
Status Indicators are used to communicate the status of an item. They are non-interactive and assert prominence on state.

<!-- docs: start hidden content -->
![screenshot of status-indicator component](./screenshots/default-indicator.png)
<!-- docs: end hidden content -->

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>
<style>
  .status-format {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  d2l-status-indicator {
    margin: 5px;
  }
</style>
<div class="status-format">
  <d2l-status-indicator state="default" text="due today"></d2l-status-indicator>
  <d2l-status-indicator state="success" text="complete"></d2l-status-indicator>
  <d2l-status-indicator state="alert" text="overdue"></d2l-status-indicator>
  <d2l-status-indicator state="none" text="closed"></d2l-status-indicator>
</div>

<div class="status-format">
  <d2l-status-indicator state="default" text="due today" bold></d2l-status-indicator>
  <d2l-status-indicator state="success" text="complete" bold></d2l-status-indicator>
  <d2l-status-indicator state="alert" text="overdue" bold></d2l-status-indicator>
  <d2l-status-indicator state="none" text="closed" bold></d2l-status-indicator>
</div>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Only use when status is critical to the users’ workflow.
* Maintain consistent placement when used in a list.
* Limit text values to one word; 2 max.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Render as a link. If the user requires a call to action, use a button.
* Compose the element such that the user will think that that indicator is interactive.
* Avoid using verbs.
* Include additional text in the status badge.
<!-- docs: end donts -->
<!-- docs: end best practices -->


## Status Indicator [d2l-status-indicator]


<!-- docs: demo live name:d2l-status-indicator -->
```html
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>

<d2l-status-indicator state="default" text="Due Today"></d2l-status-indicator>
```
<!-- docs: start hidden content -->
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

### Properties:

| Property | Type | Description |
|--|--|--|
| `text` | String, required | The text that is displayed within the status indicator |
| `bold` | Boolean | Use when the status is very important and needs to have a lot of prominence |
| `state` | String, default: `default` | State of status indicator to display. Can be one of  `default`, `success`, `alert` , `none` |

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->

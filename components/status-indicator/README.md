# Status Indicators

Status Indicators are used to communicate the status of an item. They are non-interactive and assert prominence on state.

```html
<!-- docs: demo -->
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>

<d2l-status-indicator state="default" text="Subtle"></d2l-status-indicator>
<d2l-status-indicator state="alert" text="Bold" bold></d2l-status-indicator>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Only use when status is critical to the users’ workflow.
* Maintain consistent placement when used in a list.
* Limit text values to one word; 2 max.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't render as a link. If the user requires a call to action, use a button.
* Don't compose the element such that the user will think that that indicator is interactive.
* Avoid verbs.
* Don't include additional text in the status badge.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Status Indicator

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
</script>

<d2l-status-indicator state="success" text="complete"></d2l-status-indicator>
```

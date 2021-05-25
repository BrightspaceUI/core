# Calendar

The `d2l-calendar` component can be used to display a responsively sized calendar that allows for date selection. It indicates the currently selected date if `selected-value` is specified, or if the user selects a date.

```html
<script type="module">
  import '@brightspace-ui/core/components/calendar/calendar.js';
</script>
<d2l-calendar summary="Click on a day to select it as the assignment due date.">
</d2l-calendar>
```

## Accessibility

To make your usage of `d2l-calendar` accessible, use the following property when applicable:

| Attribute | Description |
|--|--|
| `summary` | Use to provide more context on the calendar usage. |

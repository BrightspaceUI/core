# Calendars

The `d2l-calendar` component can be used to display a responsively sized calendar that allows for date selection. It indicates the currently selected date if `selected-value` is specified, or if the user selects a date.

## Calendar [d2l-calendar]

<!-- docs: demo code properties name:d2l-calendar display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/calendar/calendar.js';
</script>
<d2l-calendar selected-value="2020-05-09" summary="Click on a day to select it.">
</d2l-calendar>
```

<!-- docs: start hidden content -->
### Properties

Note: All `*-value` properties should be in ISO 8601 calendar date format (`YYYY-MM-DD`) and should be localized to the user's timezone (if applicable).

| Property | Type | Description |
|--|--|--|
| `max-value` | String | Maximum valid date that could be selected by a user. |
| `min-value` | String |  Minimum valid date that could be selected by a user. |
| `selected-value` | String | Currently selected date. |
| `summary` | String | Summary of the calendar for accessibility. |

### Events

* `d2l-calendar-selected`: dispatched when a date is selected through click, space, or enter. `e.detail.date` is in ISO 8601 calendar date format (`YYYY-MM-DD`).
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-calendar` accessible, use the following property when applicable:

| Attribute | Description |
|--|--|
| `summary` | Use to provide more context on the calendar usage. |

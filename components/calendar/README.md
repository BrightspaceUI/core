# Calendars

The `d2l-calendar` component can be used to display a responsively sized calendar that allows for date selection. It indicates the currently selected date if `selected-value` is specified, or if the user selects a date.

## Calendar [d2l-calendar]

<!-- docs: demo code properties name:d2l-calendar sandboxTitle:'Calendar' display:block -->
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
| `summary` | String | ACCESSIBILITY: Summary of the calendar used by screen reader users for identifying the calendar and/or summarizing its purpose. |

### Events

* `d2l-calendar-selected`: dispatched when a date is selected through click, space, or enter. `e.detail.date` is in ISO 8601 calendar date format (`YYYY-MM-DD`).
<!-- docs: end hidden content -->

## Accessibility

The Daylight calendar (`d2l-calendar`) was built as a part of the date picker initiative and generally follows the W3C's best practice recommendations for a [Date picker dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/). Of note is the keyboard behaviour following the [grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/).

The W3C recommendations, specifically relating to `attributes` on the calendar's table elements, were followed as much as possible. However, at the time of development it was not possible to create a calendar with a `grid` role which had the desired appearance, functionality, and supported all browser/screen reader combinations that we support. We aimed to create the same experience for screen reader users as recommended by the example (e.g., announcing the expected content), but had to go about it in a more complex manner. The calendar implementation emphasized the importance of thorough screen reader testing across all supported options.
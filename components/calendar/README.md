# Calendar

The `d2l-calendar` component can be used to display a responsively sized calendar that allows for date selection. It indicates a currently selected date, and if no `selected-value` is specified, the current date will be indicated as the selected date.

![Calendar](./screenshots/calendar.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/calendar/calendar.js';
</script>
<!-- Today is January 16, 2020 -->
<d2l-calendar
	selected-value="2020-01-09"
	summary="Click on a day to select it as the assignment due date.">
</d2l-calendar>
```

**Properties:**

- `selected-value` (String): Currently selected date. This should be in ISO 8601 Extended Format (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- `summary` (String): Summary of the calendar for accessibility.

**Events:**

* `d2l-calendar-selected`: dispatched when a date is selected through click, space, or enter. `e.detail.date` is an object representing the selected date. For example, if January 1, 2020 is selected, the date will be `{month: 0, date: 1, year: 2020}`.

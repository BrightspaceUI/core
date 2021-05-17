# Date & Time Inputs

```html
<!-- docs: demo -->
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date.js';
  import '@brightspace-ui/core/components/inputs/input-time.js';
  import '@brightspace-ui/core/components/inputs/input-date-time.js';
</script>
<d2l-input-date label="Date Input"></d2l-input-date>
<d2l-input-time label="Time Input"></d2l-input-time>
<d2l-input-date-time label="Date-Time Input"></d2l-input-date-time>
```

## Date Input

The `<d2l-input-date>` component consists of a text input field for typing a date and an attached calendar (`<d2l-calendar>`) dropdown. The dropdown opens on click of the text input, or on enter or down arrow press if the text input is focused. It displays the `value` if one is specified, or a placeholder if not, and reflects the selected value when one is selected in the `d2l-calendar` or entered in the text input.

Note: All `*value` properties should be in ISO 8601 calendar date format (`YYYY-MM-DD`) and should be [localized to the user's timezone](#timezone) (if applicable).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date.js';
</script>
<d2l-input-date label="Birthdate">
</d2l-input-date>
```

**Accessibility:**

To make your usage of `d2l-input-date` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |

## Date Range Input

The `<d2l-input-date-range>` component consists of two input-date components - one for the start of a range and one for the end of a range. Values specified for these components (through the `start-value` and/or `end-value` attributes) are displayed if specified, and selected values are reflected.

Note: All `*value` properties should be in ISO 8601 calendar date format (`YYYY-MM-DD`) and should be [localized to the user's timezone](#timezone) (if applicable).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date-range.js';
</script>
<d2l-input-date-range label="Assignment Availability Range">
</d2l-input-date-range>
```

**Accessibility:**

To make your usage of `d2l-input-date-range` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `end-label` | Accessible label for the second date input |
| `start-label` | Accessible label for the first date input |

## Time Input

The `<d2l-input-time>` component consists of a text input field for typing a time and an attached dropdown for time selection. The dropdown opens on click of the text input, or on enter or down arrow press if the text input is focused. It displays the `value` if one is specified, or a placeholder if not, and reflects the selected value when one is selected in the dropdown or entered in the text input.

Note: All `*value` properties should be in ISO 8601 time format (`hh:mm:ss`) and should be [localized to the user's timezone](#timezone) (if applicable).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-time.js';
</script>
<d2l-input-time label="Appointment Time">
</d2l-input-time>
```

**Accessibility:**

To make your usage of `d2l-input-time` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |

## Time Range Input

The `<d2l-input-time-range>` component consists of two input-time components - one for the start of a range and one for the end of a range. Values specified for these components (through the `start-value` and/or `end-value` attributes) are displayed if specified, and selected values are reflected.

Note: All `*value` properties should be in ISO 8601 time format (`hh:mm:ss`) and should be [localized to the user's timezone](#timezone) (if applicable).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-time-range.js';
</script>
<d2l-input-time-range label="Times">
</d2l-input-time-range>
```

**Accessibility:**

To make your usage of `d2l-input-time-range` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `end-label` | Accessible label for the second time input |
| `start-label` | Accessible label for the first time input |

## Date-Time Input

The `<d2l-input-date-time>` component consists of a `<d2l-input-date>` and a `<d2l-input-time>` component. The time input only appears once a date is selected. This component displays the `value` if one is specified, and reflects the selected value when one is selected or entered.

Note: All `*value` properties should be in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`) and in UTC time (i.e., do NOT localize to the user's timezone).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date-time.js';
</script>
<d2l-input-date-time label="Due Date">
</d2l-input-date-time>
```

**Accessibility:**

To make your usage of `d2l-input-date-time` accessible, use the following property:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/) |

## Date-Time Range Input

The `<d2l-input-date-time-range>` component consists of two input-date-time components - one for the start of a range and one for the end of a range. Values specified for these components (through the `start-value` and/or `end-value` attributes) are displayed if specified, and selected values are reflected.

Note: All `*value` properties should be in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`) and in UTC time (i.e., do NOT localize to the user's timezone).

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date-time-range.js';
</script>
<d2l-input-date-time-range label="Assignment Availability Range">
</d2l-input-date-time-range>
```

**Accessibility:**

To make your usage of `d2l-input-date-time-range` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `end-label` | Accessible label for the second date-time input |
| `start-label` | Accessible label for the first date-time input |

## Timezone

The `input-date-time` and `input-date-time-range` components expect an input in UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`). These components will convert a value automatically to the user's timezone to display the date/time to them, and then will provide the value back in UTC. No timezone conversions are needed.

The `input-date`, `input-date-range`, `input-time`, and `input-time-range` components do not handle timezone and so require the input to be in the user's timezone (if applicable), which corresponds to the user's timezone as specified in their account settings. The consumer of the component will need to handle any necessary UTC to local to UTC conversions. The following methods can be used for these conversions:
* `getLocalDateTimeFromUTCDateTime(utcDateTime)` (where `utcDateTime` is the date/time in the format `YYYY-MM-DDTHH:mm:ss.sssZ`) returns the date/time in the format `YYYY-MM-DDTHH:mm:ss.sss` in the user's local timezone
* `getUTCDateTimeFromLocalDateTime(localDate, localTime)` (where `localDate` and `localTime` are the date and time in the user's local timezone) returns the date/time in the format `YYYY-MM-DDTHH:mm:ss.sssZ` in UTC

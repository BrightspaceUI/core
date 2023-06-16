# Date & Time Inputs

Use date and time inputs to set dates and times in forms. They are available as separate inputs (date or time) or as a combined date & time input, and each of them is also available as a range.

<!-- docs: demo align:flex-start autoOpen:true autoSize:false size:xlarge -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date.js';
  import '@brightspace-ui/core/components/inputs/input-time.js';
</script>
<d2l-input-date label="Date Input"></d2l-input-date>
<d2l-input-time label="Time Input"></d2l-input-time>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use short but descriptive labels like "Start Date" or "Due Date"
* Offer reasonable defaults whenever possible
* Use date and time values relative to the user's [timezone](#timezone)
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't combine inputs to form a range, use an actual range input instead; this will handle layout and validation automatically
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Date Input [d2l-input-date]

Use the `<d2l-input-date>` component when users need to choose a single date. It consists of a text input field for typing a date and an attached calendar (`<d2l-calendar>`) dropdown. The dropdown opens on click of the text input, or on enter or down arrow press if the text input is focused. It displays the `value` if one is specified, or a placeholder if not, and reflects the selected value when one is selected in the `d2l-calendar` or entered in the text input.

Note: All `*value` properties should be in ISO 8601 calendar date format (`YYYY-MM-DD`) and should be [localized to the user's timezone](#timezone) (if applicable).

<!-- docs: demo code properties name:d2l-input-date align:flex-start autoSize:false size:xlarge -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date.js';
</script>
<d2l-input-date label="Birthdate">
</d2l-input-date>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `label` | String, **required** | Accessible label for the input |
| `disabled` | Boolean | Disables the input |
| `empty-text` | String | Text to reassure users that they can choose not to provide a value in this field (usually not necessary) |
| `label-hidden` | Boolean | Hides the label visually (moves it to the input's `aria-label` attribute) |
| `labelled-by` | String | HTML id of an element in the same shadow root which acts as the input's label |
| `max-value` | String | Maximum valid date that could be selected by a user. |
| `min-value` | String | Minimum valid date that could be selected by a user. |
| `opened` | Boolean | Indicates if the calendar dropdown is open |
| `required` | Boolean | Indicates that a value is required |
| `value` | String, default `''` | Value of the input. |

### Events

* `change`: dispatched when a date is selected or typed. `value` reflects the selected value and is in ISO 8601 calendar date format (`YYYY-MM-DD`).
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-input-date` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `labelled-by` | String | Use when another visible element should act as the label |

## Date Range Input [d2l-input-date-range]

Use the `<d2l-input-date-range>` component when users need to enter two dates in a range, like a course start and end date. The component consists of two input-date components - one for the start of a range and one for the end of a range. Values specified for these components (through the `start-value` and/or `end-value` attributes) are displayed if specified, and selected values are reflected.

Note: All `*value` properties should be in ISO 8601 calendar date format (`YYYY-MM-DD`) and should be [localized to the user's timezone](#timezone) (if applicable).

<!-- docs: demo code properties name:d2l-input-date-range align:flex-start autoSize:false size:xlarge -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date-range.js';
</script>
<d2l-input-date-range label="Availability Range">
</d2l-input-date-range>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `label` | String, **required** | Accessible label for the input fieldset that wraps the date inputs |
| `auto-shift-dates` | Boolean | Automatically shifts end date when start date changes to keep the same range |
| `child-labels-hidden` | Boolean | Visually hides the labels for start and end date inputs |
| `disabled` | Boolean | Disables the inputs |
| `end-label` | String, default `'End Date'` | Accessible label for the second date input |
| `end-opened` | Boolean | Indicates if the end calendar dropdown is open |
| `end-value` | String, default `''` | Value of the second date input |
| `inclusive-date-range` | Boolean | Validate on inclusive range (i.e., it is valid for start and end dates to be equal) |
| `label-hidden` | Boolean | Hides the fieldset label visually |
| `max-value` | String | Maximum valid date that could be selected by a user |
| `min-value` | String |  Minimum valid date that could be selected by a user |
| `required` | Boolean | Indicates that values are required |
| `start-label` | String, default `'Start Date'` | Accessible label for the first date input |
| `start-opened` | Boolean | Indicates if the start calendar dropdown is open |
| `start-value` | String, default `''` | Value of the first date input |

### Events

* `change`: dispatched when a start or end date is selected or typed. `start-value` reflects the value of the first input, `end-value` reflects the value of the second input, and both are in ISO 8601 calendar date format (`YYYY-MM-DD`).
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-input-date-range` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `end-label` | Accessible label for the second date input |
| `start-label` | Accessible label for the first date input |

## Time Input [d2l-input-time]

Use the `<d2l-input-time>` component when users need to enter a time, without a date. The component consists of a text input field for typing a time and an attached dropdown for time selection. The dropdown opens on click of the text input, or on enter or down arrow press if the text input is focused. It displays the `value` if one is specified, or a placeholder if not, and reflects the selected value when one is selected in the dropdown or entered in the text input.

Note: All `*value` properties should be in ISO 8601 time format (`hh:mm:ss`) and should be [localized to the user's timezone](#timezone) (if applicable).

<!-- docs: demo code properties name:d2l-input-time align:flex-start autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-time.js';
</script>
<d2l-input-time label="Time">
</d2l-input-time>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `label` | String, **required** | Accessible label for the input |
| `default-value` | String, default:`'00:00:00'` | Set default value of input. Accepts ISO 8601 time format (`hh:mm:ss`) and the following keywords: `startOfDay`,`endOfDay`. |
| `disabled` | Boolean | Disables the input |
| `enforce-time-intervals` | Boolean | Rounds up to nearest valid interval time (specified with `time-interval`) when user types a time |
| `label-hidden` | Boolean | Hides the label visually (moves it to the input's `aria-label` attribute) |
| `labelled-by` | String | HTML id of an element in the same shadow root which acts as the input's label |
| `opened` | Boolean | Indicates if the dropdown is open |
| `required` | Boolean | Indicates that a value is required |
| `time-interval` | String, default: `thirty` | Number of minutes between times shown in dropdown. Valid values include `five`, `ten`, `fifteen`, `twenty`, `thirty`, and `sixty`. |
| `value` | String, default `''` | Value of the input. This should be in ISO 8601 time format (`hh:mm:ss`) and should be [localized to the user's timezone](#timezone) (if applicable). |

### Events

* `change`: dispatched when a time is selected or typed. `value` reflects the selected value and is in ISO 8601 time format (`hh:mm:ss`).
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-input-time` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `labelled-by` | Use when another visible element should act as the label |

## Time Range Input [d2l-input-time-range]

Use the `<d2l-input-time-range>` component when users need to enter two times in a range, and the date is already known. The component consists of two input-time components - one for the start of a range and one for the end of a range. Values specified for these components (through the `start-value` and/or `end-value` attributes) are displayed if specified, and selected values are reflected.

Note: All `*value` properties should be in ISO 8601 time format (`hh:mm:ss`) and should be [localized to the user's timezone](#timezone) (if applicable).

<!-- docs: demo code properties name:d2l-input-time-range align:flex-start autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-time-range.js';
</script>
<d2l-input-time-range label="Availability Range">
</d2l-input-time-range>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `label` | String, **required** | Accessible label for the input fieldset that wraps the time inputs |
| `auto-shift-times` | Boolean | Automatically shifts end time when start time changes to keep the same range |
| `child-labels-hidden` | Boolean | Visually hides the labels for start and end time inputs |
| `disabled` | Boolean | Disables the inputs |
| `end-label` | String, default `'End Time'` | Accessible label for the second time input |
| `end-opened` | Boolean | Indicates if the end dropdown is open |
| `end-value` | String, default `''` | Value of the second time input |
| `enforce-time-intervals` | Boolean | Rounds up to nearest valid interval time (specified with `time-interval`) when user types a time |
| `inclusive-time-range` | Boolean | Validate on inclusive range (i.e., it is valid for start and end times to be equal) |
| `label-hidden` | Boolean | Hides the fieldset label visually |
| `required` | Boolean | Indicates that values are required |
| `start-label` | String, default `'Start Time'` | Accessible label for the first time input |
| `start-opened` | Boolean | Indicates if the start dropdown is open |
| `start-value` | String, default `''` | Value of the first time input |
| `time-interval` | String, default: `thirty` | Number of minutes between times shown in dropdown. Valid values include `five`, `ten`, `fifteen`, `twenty`, `thirty`, and `sixty`. |
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-input-time-range` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `end-label` | Accessible label for the second time input |
| `start-label` | Accessible label for the first time input |

## Date-Time Input [d2l-input-date-time]

Use the `<d2l-input-date-time>` component when users need to enter a single date and time, like a due date. The component consists of a `<d2l-input-date>` and a `<d2l-input-time>` component. The time input only appears once a date is selected. This component displays the `value` if one is specified, and reflects the selected value when one is selected or entered.

Note: All `*value` properties should be in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`) and in UTC time (i.e., do NOT localize to the user's timezone).

<!-- docs: demo code properties name:d2l-input-date-time align:flex-start autoSize:false size:xlarge -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date-time.js';
</script>
<d2l-input-date-time label="Due Date">
</d2l-input-date-time>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `label` | String, **required** | Accessible label for the input |
| `disabled` | Boolean | Disables the input |
| `label-hidden` | Boolean | Hides the fieldset label visually |
| `labelled-by` | String | HTML id of an element in the same shadow root which acts as the input's label |
| `localized` | Boolean | Indicates that any timezone localization will be handeld by the consumer and so any values will not be converted from/to UTC |
| `max-value` | String | Maximum valid date/time that could be selected by a user |
| `min-value` | String | Minimum valid date/time that could be selected by a user |
| `opened` | Boolean | Indicates if the date or time dropdown is open |
| `required` | Boolean | Indicates that a value is required |
| `time-default-value`| String, default:`'00:00:00'` | Set default value of time input. Accepts ISO 8601 time format (`hh:mm:ss`) and the following keywords: `startOfDay`,`endOfDay`. |
| `value` | String, default `''` | Value of the input. |

### Events

* `change`: dispatched when there is a change in selected date or selected time (when date is already selected). `value` reflects the selected value and is in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`).
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-input-date-time` accessible, use the following property:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/) |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `labelled-by` | String | Use when another visible element should act as the label |

## Date-Time Range Input [d2l-input-date-time-range]

Use the `<d2l-input-date-time-range>` component when users need to enter two dates and times in a range, like an assignment start and end date/time. The component consists of two input-date-time components - one for the start of a range and one for the end of a range. Values specified for these components (through the `start-value` and/or `end-value` attributes) are displayed if specified, and selected values are reflected.

Note: All `*value` properties should be in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`) and in UTC time (i.e., do NOT localize to the user's timezone).

<!-- docs: demo code properties name:d2l-input-date-time-range align:flex-start autoSize:false size:xlarge -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date-time-range.js';
</script>
<d2l-input-date-time-range label="Availability Range">
</d2l-input-date-time-range>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `label` | String, **required** | Accessible label for the input fieldset that wraps the date-time inputs |
| `auto-shift-dates` | Boolean | Automatically shifts end date when start date changes to keep the same range |
| `child-labels-hidden` | Boolean | Visually hides the labels for start and end date-time inputs |
| `disabled` | Boolean | Disables the inputs |
| `end-label` | String, default `'End Date'` | Accessible label for the second date-time input |
| `end-opened` | Boolean | Indicates if the end date or time dropdown is open |
| `end-value` | String, default `''` | Value of the second date-time input |
| `inclusive-date-range` | Boolean | Validate on inclusive range (i.e., it is valid for start and end date-times to be equal) |
| `label-hidden` | Boolean | Hides the fieldset label visually |
| `required` | Boolean | Indicates that values are required |
| `start-label` | String, default `'Start Date'` | Accessible label for the first date-time input |
| `start-opened` | Boolean | Indicates if the start date or time dropdown is open |
| `start-value` | String, default `''` | Value of the first date-time input |

### Events

* `change`: dispatched when a start or end date is selected or typed. `start-value` reflects the value of the first input, `end-value` reflects the value of the second input, and both are in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`) and in UTC time.
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-input-date-time-range` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `end-label` | Accessible label for the second date-time input |
| `start-label` | Accessible label for the first date-time input |

## Timezone

The `input-date-time` and `input-date-time-range` components expect input in UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`). These components will convert values automatically to the user's timezone to display the date/time to them, and then will provide the value back in UTC. No timezone conversions are needed.

The `input-date`, `input-date-range`, `input-time`, and `input-time-range` components do not handle timezone and so require the input to be in the user's timezone (if applicable), which corresponds to the user's timezone as specified in their account settings. The consumer of the component will need to handle any necessary UTC to local to UTC conversions. The following methods can be used for these conversions:
* `getLocalDateTimeFromUTCDateTime(utcDateTime)` (where `utcDateTime` is the date/time in the format `YYYY-MM-DDTHH:mm:ss.sssZ`) returns the date/time in the format `YYYY-MM-DDTHH:mm:ss.sss` in the user's local timezone
* `getUTCDateTimeFromLocalDateTime(localDate, localTime)` (where `localDate` and `localTime` are the date and time in the user's local timezone) returns the date/time in the format `YYYY-MM-DDTHH:mm:ss.sssZ` in UTC

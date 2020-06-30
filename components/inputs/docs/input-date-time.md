# Date & Time Inputs

## Date Inputs

The `<d2l-input-date>` component consists of a text input field for typing a date and an attached calendar (`<d2l-calendar>`) dropdown. The dropdown opens on click of the text input, or on enter or down arrow press if the text input is focused. It displays the `value` if one is specified, or a placeholder if not, and reflects the selected value when one is selected in the `d2l-calendar` or entered in the text input.

![example screenshot of date input](../screenshots/date.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date.js';
</script>
<d2l-input-date
  label="Start Date"
  value="2020-11-20">
</d2l-input-date>
```

**Properties:**

Note: All `*value` properties should be in ISO 8601 calendar date format (`YYYY-MM-DD`) and should be [localized to the user's timezone](#timezone) (if applicable).

| Property | Type | Description |
|--|--|--|
| `label` | String, **required** | Accessible label for the input |
| `disabled` | Boolean | Disables the input |
| `empty-text` | String | Text to reassure users that they can choose not to provide a value in this field (usually not necessary) |
| `label-hidden` | Boolean | Hides the label visually (moves it to the input's `aria-label` attribute) |
| `max-value` | String | Maximum valid date that could be selected by a user. |
| `min-value` | String |  Minimum valid date that could be selected by a user. |
| `value` | String, default `''` | Value of the input. |

**Accessibility:**

To make your usage of `d2l-input-date` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |

**Events:**

* `change`: dispatched when a date is selected or typed. `value` reflects the selected value and is in ISO 8601 calendar date format (`YYYY-MM-DD`).

### Date Range Inputs

The `<d2l-input-date-range>` component consists of two input-date components - one for the start of a range and one for the end of a range. Values specified for these components (through the `start-value` and/or `end-value` attributes) are displayed if specified, and selected values are reflected.

![example screenshot of date range input](../screenshots/date-range.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date-range.js';
</script>
<d2l-input-date
  label="Assignment Dates"
  start-value="2020-11-20"
  end-value="2021-01-01">
</d2l-input-date>
```

**Properties:**

Note: All `*value` properties should be in ISO 8601 calendar date format (`YYYY-MM-DD`) and should be [localized to the user's timezone](#timezone) (if applicable).

| Property | Type | Description |
|--|--|--|
| `label` | String, **required** | Accessible label for the input fieldset that wraps the date inputs |
| `disabled` | Boolean | Disables the inputs |
| `end-label` | String, default `'End Date'` | Accessible label for the second date input |
| `end-value` | String, default `''` | Value of the second date input |
| `label-hidden` | Boolean | Hides the fieldset label visually |
| `max-value` | String | Maximum valid date that could be selected by a user |
| `min-value` | String |  Minimum valid date that could be selected by a user |
| `start-label` | String, default `'Start Date'` | Accessible label for the first date input |
| `start-value` | String, default `''` | Value of the first date input |

**Accessibility:**

To make your usage of `d2l-input-date` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |
| `end-label` | String, default `'End Date'` | Accessible label for the second date input |
| `start-label` | String, default `'Start Date'` | Accessible label for the first date input |

**Events:**

* `change`: dispatched when a start or end date is selected or typed. `start-value` reflects the value of the first input, `end-value` reflects the value of the second input, and both are in ISO 8601 calendar date format (`YYYY-MM-DD`).

## Time Inputs

The `<d2l-input-time>` component consists of a text input field for typing a time and an attached dropdown for time selection. The dropdown opens on click of the text input, or on enter or down arrow press if the text input is focused. It displays the `value` if one is specified, or a placeholder if not, and reflects the selected value when one is selected in the dropdown or entered in the text input.

![example screenshot of time input](../screenshots/time.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-time.js';
</script>
<d2l-input-time
  label="Start Time"
  value="18:00:00">
</d2l-input-time>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `label` | String, **required** | Accessible label for the input |
| `default-value` | String, default:`'00:00:00'` | Set default value of input. Accepts ISO 8601 time format (`hh:mm:ss`) and the following keywords: `startOfDay`,`endOfDay`. |
| `disabled` | Boolean | Disables the input |
| `enforce-time-intervals` | Boolean | Rounds up to nearest valid interval time (specified with `time-interval`) when user types a time |
| `label-hidden` | Boolean | Hides the label visually (moves it to the input's `aria-label` attribute) |
| `time-interval` | String, default: `thirty` | Number of minutes between times shown in dropdown. Valid values include `five`, `ten`, `fifteen`, `twenty`, `thirty`, and `sixty`. |
| `value` | String, default `''` | Value of the input. This should be in ISO 8601 time format (`hh:mm:ss`) and should be [localized to the user's timezone](#timezone) (if applicable). |

**Accessibility:**

To make your usage of `d2l-input-time` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |

**Events:**

* `change`: dispatched when a time is selected or typed. `value` reflects the selected value and is in ISO 8601 time format (`hh:mm:ss`).

## Date-Time Inputs

The `<d2l-input-date-time>` component consists of a `<d2l-input-date>` and a `<d2l-input-time>` component. The time input only appears once a date is selected. This component displays the `value` if one is specified, and reflects the selected value when one is selected or entered.

![example screenshot of date input](../screenshots/date-time.gif?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-date-time.js';
</script>
<d2l-input-date-time
  label="Start Date"
  value="2020-11-20T12:00:00.000Z">
</d2l-input-date-time>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `label` | String, **required** | Accessible label for the input |
| `disabled` | Boolean | Disables the input |
| `value` | String, default `''` | Value of the input. This should be in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`) and in UTC time (i.e., do NOT localize to the user's timezone). |

**Accessibility:**

To make your usage of `d2l-input-date-time` accessible, use the following property:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/) |

**Events:**

* `change`: dispatched when there is a change in selected date or selected time (when date is already selected). `value` reflects the selected value and is in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`).

## Timezone

The `input-date-time` component expects an input in UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`), will convert automatically to the user's timezone to display the date/time to them, and then will provide the value back as UTC. No timezone conversions are needed.

The `input-date` and `input-time` components do not handle timezone and so require the input to be in the user's timezone (if applicable), which corresponds to the user's timezone as specified in their account settings. The consumer of the component will need to handle any necessary UTC to local to UTC conversions. The following methods can be used for these conversions:
* `getLocalDateTimeFromUTCDateTime(utcDateTime)` (where `utcDateTime` is the date/time in the format `YYYY-MM-DDTHH:mm:ss.sssZ`) returns the date/time in the format `YYYY-MM-DDTHH:mm:ss.sss` in the user's local timezone
* `getUTCDateTimeFromLocalDateTime(localDate, localTime)` (where `localDate` and `localTime` are the date and time in the user's local timezone) returns the date/time in the format `YYYY-MM-DDTHH:mm:ss.sssZ` in UTC

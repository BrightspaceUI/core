# Date & Time Inputs

## Date Inputs

The `<d2l-input-date>` component consists of a text input field for typing a date and an attached calendar (`<d2l-calendar>`) dropdown. The dropdown opens on click of the text input, or on enter or down arrow press if the text input is focused. It displays the `value` if one is specified, or a placeholder if not, and reflects the selected value when one is selected in the `calendar` or entered in the text input.

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

- `label` (String, required): accessible label for the input
- `disabled` (Boolean): disables the input
- `label-hidden` (Boolean): hides the label visually (moves it to the input's `aria-label` attribute)
- `value` (String, default: `''`): value of the input. This should be in ISO 8601 calendar date format (`YYYY-MM-DD`) and should be [localized to the user's timezone](#timezone) (if applicable).

**Accessibility:**

To make your usage of `d2l-input-date` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/). Visible unless `label-hidden` is also used. |
| `label-hidden` | Use if label should be visually hidden but available for screen reader users |

**Events:**

* `change`: dispatched when a date is selected or typed. `value` reflects the selected value and is in ISO 8601 calendar date format (`YYYY-MM-DD`).

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

- `label` (String, required): accessible label for the input
- `disabled` (Boolean): disables the input
- `enforce-time-intervals` (Boolean): rounds up to nearest valid interval time (specified with `time-interval`) when user types a time
- `label-hidden` (Boolean): hides the label visually (moves it to the input's `aria-label` attribute)
- `time-interval` (String, default: `thirty`): number of minutes between times shown in dropdown. Valid values include `five`, `ten`, `fifteen`, `twenty`, `thirty`, and `sixty`.
- `value` (String, default: `''`): value of the input. This should be in ISO 8601 time format (`hh:mm:ss`) and should be [localized to the user's timezone](#timezone) (if applicable).

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

- `label` (String, required): accessible label for the input
- `disabled` (Boolean): disables the input
- `value` (String, default: `''`): value of the input. This should be in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`) and in UTC time (i.e., do NOT localize to the user's timezone).

**Accessibility:**

To make your usage of `d2l-input-date-time` accessible, use the following property:

| Attribute | Description |
|--|--|
| `label` | **REQUIRED** [Acts as a primary label on the input](https://www.w3.org/WAI/tutorials/forms/labels/) |

**Events:**

* `change`: dispatched when a change in selected date or selected time (when date is already selected). `value` reflects the selected value and is in ISO 8601 combined date and time format (`YYYY-MM-DDTHH:mm:ss.sssZ`).

## Timezone

The `input-date` and `input-time` components do not handle timezone and so require the input to be in the user's timezone, which corresponds to the timezone in the `data-timezone` attribute on the `html` element.

### Convert UTC Date/Time to Local Date

To convert a UTC date/time (presumably in ISO 8601 format, `YYYY-MM-DDTHH:mm:ss.sssZ`, adjust if not) to a date in the user's timezone for use in `input-date`:
- Parse into object (`parseISODateTime` from `helpers/dateTime.js`)
- Convert UTC object into local timezone object (`convertUTCToLocalDateTime` from the [intl library](https://github.com/BrightspaceUI/intl#datetime-conversion-based-on-user-timezone))
- Format as ISO 8601 date (`formatDateInISO` from `helpers/dateTime.js`)

```javascript
import {convertUTCToLocalDateTime} from '@brightspace-ui/intl/lib/dateTime.js';
import {formatDateInISO, parseISODateTime} from '@brightspace-ui/core/helpers/dateTime.js';

const UTCDateTime = '2018-03-01T12:20:00.000Z';
const UTCDateTimeObject = parseISODateTime(UTCDateTime);
const localDateTime = convertUTCToLocalDateTime(UTCDateTimeObject);
const value = formatDateInISO(localDateTime); // use as value in input-date
```
### Convert UTC Date/Time to Local Time

To convert a UTC date/time (presumably in ISO 8601 format, `YYYY-MM-DDTHH:mm:ss.sssZ`, adjust if not) to a time in the user's timezone for use in `input-time`:
- Parse into object (`parseISODateTime` from `helpers/dateTime.js`)
- Convert UTC object into local timezone object (`convertUTCToLocalDateTime` from the [intl library](https://github.com/BrightspaceUI/intl#datetime-conversion-based-on-user-timezone))
- Format as ISO 8601 date or time (`formatTimeInISO` from `helpers/dateTime.js`)

```javascript
import {convertUTCToLocalDateTime} from '@brightspace-ui/intl/lib/dateTime.js';
import {formatTimeInISO, parseISODateTime} from '@brightspace-ui/core/helpers/dateTime.js';

const UTCDateTime = '2018-03-01T12:20:00.000Z';
const UTCDateTimeObject = parseISODateTime(UTCDateTime);
const localDateTime = convertUTCToLocalDateTime(UTCDateTimeObject);
const value = formatTimeInISO(localDateTime); // use as value in input-time
```

### Convert Local Date to UTC Date/Time

To convert a date in local timezone (obtained from `input-date`) back to UTC:
- Parse date into object (`parseISODate` from `helpers/dateTime.js`)
- Use initial local time that was obtained from `convertUTCToLocalDateTime` (as in above example "Convert UTC Date/Time to Local Date") in object form and merge with date object
- Convert local date/time object into UTC object (`convertLocalToUTCDateTime` from the [intl library](https://github.com/BrightspaceUI/intl#datetime-conversion-based-on-user-timezone))
- Format as ISO 8601 combined date and time (`formatDateTimeInISO` from `helpers/dateTime.js`)

```javascript
import {convertLocalToUTCDateTime} from '@brightspace-ui/intl/lib/dateTime.js';
import {formatDateTimeInISO, parseISODate} from '@brightspace-ui/core/helpers/dateTime.js';

const value = '2018-04-10'; // value output from input-date
const date = parseISODate(value);
const time = {
	hours: localDateTime.hours,
	minutes: localDateTime.minutes,
	seconds: localDateTime.seconds
};
const utcDateTime = convertLocalToUTCDateTime(Object.assign(date, time));
const isoFormattedUTCDateTime = formatDateTimeInISO(utcDateTime);
```

### Convert Local Time to UTC Date/Time

To convert a time in local timezone (obtained from `input-time`) back to UTC:
- Parse time into object (`parseISOTime` from `helpers/dateTime.js`)
- Use initial local date that was obtained from `convertUTCToLocalDateTime` (as in above example "Convert UTC Date/Time to Local Time") in object form and merge with time object
- Convert local date/time object into UTC object (`convertLocalToUTCDateTime` from the [intl library](https://github.com/BrightspaceUI/intl#datetime-conversion-based-on-user-timezone))
- Format as ISO 8601 combined date and time (`formatDateTimeInISO` from `helpers/dateTime.js`)

```javascript
import {convertLocalToUTCDateTime} from '@brightspace-ui/intl/lib/dateTime.js';
import {formatDateTimeInISO, parseISOTime} from '@brightspace-ui/core/helpers/dateTime.js';

const value = '12:20:00'; // value output from input-time
const time = parseISOTime(value);
const date = {
	year: localDateTime.year,
	month: localDateTime.month,
	date: localDateTime.date
};
const utcDateTime = convertLocalToUTCDateTime(Object.assign(date, time));
const isoFormattedUTCDateTime = formatDateTimeInISO(utcDateTime);
```


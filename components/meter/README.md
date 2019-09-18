# Meter Components

**Note:** these are referred to as "progress meters" on [design.d2l](http://design.d2l/components/progress-meters/).

## d2l-meter-linear

Linear meters show a horizontal progress bar.

![Linear meter with no progress](./screenshots/d2l-meter-linear-no-progress.png?raw=true)
![Linear meter with some progress](./screenshots/d2l-meter-linear-has-progress.png?raw=true)
![Linear meter completed](./screenshots/d2l-meter-linear-completed.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-linear.js';
</script>
<d2l-meter-linear value="3" max="10"></d2l-meter-linear>
```

**Properties:**

- `value` (required, Number): Current number of completed units. A positive, non-zero number that is less than or equal to `max`.
- `max` (required, Number): Max number of units that are being measured by this meter. A positive, non-zero number.
- `percent` (optional, Boolean): Shows a percentage instead of `value/max`.
- `text-inline` (optional, Boolean): Keeps the meter to a single line.
- `text` (optional, String): Context information about what the meter is about.
	- `{%}` in the string will be replaced with percentage value
	- `{x/y}` in the string will be replaced with fraction with the proper language support
	- **DEPRECATED** `{x}` in the string will be replaced with `value`
	- **DEPRECATED** `{y}` in the string will be replaced with `max`

## d2l-meter-radial

Radial meters will show the progress bar as a half circle.

![Radial meter with no progress](./screenshots/d2l-meter-radial-no-progress.png?raw=true)
![Radial meter with some progress](./screenshots/d2l-meter-radial-has-progress.png?raw=true)
![Radial meter completed](./screenshots/d2l-meter-radial-completed.png?raw=true)
![Radial meter with text](./screenshots/d2l-meter-radial-with-text.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-radial.js';
</script>
<d2l-meter-radial value="30" max="100"></d2l-meter-radial>
```

**Properties:**

- `value` (required, Number): Current number of completed units. A positive, non-zero number that is less than or equal to `max`.
- `max` (required, Number): Max number of units that are being measured by this meter. A positive, non-zero number.
- `percent` (optional, Boolean): Shows a percentage instead of `value/max`.
- `text` (optional, String): Context information about what the meter is about.
	- `{%}` in the string will be replaced with percentage value
	- `{x/y}` in the string will be replaced with fraction with the proper language support

## d2l-meter-circle

Circle meters will show the progress as a full circle.

![Circle meter with no progress](./screenshots/d2l-meter-circle-no-progress.png?raw=true)
![Circle meter with no progress](./screenshots/d2l-meter-circle-has-progress.png?raw=true)
![Circle meter with no progress](./screenshots/d2l-meter-circle-completed.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-circle.js';
</script>
<d2l-meter-circle value="30" max="100"></d2l-meter-circle>
```

**Properties:**

- `value` (required, Number): Current number of completed units. A positive, non-zero number that is less than or equal to `max`.
- `max` (required, Number): Max number of units that are being measured by this meter. A positive, non-zero number.
- `percent` (optional, Boolean): Shows a percentage instead of `value/max`.
- `text` (optional, String): Context information about what the meter is about.
	- `{%}` in the string will be replaced with percentage value
	- `{x/y}` in the string will be replaced with fraction with the proper language support

## Light Foreground

All `meter` components have a `foreground-light` style for displaying against a dark background. To use this style, just add this attribute:

```html
<d2l-meter-circle value="30" max="100" foreground-light></d2l-meter-circle>
```

# Progress Meters

Progress meters are used to visually communicate the progress of an object or operation. There are three types of progress meters: Linear, Radial, and Circle. Select the type that best represents your data and fits the visual design.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-linear.js';
  import '@brightspace-ui/core/components/meter/meter-radial.js';
  import '@brightspace-ui/core/components/meter/meter-circle.js';
</script>
<d2l-meter-linear value="30" max="100"></d2l-meter-linear>
<d2l-meter-radial value="30" max="100"></d2l-meter-radial>
<d2l-meter-circle value="30" max="100"></d2l-meter-circle>
```

<!-- docs: start hidden content -->
### Note: these are referred to as "progress meters" on [design.d2l](http://design.d2l/components/progress-meters/).
<!-- docs: end hidden content -->

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use to show the completion or progress of an object.
* Use to highlight important or critical progress data.
* Use to provide feedback when a user completes an action that results in a change in data.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use a lot of progress indicators on a single screen because they can overwhelm the user.
* Don't use motion unless the data is the primary content on the screen.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Light Foreground

All `meter` components have a `foreground-light` style for displaying against a dark background.

<!-- docs: demo code darkMode:true -->
```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-linear.js';
  import '@brightspace-ui/core/components/meter/meter-radial.js';
  import '@brightspace-ui/core/components/meter/meter-circle.js';
</script>
<d2l-meter-linear value="30" max="100" foreground-light></d2l-meter-linear>
<d2l-meter-radial value="30" max="100" foreground-light></d2l-meter-radial>
<d2l-meter-circle value="30" max="100" foreground-light></d2l-meter-circle>
```


## Linear Meter [d2l-meter-linear]

Linear meters show a horizontal progress bar.

<!-- docs: start hidden content -->
![Linear meter with no progress](./screenshots/d2l-meter-linear-no-progress.png?raw=true)
![Linear meter with some progress](./screenshots/d2l-meter-linear-has-progress.png?raw=true)
![Linear meter completed](./screenshots/d2l-meter-linear-completed.png?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-meter-linear -->
```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-linear.js';
</script>
<d2l-meter-linear value="3" max="10"></d2l-meter-linear>
```

<!-- docs: start hidden content -->
### Properties:

* `value` (required, Number): Current number of completed units. A positive, non-zero number that is less than or equal to `max`.
* `max` (Number, default: `100`): Max number of units that are being measured by this meter. A positive, non-zero number.
* `percent` Boolean: Shows a percentage instead of `value/max`.
* `text-inline` Boolean: Keeps the meter to a single line.
* `text` String: Context information about what the meter is about.
	* `\{\%\}` in the string will be replaced with percentage value
	* `{x/y}` in the string will be replaced with fraction with the proper language support
	* **DEPRECATED** `{x}` in the string will be replaced with `value`
	* **DEPRECATED** `{y}` in the string will be replaced with `max`
<!-- docs: end hidden content -->

## Radial meter [d2l-meter-radial]

Radial meters will show the progress bar as a half circle.

<!-- docs: start hidden content -->
![Radial meter with no progress](./screenshots/d2l-meter-radial-no-progress.png?raw=true)
![Radial meter with some progress](./screenshots/d2l-meter-radial-has-progress.png?raw=true)
![Radial meter completed](./screenshots/d2l-meter-radial-completed.png?raw=true)
![Radial meter with text](./screenshots/d2l-meter-radial-with-text.png?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-meter-radial size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-radial.js';
</script>
<d2l-meter-radial value="30" max="100"></d2l-meter-radial>
```

<!-- docs: start hidden content -->
### Properties:

* `value` (required, Number): Current number of completed units. A positive, non-zero number that is less than or equal to `max`.
* `max` (Number, default: `100`): Max number of units that are being measured by this meter. A positive, non-zero number.
* `percent` (Boolean): Shows a percentage instead of `value/max`.
* `text` (String): Context information about what the meter is about.
	* `{%}` in the string will be replaced with percentage value
	* `{x/y}` in the string will be replaced with fraction with the proper language support
<!-- docs: end hidden content -->


## Circular Meter [d2l-meter-circle]

Circle meters will show the progress as a full circle.
<!-- docs: start hidden content -->
![Circle meter with no progress](./screenshots/d2l-meter-circle-no-progress.png?raw=true)
![Circle meter with no progress](./screenshots/d2l-meter-circle-has-progress.png?raw=true)
![Circle meter with no progress](./screenshots/d2l-meter-circle-completed.png?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-meter-circle -->
```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-circle.js';
</script>
<d2l-meter-circle value="30" max="100"></d2l-meter-circle>
```

<!-- docs: start hidden content -->
### Properties:

* `value` (required, Number): Current number of completed units. A positive, non-zero number that is less than or equal to `max`.
* `max` (Number, default: `100`): Max number of units that are being measured by this meter. A positive, non-zero number.
* `percent` (Boolean): Shows a percentage instead of `value/max`.
* `text` (String): Context information about what the meter is about.
	* `\{\%\}` in the string will be replaced with percentage value
	* `{x/y}` in the string will be replaced with fraction with the proper language support

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
# Meters
Meters are a visually engaging way to communicate progress or measurements.

<!-- docs: demo  -->
```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-circle.js';
  import '@brightspace-ui/core/components/meter/meter-linear.js';
  import '@brightspace-ui/core/components/meter/meter-radial.js';
</script>
<d2l-meter-linear value="1" max="6" text="Activities"></d2l-meter-linear>
<d2l-meter-radial value="22" max="24" text="On Track"></d2l-meter-radial>
<d2l-meter-circle value="1" max="6"></d2l-meter-circle>
```

<!-- docs: start hidden content -->
### Note: these are referred to as "progress meters" on [design.d2l](http://design.d2l/components/progress-meters/).
<!-- docs: end hidden content -->

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use to show the completion or progress of an object
* Use to highlight important or critical measurements
* Use to provide feedback when a user completes an action that results in a change in data
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use a lot of progress indicators on a single screen because they can overwhelm the user
* Don't use motion unless the data is the primary content on the screen
<!-- docs: end donts -->
<!-- docs: end best practices -->


## Linear Meter [d2l-meter-linear]

Linear meters show a horizontal progress bar.

<!-- docs: demo live name:d2l-meter-linear -->
```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-linear.js';
</script>
<style>
  d2l-meter-linear {
    width: 170px;
  }
</style>
<d2l-meter-linear value="8" max="10" text="Activities"></d2l-meter-linear>
<d2l-meter-linear value="8" max="10" text="Activities: {x/y}" percent></d2l-meter-linear>
<d2l-meter-linear value="8" max="10" text-inline text="Activities"></d2l-meter-linear>
```

<!-- docs: start hidden content -->
### Properties

* `value` (required, Number): Current number of completed units. A positive, non-zero number that is less than or equal to `max`.
* `max` (Number, default: `100`): Max number of units that are being measured by this meter. A positive, non-zero number.
* `percent` Boolean: Shows a percentage instead of `value/max`.
* `text-inline` Boolean: Keeps the meter to a single line. Adding one of the following between `{}` (e.g., `{x/y}`) causes replacements:
	* `%` in the string will be replaced with percentage value
	* `x/y` in the string will be replaced with fraction with the proper language support
	* **DEPRECATED** `x` in the string will be replaced with `value`
	* **DEPRECATED** `y` in the string will be replaced with `max`
<!-- docs: end hidden content -->

## Radial meter [d2l-meter-radial]

Radial meters appear as a half circle. They have more visual weight than a linear meter and should only be used when the data is central to the user's task.

<!-- docs: demo live name:d2l-meter-radial size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-radial.js';
</script>
<d2l-meter-radial value="30" max="100"></d2l-meter-radial>
```

<!-- docs: start hidden content -->
### Properties

* `value` (required, Number): Current number of completed units. A positive, non-zero number that is less than or equal to `max`.
* `max` (Number, default: `100`): Max number of units that are being measured by this meter. A positive, non-zero number.
* `percent` (Boolean): Shows a percentage instead of `value/max`.
* `text` (String): Context information about what the meter is about. Adding one of the following between `{}` (e.g., `{x/y}`) causes replacements:
	* `%` in the string will be replaced with percentage value
	* `x/y` in the string will be replaced with fraction with the proper language support
<!-- docs: end hidden content -->


## Circular Meter [d2l-meter-circle]

Circle meters display data in a compact circle format, so they're useful when horizontal space is at a premium.

<!-- docs: demo live name:d2l-meter-circle -->
```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-circle.js';
</script>
<d2l-meter-circle value="1" max="6"></d2l-meter-circle>
```

## Light Foreground
All `meter` components have a `foreground-light` style that ensures accessible contrast levels when displayed against a dark background.

<!-- docs: demo code darkMode:true -->
```html
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-linear.js';
  import '@brightspace-ui/core/components/meter/meter-radial.js';
  import '@brightspace-ui/core/components/meter/meter-circle.js';
</script>
<d2l-meter-linear value="1" max="6" foreground-light text="Activities"></d2l-meter-linear>
<d2l-meter-radial value="22" max="24" foreground-light text="On Track"></d2l-meter-radial>
<d2l-meter-circle value="1" max="6" foreground-light></d2l-meter-circle>
```

<!-- docs: start hidden content -->
### Properties

* `value` (required, Number): Current number of completed units. A positive, non-zero number that is less than or equal to `max`.
* `max` (Number, default: `100`): Max number of units that are being measured by this meter. A positive, non-zero number.
* `percent` (Boolean): Shows a percentage instead of `value/max`.
* `text` (String): Context information about what the meter is about. Adding one of the following between `{}` (e.g., `{x/y}`) causes replacements:
	* `%` in the string will be replaced with percentage value
	* `x/y` in the string will be replaced with fraction with the proper language support
<!-- docs: end hidden content -->

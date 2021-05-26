# Meters

The meter components are used to visually communicate the progress of an object or operation.

```html
<!-- docs: demo -->
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-circle.js';
  import '@brightspace-ui/core/components/meter/meter-linear.js';
  import '@brightspace-ui/core/components/meter/meter-radial.js';
</script>
<d2l-meter-circle value="30" max="100"></d2l-meter-circle>
<d2l-meter-linear value="3" max="10"></d2l-meter-linear>
<d2l-meter-radial value="30" max="100"></d2l-meter-radial>
```

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

## How to Use

### text Property

- `{ % }` (remove spaces) in the string will be replaced with percentage value. For example, `text="Visited: { % }"` can become "Visited: 50%"
- `{x/y}` in the string will be replaced with fraction with the proper language support. For example, `text="Visited: {x/y}"` can become "Visited: 3/6"

### Light Foreground

All `meter` components have a `foreground-light` style for displaying against a dark background. To use this style, just add this attribute:

```html
<d2l-meter-circle value="30" max="100" foreground-light></d2l-meter-circle>
```

## Linear Meter

Linear meters show a horizontal progress bar.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-linear.js';
</script>
<d2l-meter-linear value="3" max="10"></d2l-meter-linear>
```

## Radial Meter

Radial meters will show the progress bar as a half circle.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-radial.js';
</script>
<d2l-meter-radial value="30" max="100"></d2l-meter-radial>
```

## Circle Meter

Circle meters will show the progress as a full circle.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/meter/meter-circle.js';
</script>
<d2l-meter-circle value="30" max="100"></d2l-meter-circle>
```

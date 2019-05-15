# Meter Components

* Note this is considered as progress indicator in design.

## d2l-meter-linear
![Linear meter with no progress](./screenshots/d2l-meter-linear-no-progress.png?raw=true)
![Linear meter with some progress](./screenshots/d2l-meter-linear-has-progress.png?raw=true)
![Linear meter completed](./screenshots/d2l-meter-linear-completed.png?raw=true)

### Usage

Import
```js
import '@brightspace-ui/core/components/meter/meter-linear.js';
```

Then add the `d2l-meter-linear`, provide values for the properties, `value` and `max`.

```html
<d2l-meter-linear value="30" max="100"></d2l-meter-linear>
```

***Properties:***

* `value` (required): The current number of units that have been marked as completed. Should be a positive, non-zero number that is less than or equal to `max`
* `max` (required): Max number of units that is being measured by this meter. For results this should be a positive, non-zero number

## d2l-meter-radial
![Radial meter with no progress](./screenshots/d2l-meter-radial-no-progress.png?raw=true)
![Radial meter with some progress](./screenshots/d2l-meter-radial-has-progress.png?raw=true)
![Radial meter completed](./screenshots/d2l-meter-radial-completed.png?raw=true)

### Usage

Import
```js
import '@brightspace-ui/core/components/meter/meter-radial.js';
```

Then add the `d2l-meter-radial`, provide values for the properties, `value` and `max`.

```html
<d2l-meter-radial value="30" max="100"></d2l-meter-radial>
```

***Properties:***

* `value` (required): The current number of units that have been marked as completed. Should be a positive, non-zero number that is less than or equal to `max`
* `max` (required): Max number of units that is being measured by this meter. For results this should be a positive, non-zero number

## d2l-meter-circle
![Circle meter with no progress](./screenshots/d2l-meter-circle-no-progress.png?raw=true)
![Circle meter with no progress](./screenshots/d2l-meter-circle-has-progress.png?raw=true)
![Circle meter with no progress](./screenshots/d2l-meter-circle-completed.png?raw=true)

### Usage

Import
```js
import '@brightspace-ui/core/components/meter/meter-circle.js';
```

Then add the `d2l-meter-circle`, provide values for the properties, `value` and `max`.

```html
<d2l-meter-circle value="30" max="100"></d2l-meter-circle>
```

***Properties:***

* `value` (required): The current number of units that have been marked as completed. Should be a positive, non-zero number that is less than or equal to `max`
* `max` (required): Max number of units that is being measured by this meter. For results this should be a positive, non-zero number

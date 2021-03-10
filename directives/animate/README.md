# animate directives

These directives can be used to animate the showing or hiding of elements in your application.

The animation will slide the element in (or out) of its final position, while transitioning its height and opacity:

![animation](./screenshots/show-hide.gif?raw=true)

## Using the directives

Import the directives you'd like to use and bind them to any element's `animation` property.

```javascript
import { hide, show } from '@brightspace-ui/core/directives/animate/animate.js';

html`<some-elem .animate="${hide()}">Hide this element</some-elem>`;
```

Note the use of `lit-html`'s `.` notation on the name, which will bind to a property.

The directive can be bound to _any_ element, not just custom elements!

## Skipping the animation

Sometimes you don't want the animation to run every time your component is rendered. For example, you may want to skip the animation when your component initially renders or until a user interacts with it.

To bypass the animation, pass the `skip` option:

```javascript
html`<some-elem .animate="${show({ skip: true })}"></some-elem>`;
```

## Focus management

When hiding an element, it's possible that the user's focus was inside that element. The act of hiding it would lose the user's focus point.

If this scenario is detected, focus will automatically be moved to the next focusable element after the element being hidden.

![focus](./screenshots/focus.gif?raw=true)
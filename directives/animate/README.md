# Animate Directives

These directives can be used to animate the showing or hiding of elements in your application.

The animation will slide the element in (or out) of its final position, while transitioning its height and opacity:

![animation](./screenshots/show-hide.gif?raw=true)

## Using the directives

Import the directives you'd like to use and bind them to any element's `animate` property.

```javascript
import { hide, show } from '@brightspace-ui/core/directives/animate/animate.js';

html`<some-elem .animate="${hide()}">Hide this element</some-elem>`;
```

The directive can be bound to _any_ element, not just custom elements!

## Limitations

### Reliance on `hidden` attribute

The animation directives apply the `hidden` attribute to elements. For custom elements, if the default `display` value is overridden, CSS will need to be included to hide the element when the `hidden` attribute is present:

```css
:host([hidden]) {
	display: none;
}
```

**Learn More:** [Styling display for hosts](https://github.com/BrightspaceUI/guide/wiki/LitElement-Best-Practices-&-Gotchas#-do-style-the-display-value-of-the-host)

### Negative margins

Due to complexities around how negative margins behave, the element being animated cannot have negative margins.

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
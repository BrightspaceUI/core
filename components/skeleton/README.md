# Skeletons

Skeletons provide a low fidelity representation of an application before it has finished loading, improving the user's perceived load time of the page.

![skeleton paragraph](./screenshots/overview.png?raw=true)

## Skeleton-Aware Components

Components which are skeleton-aware extend the `SkeletonMixin` (more on that below). These components can be skeletized by setting the `skeleton` boolean attribute/property.

For example, this causes a text input to be skeletized:

```html
<d2l-input-text label="Name" skeleton></d2l-text-input>
```

![skeleton text input](./screenshots/text-input.png?raw=true)

In a typical scenario, many skeleton-aware components would have their `skeleton` attributes bound to a single property on the host component, making it easy to toggle them all together:

```html
<d2l-input-text label="Name" ?skeleton="${this.skeleton}"></d2l-text-input>
<d2l-input-date label="Due Date" ?skeleton="${this.skeleton}"></d2l-input-date>
<my-element ?skeleton="${this.skeleton}"></my-element>
```

## SkeletonMixin: Make a Component Skeleton-Aware

To make a component skeleton-aware, extend the `SkeletonMixin`. The mixin comes with some styles, so don't forget to include `super.styles` with your element's static `styles()` property.

```javascript
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class MyElement extends SkeletonMixin(LitElement) {

  static get styles() {
    return [ super.styles, ... ];
  }

}
customElements.define('my-element', MyElement);
```

The mixin includes a single `skeleton` boolean property, which can then be set either by consumers or by your component itself to place it into "skeleton" mode:

```html
<my-element skeleton></my-element>
```

### Applying Skeleton Styles

Once a component is skeleton-aware, it can apply skeleton styles to native elements using the `d2l-skeletize` CSS class. These native elements can include our own typography styles such as headings, links and body standard/compact/small.

**Important:** Only use this CSS class on native elements. Custom elements should have their `skeleton` attribute set. If a custom element isn't skeleton-aware and doesn't yet have a `skeleton` property, take the time to add that support.

```javascript
render() {
  return html`
    <h2 class="d2l-heading-2 d2l-skeletize">Heading</h2>
    <p class="d2l-body-compact d2l-skeletize">Description</p>
    <a class="d2l-link d2l-skeletize" href="somewhere">Link</a>
    <div class="widget d2l-skeletize">Widget</div>
    <d2l-input-text label="text input" skeleton></d2l-input-text>
  `;
}
```

## Future Enhancements

Looking for an enhancement not listed here? Is there a core component that should support skeletons but doesn't yet? Create a GitHub issue!
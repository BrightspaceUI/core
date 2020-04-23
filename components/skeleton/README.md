# Skeletons

The `<d2l-skeleton>` element can be used to fulfill the [design.d2l skeleton page loader spec](http://design.d2l/patterns/skeleton-loading/). It can be styled to any size needed.

## Examples

This is what a single `d2l-skeleton` looks like, with a given height and width.

![example screenshot of a skeleton](./screenshots/skeleton-single-line.png?raw=true)

### Multiple Skeletons

Skeletons can be styled and arranged to be heading and paragraph placeholders.

![example screenshot of multiple skeletons](./screenshots/skeleton-multi-line.png?raw=true)

### Image Skeleton

Skeletons can be sized arbitrarily, and can be used for image placeholders.

![example screenshot of multiple skeletons](./screenshots/skeleton-image.png?raw=true)

## Web Component

Import and use the `<d2l-skeleton>` web component instead of styling skeletons yourself:

```html
<script type="module">
  import '@brightspace-ui/core/components/skeleton/skeleton.js';
</script>
<d2l-skeleton>
```

**Attributes:**

- `hidden`: sets `display: none`

## Applying skeleton styles to other elements

Alternatively, you can apply skeleton styles to other elements by importing the styles and placing the `d2l-skeleton` CSS class on the element.

```javascript
import { skeletonStyles } from '@brightspace-ui/core/components/skeleton/skeleton-styles.js'

class MyElement extends LitElement {

  static get styles() { return [ skeletonStyles ] }

  render() {
    return html`
      <div class="d2l-skeleton"></div>
    `
  }
}
```

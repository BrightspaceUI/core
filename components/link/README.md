# Links

The `<d2l-link>` element can be used just like the native anchor tag. Additionally, styles are available to apply to native `<a>` elements.

```html
<!-- docs: demo -->
<script type="module">
  import '@brightspace-ui/core/components/link/link.js';
</script>
<d2l-link href="https://www.mylink.com">Standard</d2l-link>
<d2l-link href="https://www.mylink.com" small>Small</d2l-link>
<d2l-link href="https://www.mylink.com" main>Main</d2l-link>
```

## Web Component

Import and use the `<d2l-link>` web component instead of the native `<a>` element:

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/link/link.js';
</script>
<d2l-link href="https://www.mylink.com">My Link</d2l-link>
```

### Accessibility

To make your usage of `d2l-link` accessible, use the following property when applicable:

| Attribute | Description |
|--|--|
| `aria-label` | Use when text in link does not provide enough context. |

## Applying link styles to native `<a>` elements

Alternately, you can apply link styles to a native `<a>` element by importing the styles and placing the `d2l-link` CSS class on the element.

```javascript
import { linkStyles } from '@brightspace-ui/core/components/link/link.js';

class MyElement extends LitElement {

  static get styles() { return [ linkStyles ] }

  render() {
    return html`
      <a class="d2l-link" href="https://www.mylink.com">My Link</a>
    `;
  }

}
```

Add the `d2l-link-main` or `d2l-link-small` CSS classes to the `<a>` element to apply those styles.

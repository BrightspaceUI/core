# Links

The `<d2l-link>` element can be used just like the native anchor tag. Additionally, styles are available to apply to native `<a>` elements.

## Link Styles

The following link styles are available:

### Standard

This is the standard link style, used in most cases.

![example screenshot of standard link](./screenshots/standard.png?raw=true)

### Small

Similarly styled to the standard link, but slightly smaller and more compact.

![example screenshot of small link](./screenshots/small.png?raw=true)

### Main

Same size as the standard link, but bolder.

![example screenshot of main link](./screenshots/main.png?raw=true)

## Web Component

Import and use the `<d2l-link>` web component instead of the native `<a>` element:

```html
<script type="module">
  import '@brightspace-ui/core/components/link/link.js';
</script>
<d2l-link href="https://www.mylink.com">My Link</d2l-link>
```

**Properties:**

- `href` (required, String): URL or URL fragment of the link
- `aria-label` (String): sets an accessible label
- `download` (Boolean): download a URL instead of navigating to it
- `main` (Boolean): whether to apply the "main" link style
- `small` (Boolean): whether to apply the "small" link style
- `target` (String): where to display the linked URL

**Accessibility:**

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

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
# Links

The `<d2l-link>` element can be used just like the native anchor tag. Additionally, styles are available to apply to native `<a>` elements.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/link/link.js';
</script>
<d2l-link href="https://www.d2l.com/" target="_blank">Standard</d2l-link>
<d2l-link href="https://www.d2l.com/" small target="_blank">Small</d2l-link>
<d2l-link href="https://www.d2l.com/" main target="_blank">Main</d2l-link>
```

## Link [d2l-link]

Import and use the `<d2l-link>` web component instead of the native `<a>` element:

<!-- docs: demo live name:d2l-link -->
```html
<script type="module">
  import '@brightspace-ui/core/components/link/link.js';
</script>
<d2l-link href="https://www.d2l.com/" target="_blank">My Link</d2l-link>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `href` | String, required | URL or URL fragment of the link |
| `aria-label` | String | Sets an accessible label |
| `download` | Boolean | Download a URL instead of navigating to it |
| `main` | Boolean | Whether to apply the "main" link style |
| `small` | Boolean | Whether to apply the "small" link style |
| `target` | String | Where to display the linked URL |
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-link` accessible, use the following property when applicable:

| Attribute | Description |
|--|--|
| `aria-label` | Use when text in link does not provide enough context. |

<!-- docs: start hidden content -->
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
<!-- docs: end hidden content -->

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

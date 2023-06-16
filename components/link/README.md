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

<!-- docs: start hidden content -->
## Link Styles

The following link styles are available:

### Standard

This is the standard link style, used in most cases.

### Small

Similarly styled to the standard link, but slightly smaller and more compact.

### Main

Same size as the standard link, but bolder.
<!-- docs: end hidden content -->

## Link [d2l-link]

Import and use the `<d2l-link>` web component instead of the native `<a>` element:

<!-- docs: demo code properties name:d2l-link -->
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

## Applying link styles to native anchor elements

Alternately, you can apply link styles to a native `<a>` element by importing the styles and placing the `d2l-link` CSS class on the element.

<!-- docs: demo code -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { linkStyles } from '@brightspace-ui/core/components/link/link.js';

  class MyLinkElem extends LitElement {

    static get styles() { return [ linkStyles ] }

    render() {
      return html`
        <a class="d2l-link" href="https://www.mylink.com">My Link</a>
      `;
    }

  }
  customElements.define('d2l-my-link-elem', MyLinkElem);
</script>
<d2l-my-link-elem></d2l-my-link-elem>
```

Add the `d2l-link-main` or `d2l-link-small` CSS classes to the `<a>` element to apply those styles.

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

<!-- docs: demo code properties name:d2l-link sandboxTitle:'Link' -->
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
| `aria-label` | String | Label to provide more context for screen reader users when the link text is not enough |
| `href` | String, required | URL or URL fragment of the link |
| `download` | String | If the attribute is provided, it will prompt the user to download the resource instead of navigating to it. Additionally, if the attribute is provided with a value, that value will be used for the filename. |
| `main` | Boolean | Whether to apply the "main" link style |
| `lines` | Number | The number of lines to display before truncating text with an ellipsis. The text will not be truncated unless a value is specified. |
| `small` | Boolean | Whether to apply the "small" link style |
| `target` | String | Where to display the linked URL |
<!-- docs: end hidden content -->

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

## Accessibility
 - The `d2l-link` component follows the W3C's best practices for the [Link Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/link/)
 - When `target` is set to `_blank`, the `d2l-link` component follows [WCAG technique G201](https://www.w3.org/TR/WCAG20-TECHS/G201.html), and gives users an advanced warning that interacting with the link will open it in a new window
    - While this is simply read out to screen reader users, it is also visually represented by the `new-window` icon

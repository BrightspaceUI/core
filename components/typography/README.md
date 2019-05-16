# Typography

## Styles

Importing `typography` will add the font-faces and prebuilt CSS classes to the document. See [typography.js](typography.js) for the class names (ex. `.d2l-typography`). Importing CSS templates from [styles.js](styles.js) will enable the use of prebuilt typography classes within component templates.

### Standard Body

"Standard Body" can be used to apply base font properties, but will also respond to viewport width changes.

![Standard Body](./screenshots/body-standard.png?raw=true)

### Compact Body

Compact body is a smaller version of the standard body style, for use in areas that prefer to be conservative with the amount of real estate used by text.  It is **not** recommended for blocks of readable text, particularly in paragraph form. Rather, it is best employed for brief informative text or calls to action.

![Compact Body](./screenshots/body-compact.png?raw=true)

### Small Body

Never used by itself; always in support of another piece of content on the page. Used for inline assistive text in forms, and for specifying metadata or properties of an existing piece of content.

![Small Body](./screenshots/body-small.png?raw=true)

### Label Text

Used for labels. Its font size/line spacing is relative to the root font and responds to viewport width changes.

![Label](./screenshots/labels.png?raw=true)

### Headings

There are four available heading styles. These are typically be applied to the `h1`, `h2`, `h3` and `h4` HTML elements, though it's not a requirement.

![Headings](./screenshots/headings.png?raw=true)

## Usage

### App

Import [typography.js](typography.js), add the `d2l-typography` class to the `body`, and add other classes as needed. *Note:* `d2l-typography` only needs to be imported applied to the document once.

```html
<head>
  <script type="module">
    import '@brightspace-ui/core/components/typography/typography.js';
  </script>
</head>
<body class="d2l-typography">

  <h1 class="d2l-heading-2"> ... </h1>

</body>
```

### Component

Import the desired CSS templates from [styles.js](styles.js), include them in the static styles of the component, and use the classes within rendering templates.

```js
import { heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';

class MyComponent extends LitElement {

  static get styles() {
    return [ heading2Styles, css`
      :host {
        display: inline-block;
      }
    ` ];
  }

  render() {
    return html `<h1 class="d2l-heading-2"> ... </h1>`;
  }

}
```

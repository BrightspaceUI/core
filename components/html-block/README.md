# HTML Block

The `d2l-html-block` element is a web component for displaying user-authored HTML. It includes styles for headings, lists, anchors and other elements.  In addition, it provides integration with MathJax for rendering MathML.

Place the user-authored HTML within a `template` and the `d2l-html-block` will stamp the content into its local DOM where styles will be applied, and math typeset.

**Important**: user-authored HTML must be trusted or properly sanitized!

```html
<script type="module">
  import '@brightspace-ui/core/components/html-block/html-block.js';
</script>

<d2l-html-block>
  <template>
    <!-- some html -->
  </template>
</d2l-html-block>
```

To use `d2l-html-block` within another Lit component, use the `unsafeHTML` directive to avoid escaping the HTML.

```javascript
import { html, LitElement } from 'lit-element/lit-element.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

class SomeComponent extends LitElement {

  render() {
    return html`
      <d2l-html-block>
        <template>${unsafeHTML(this._someHTML)}</template>
      </d2l-html-block>
    `;
  }

}

customElements.define('d2l-some-component', SomeComponent);
```

**Properties:**

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Property&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|--|--|--|
| `math-jax-config` | Object, default: `'{}'` | Configuration options for MathJax |

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!

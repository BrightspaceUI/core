# HTML Content Display

Components to assist with displaying user-authored HTML within your webpage.

## HTML Block [d2l-html-block]

The `d2l-html-block` element is a web component for displaying user-authored HTML. It includes styles for headings, lists, anchors and other elements.  In addition, it provides integration with MathJax for rendering MathML.

Pass the user-authored HTML into the `html` attribute of the `d2l-html-block` and the component will stamp the content into its local DOM where styles will be applied, and math typeset.

<!-- docs: demo live name:d2l-html-block autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/html-block/html-block.js';
  import '@brightspace-ui/core/components/icons/icon.js';
</script>
<d2l-html-block html="
  <style>
    div {
      --d2l-icon-fill-color: var(--d2l-color-cinnabar);
    }
    span {
      color: var(--d2l-color-cinnabar);
      margin-left: 10px;
      vertical-align: middle;
    }
    d2l-icon {
      align-self: center;
      flex-shrink: 0;
    }
    .warning-container {
      align-items: center;
      display: flex;
      justify-content: center;
    }
  </style>
  <div class=&quot;warning-container&quot;>
    <d2l-icon icon=&quot;tier3:alert&quot;></d2l-icon>
    <span>
      <b>Important:</b> user-authored HTML must be trusted or properly sanitized!
    </span>
  </div>">
</d2l-html-block>
```

### Rendering MathML and LaTeX

Examples are provided to display how user-authored math can be embedded within your webpage. Note that rendering math requires the `mathjax` context to be set correctly. For testing and/or demo pages **ONLY**, you can import `@brightspace-ui/core/tools/mathjax-test-context.js` to set this context for you.

**MathML:**
<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/core/components/html-block/html-block.js';
  import '@brightspace-ui/core/components/icons/icon.js';
  import '@brightspace-ui/core/tools/mathjax-test-context.js';
</script>
<d2l-html-block html="
  <math xmlns=&quot;http://www.w3.org/1998/Math/MathML&quot;>
    <msqrt>
      <mn>3</mn>
      <mi>x</mi>
      <mo>&#x2212;</mo>
      <mn>1</mn>
    </msqrt>
    <mo>+</mo>
    <mo stretchy=&quot;false&quot;>(</mo>
    <mn>1</mn>
    <mo>+</mo>
    <mi>x</mi>
    <msup>
      <mo stretchy=&quot;false&quot;>)</mo>
      <mn>2</mn>
    </msup>
  </math>">
</d2l-html-block>
```

**LaTeX:**

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/core/components/html-block/html-block.js';
  import '@brightspace-ui/core/tools/mathjax-test-context.js';
</script>
<d2l-html-block html="$$ f(x) = \int \mathrm{e}^{-x}\,\mathrm{d}x $$ $$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$"></d2l-html-block>
```

### Add Context Automatically to Demos and Tests

You can automatically set-up the `mathjax` context for demo pages and unit tests when using `@web/dev-server` and `@web/test-runner` by adding the following plugin to your configuration.

```javascript
export default {
  ...
  plugins: [{
    name: 'setup-mathjax-context',
    transform(context) {
      if (context.response.is('html')) {
        const newBody = context.body.replace(
          /<head>/,
          '<head><script src="/node_modules/@brightspace-ui/core/tools/mathjax-test-context.js"></script>'
        );

        return { body: newBody };
      }
    }
  }],
  ...
}
```

# HTML Content Display

Components to assist with displaying user-authored HTML within your webpage.

## HTML Block [d2l-html-block]

The `d2l-html-block` element is a web component for displaying user-authored HTML. It includes styles for headings, lists, anchors and other elements.  In addition, it provides integration with MathJax for rendering MathML.

Pass the user-authored HTML into the `html` attribute of the `d2l-html-block` and the component will stamp the content into its local DOM where styles will be applied, and math typeset.

<!-- docs: demo code properties name:d2l-html-block sandboxTitle:'HTML Block' autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/html-block/html-block.js';
  import '@brightspace-ui/core/components/icons/icon.js';
</script>
<d2l-html-block html="
  &lt;style&gt;
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
  &lt;/style&gt;
  &lt;div class=&quot;warning-container&quot;&gt;
    &lt;d2l-icon icon=&quot;tier3:alert&quot;&gt;&lt;/d2l-icon&gt;
    &lt;span&gt;
      &lt;b&gt;Important:&lt;/b&gt; user-authored HTML must be trusted or properly sanitized!
    &lt;/span&gt;
  &lt;/div&gt;">
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
  &lt;math xmlns=&quot;http://www.w3.org/1998/Math/MathML&quot;&gt;
    &lt;msqrt&gt;
      &lt;mn&gt;3&lt;/mn&gt;
      &lt;mi&gt;x&lt;/mi&gt;
      &lt;mo&gt;&#x2212;&lt;/mo&gt;
      &lt;mn&gt;1&lt;/mn&gt;
    &lt;/msqrt&gt;
    &lt;mo&gt;+&lt;/mo&gt;
    &lt;mo stretchy=&quot;false&quot;&gt;(&lt;/mo&gt;
    &lt;mn&gt;1&lt;/mn&gt;
    &lt;mo&gt;+&lt;/mo&gt;
    &lt;mi&gt;x&lt;/mi&gt;
    &lt;msup&gt;
      &lt;mo stretchy=&quot;false&quot;&gt;)&lt;/mo&gt;
      &lt;mn&gt;2&lt;/mn&gt;
    &lt;/msup&gt;
  &lt;/math&gt;">
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

You can automatically set-up the `mathjax` context for demo pages and unit tests when using `@web/dev-server` by adding the following plugin to your configuration.

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

For tests using `@brightspace-ui/testing`, pass in the following option:

```javascript
const elem = await fixture(
  html`<d2l-html-block html="..."></d2l-html-block>`,
  { mathjax: { renderLatex: true } }
);
```

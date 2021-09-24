# HTML Content Display

Components to assist with displaying user-authored HTML within your webpage. 

## HTML Block [d2l-html-block]

The `d2l-html-block` element is a web component for displaying user-authored HTML. It includes styles for headings, lists, anchors and other elements.  In addition, it provides integration with MathJax for rendering MathML.

Place the user-authored HTML within a `template` and the `d2l-html-block` will stamp the content into its local DOM where styles will be applied, and math typeset.

<!-- docs: demo live name:d2l-html-block autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/html-block/html-block.js';
  import '@brightspace-ui/core/components/icons/icon.js';
</script>
<d2l-html-block>
	<template>
		<!-- docs: start hidden content -->
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
<!-- docs: end hidden content --><div class="warning-container">
			<d2l-icon icon="tier3:alert"></d2l-icon>
			<span>
				<b>Important:</b> user-authored HTML must be trusted or properly sanitized!
			</span>
		</div>
	</template>
</d2l-html-block>
```

To use `d2l-html-block` within another Lit component, use the [unsafeHTML](https://lit-html.polymer-project.org/guide/template-reference#unsafehtml) directive to avoid escaping the HTML.

```html
<script type="module">
	import { html, LitElement } from 'lit-element/lit-element.js';
	import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
	import '@brightspace-ui/core/components/icons/icon.js';

	class SomeComponent extends LitElement {
		render() {
			return html`
				<d2l-html-block>
					<template>${unsafeHTML(this._unsafeHTML)}</template>
				</d2l-html-block>`;
		}
	}

	customElements.define('d2l-some-component', SomeComponent);
</script>
<d2l-html-component></d2l-html-component>
```

### Rendering MathML and LaTeX
Examples are provided to display how user-authored math can be embedded within your webpage.

**MathML:**
<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/core/components/html-block/html-block.js';
  import '@brightspace-ui/core/components/icons/icon.js';
</script>
<d2l-html-block>
	<template>
		<div class="mathml-container">
			<math xmlns="http://www.w3.org/1998/Math/MathML">
				<msqrt>
					<mn>3</mn>
					<mi>x</mi>
					<mo>&#x2212;</mo>
					<mn>1</mn>
				</msqrt>
				<mo>+</mo>
				<mo stretchy="false">(</mo>
				<mn>1</mn>
				<mo>+</mo>
				<mi>x</mi>
				<msup>
					<mo stretchy="false">)</mo>
					<mn>2</mn>
				</msup>
			</math>
		</div>
	</template>
</d2l-html-block>
```

**LaTeX:** Rendering LaTeX requires the `us125413-mathjax-render-latex` feature flag to be enabled.

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/core/components/html-block/html-block.js';
  import '@brightspace-ui/core/components/icons/icon.js';
  
</script>
<script>
	window.D2L = {};
	D2L.LP = {};
	D2L.LP.Web = {};
	D2L.LP.Web.UI = {};
	D2L.LP.Web.UI.Flags = {
		Flag: (feature, defaultValue) => {
			if (feature === 'us125413-mathjax-render-latex') return true;
			else return defaultValue;
		}
	};
</script>
<d2l-html-block>
	<template>
		<div class="latex-container">
			$$ f(x) = \int \mathrm{e}^{-x}\,\mathrm{d}x $$ $$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$
		</div>
	</template>
</d2l-html-block>
```
<!-- docs: start content hidden -->
## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end content hidden -->

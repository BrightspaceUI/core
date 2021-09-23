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

<!-- docs: demo live -->
```html
<script>
	import { html, LitElement } from 'lit-element/lit-element.js';
	import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
	import '@brightspace-ui/core/components/icons/icon.js';

	class SomeComponent extends LitElement {

    this._someHTML = '<h1>Hi Mom!</h1>'

		render() {
			return html`
			<d2l-html-block>
				<template>${unsafeHTML(this._someHTML)}</template>
			</d2l-html-block>`;
		}
	}

	customElements.define('d2l-html-component', SomeComponent);
</script>
<d2l-html-component></d2l-html-component>
```

<!-- docs: start content hidden -->
## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end content hidden -->

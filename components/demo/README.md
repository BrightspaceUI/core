# Demos
Demo snippets provide a method to display a component, along with the code snippet used to render it.

<!-- docs: demo autoSize:false align:start -->
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<link rel="stylesheet" href="/node_modules/@brightspace-ui/core/components/demo/styles.css" type="text/css">
		<script type="module">
			import '@brightspace-ui/core/components/demo/demo-page.js';
			import '../your-lit-component.js';
		</script>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta charset="UTF-8">
	</head>
	<body>
		<d2l-demo-page page-title="Demo">
			<h2>Demo</h2>
			<d2l-demo-snippet>
				<your-lit-component></your-lit-component>
			</d2l-demo-page>
		</d2l-demo-page>
	</body>
</html>
```

### Best Practices

* Demo pages should be stored in a /demo/ folder within the repo.
* Create demos to provide an easy way to display a component, and provide example configurations.
* Demos also allow testing components during development.

## Demo Controls

Web Components can contain a demo properties object that may be used by the `d2l-demo-snippet` to configure a set components to modify the demo.
This can be used to adjust the demo to any desired configuration, and allows a single demo to display with different flags, configurations, or other input.
When a component with `demoProperties()` is rendered in a d2l-demo-snippet`, it will have its options displayed.

```html
	static get demoProperties() {
		return {
			type: { type: 'select', options: ['default', 'critical', 'success', 'warning'], label: 'Alert Type' },
			subtext: { type: 'text', label: 'Subtext' },
			buttonText: { type: 'text', attribute: 'button-text', label: 'Button Text' },
			hasCloseButton: { type: 'switch', attribute: 'has-close-button', label: 'Has Close Button' },
			noPadding: { type: 'switch', attribute: 'no-padding', label: 'No Padding' }
		};
	}
```

`demoProperties()` should return an object where each key matches a property of the component to be controllable in the demo snippet. The options are the following:

| Property | Type | Description |
|---|---|---|
| `type` | String | The desired control type to manipulate this property with. Currently supports `select`, `text`, and `switch` type controls. |
| `options` | Array |  Used only for `select` type controls. Provides a list of dropdown options to be selected from. |
| `label` | String | Provides a text label to the control within the demo-snippet. |

## Accessibility

The `label` of any demo controls added to the page should be clearly labelled to be controlling the demo's configuration, to ensure users that these controls are not part of the component itself.

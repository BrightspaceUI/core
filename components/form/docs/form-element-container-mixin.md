# FormElementContainerMixin

Extending `FormElementContainerMixin` will allow a custom element's children (native or [custom](./form-element-mixin.md)) to participate in the parent `<d2l-form>`.

## Usage

Simply extend the `FormElementContainerMixin`:

```javascript
import { FormElementContainerMixin } from '@brightspace-ui/core/form/form-element-container-mixin.js';

class MyCustomFormElementContainer extends FormElementContainerMixin(LitElement) {
	render() {
		html`
			<d2l-input-text
				label="First Name"
				name="first-name"
				required></d2l-input-text>
			<d2l-input-text
				label="Last Name"
				name="last-name"
				required></d2l-input-text>
		`;
	}
}

customElements.define('my-custom-form-element-container', MyCustomFormElementContainer);
```

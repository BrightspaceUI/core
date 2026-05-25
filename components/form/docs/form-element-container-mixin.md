# FormElementContainerMixin

Web components that extend the `FormElementContainerMixin` are enabled to make their children within their shadow dom (native or [custom form controllers](./form-element-mixin.md)) to be discoverable by the parent form element.

## Usage

The way to use this mixin is very straight forward. Consumers only need to extend a class that is wrapped by the mixin, and no other further actions are needed. The example bellow demonstrate the previous explanation:

```javascript
import { FormElementContainerMixin } from '@brightspace-ui/core/form/form-element-container-mixin.js';

class MyCustomFormElementContainer extends FormElementContainerMixin(LitElement) {
	render() {
		html`
			<label for="nested-native-input">Name</label>
			<input id="nested-native-input"
				type="text"
				name="name"
				minlength="4"
				maxlength="15"
				required
			>
			<d2l-input-text
				id="nested-telephone-input"
				label="Telephone Number"
				type="tel"
				name="phone"
				pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
				required
			></d2l-input-text>
		`;
	}
}

customElements.define('my-custom-form-element-container', MyCustomFormElementContainer);
```

# FormElementMixin

## Wrapping Native Form Elements

In some cases you may find yourself wanting to create a custom form element using the [`FormElementMixin`](./form-element-mixin.md) that uses native form elements like `input`, `select` and `textarea` internally. `d2l-input-text` is an example of this due to using a native `input` element internally.

###  What is different about wrapping native form elements?

Native form elements have built-in [client-side form validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation). Examples of these include `required`, `min`, `max`, `minlength`, `maxlength` and `pattern`. Instead of re-implementing this functionality, we want to be able to reuse it. If this isn't needed for your custom form element then the basic [`FormElementMixin`](./form-element-mixin.md) documentation may be more appropriate.

### Implementing our custom form element

**1. Create a basic custom form element:**

First we can start by defining a custom form element based on the basic [`FormElementMixin`](./form-element-mixin.md) documentation. This custom form element contains an internal text input and a tooltip to display validation errors.

```javascript
import { FormElementMixin } from '../form-element-mixin.js';

// Use the FormElementMixin
class MyWrappingFormElement extends FormElementMixin(LitElement) {

	static get properties() {
		return { value: { type: String } };
	}

	render() {
		// Conditionally render our validation error message if there is one
		const tooltip = this.validationError
			? html`<d2l-tooltip align="start" state="error">${this.validationError}</d2l-tooltip>`
			: null;
		return html`
			<input type="text" @input=${this._onInput} @blur=${this._onBlur}>
			${tooltip}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('value')) {
			// Setting the form value each time the value changes
			this.setFormValue(this.value);
			// Since the user is in the middle of editing, false is passed because we only want to update the existing error message
			this.requestValidate(false);
		}
	}

	_onBlur() {
		// true is passed because we only want to show new errors when the user has finished editing
		this.requestValidate(true);
	}

	_onInput(e) {
		this.value = e.target.value;
	}

}
customElements.define('my-wrapping-form-element', MyWrappingFormElement);
```

**2. Use the input's build-in client-side form validation:**

We must add attributes to the native input so that it will validate its own input. In this case we will modify `render` to add `required` and `pattern`.

```javascript
render() {
	// Conditionally render our validation error message if there is one
	const tooltip = this.validationError
		? html`<d2l-tooltip align="start" state="error">${this.validationError}</d2l-tooltip>`
		: null;
	return html`
		<input type="text" required pattern="[A-Za-z]{3}" @input=${this._onInput} @blur=${this._onBlur}>
		${tooltip}
	`;
}
```

**3. Override `validity`:**

To leverage the `required` and `pattern` validation that our internal input offers we must override `get validity()` to check the input's validity state.

```javascript
get validity() {
	const elem = this.shadowRoot.querySelector('input');
	if (!elem.validity.valid) {
		return elem.validity;
	}
	return super.validity;
}
```

**4. Add custom validation messages:**

Now that our native input's validity state is being validated we can define custom validation messages by overriding `get validationMessage()`.

```javascript
get validationMessage() {
	if (this.validity.valueMissing) {
		return 'Value is required.';
	} else if (this.validity.patternMismatch) {
		return 'Invalid country code.';
	}
	// Don't forget to call super.validationMessage to provide a default error message.
	return super.validationMessage;
}
```

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!

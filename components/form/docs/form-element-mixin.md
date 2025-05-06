# FormElementMixin

The `FormElementMixin` allows custom web components to participate as a form element.

This means that the component will be able to:
1. Perform live self-validation when being edited.
1. Participate in validation and submission when added to `d2l-form`.

All custom form elements must provide a form value that will be submitted during `d2l-form` submission.

Participating in validation is, however, optional. Some custom form elements may not need validation because they have no invalid state.

## Form Value

**Properties:**
| Property | Type | Description |
|--|--|--|
| `name` | String | The name of the form control. Submitted with the form as part of a name/value pair. |

**Methods:**
- `resetValidation()`: Resets any validation errors on the form element. Note that this does not reset any form element value.
- `setFormValue(value)`: Sets the current value of the form control. Submitted with the form as part of a name/value pair. `value` may be a:
	1. An `Object`: `{ 'key1': val, 'key2': val }`
		- When an `Object` is provided, all keys-value pairs will be submitted. To avoid collision it is recommended that you prefix each key with the component's `name` property value.
	1. A single value: `'my-value'`
		- When a single value is provided a key-value pair will be submitted with the component's `name` property value as the key. If `name` does not have a value, the value will not be submitted.

## Validation

**Properties:**
| Property | Type | Description |
|--|--|--|
| `force-invalid` | Boolean, default: `false` | Forces the component into an invalid state. This should be used if you want the component to look invalid even if it passed validation. |
| `invalid` | read-only, Boolean, default: `false` | Indicates whether the component is currently in an invalid state. This attribute should be used to display all invalid styles. |
| `novalidate` | Boolean, default: `false` | Indicates that the component should not be validated, preventing it from entering an invalid state. |
| `validationError` | read-only, String, default: `null` | The current validation error message.<br><br>**Note:** If the component has a `validationError` then `invalid` will always be `true`; however, an `invalid` component is not guaranteed to have a `validationError`. Therefore, `validationError` should be checked to be non-null before rendering the error. |

**Methods:**
- `setValidity({ <flag>: true|false, ...})`: Sets the component's current validity state flags. The following `Boolean` flags can be provided:
	- `badInput`
	- `customError`
	- `patternMismatch`
	- `rangeOverflow`
	- `rangeUnderflow`
	- `stepMismatch`
	- `tooLong`
	- `tooShort`
	- `valueMissing`
	- **Note:** The validity state should be synchronously updated at the same time as the form value. If no flags are provided the validity state is considered valid.
- `get validity()`: Gets the current validity state that was set using `setValidity`
- `get validationMessage()`: Override to provide custom validation messages for any of the built-in validity state flags.
- `async requestValidate(showNewErrors)`: Used to get the component to validate and render the result of its validation. This involves both checking the validity state set using `setValidity` and any `d2l-validation-custom` elements associated with the component.
	- If `showNewErrors` is `true` then any errors found during validation will be immediately rendered and the component will be put in an `invalid` state. This should be used when the user has finished editing like in `change` or `blur` event handlers.
	- If `showNewErrors` is `false` then any errors found during validation will only be rendered if the component already has an error. This should be used if the user is in the middle of editing like in `input` event handlers.

**Events:**
- `invalid-change`: Dispatched when the `invalid` property's value changes.

**Additional Validation:**
- Additional validation logic can be added to custom form elements by using the `d2l-validation-custom` component. [See the documentation for more information](../../validation/README.md).

## Usage

```javascript
import { FormElementMixin } from '@brightspace-ui/core/form/form-element-mixin.js';

// Use the FormElementMixin
class MyFormElement extends FormElementMixin(LitElement) {

	static get properties() {
		return {
			_val1: { type: String },
			_val2: { type: String }
		};
	}
	static get styles() {
		return css`
			/* Add our invalid styles */
			:host([invalid]) {
				border: 2px solid var(--d2l-color-cinnabar);
			}
		`;
	}

	constructor() {
		super();
		this._val1 = '';
		this._val2 = '';
	}

	render() {
		// Conditionally render our validation error message if there is one
		const tooltip = this.validationError ? html`<d2l-tooltip align="start" state="error">${this.validationError}</d2l-tooltip>` : null;
		return html`
			<select @change=${this._onChange} @blur=${this._onBlur}>
				<option value="">--Please choose an option--</option>
				<option value="dog">Dog</option>
				<option value="cat">Cat</option>
				<option value="hamster">Hamster</option>
			</select>
			<input type="text" @input=${this._onInput} @blur=${this._onBlur}>
			${tooltip}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		changedProperties.forEach((_, propName) => {
			if (propName === '_val1' || propName === '_val2') {
				// Setting the form value each time either value changes
				// Note: Each key is prefixed with this.name to avoid collisions if this control is used multiple times in a single form
				this.setFormValue({
					[`${this.name}-val1`]: this._val1,
					[`${this.name}-val2`]: this._val2,
				});
				this.setValidity({
					// Set the valueMissing flag to true if either the select or text input are empty
					valueMissing: !this._val1 || !this._val2,
					// Set the tooShort flag to true if the text input has a length less than 4
					tooShort: this._val2 && this._val2.length > 0 && this._val2.length < 4
				});
				// Since the user is in the middle of editing, false is passed because we only want to update the existing error message
				this.requestValidate(false);
			}
		});
	}

	// Defining a label getter or property will allow it to be included in the default validation messages.
	get label() {
		return 'My label';
	}

	// Override to provide custom validation messages
	get validationMessage() {
		if (this.validity.valueMissing) {
			return 'Both values are required.';
		} else if (this.validity.tooShort) {
			return 'You must provide at least 4 characters.';
		}
		// Don't forget to call super.validationMessage to provide a default error message.
		return super.validationMessage;
	}

	_onBlur() {
		// true is passed because we only want to show new errors when the user has finished editing
		this.requestValidate(true);
	}

	_onChange(e) {
		this._val1 = e.target.value;
	}

	_onInput(e) {
		this._val2 = e.target.value;
	}

}
customElements.define('my-form-element', MyFormElement);

```

## Advanced

- **[Wrapping Native Form Elements](./form-element-wrapping.md)**
	- If you need to create a custom form element that wraps native form elements like `input`, `select` and `textarea`, more information can be found here.
- **[Nesting Custom Form Elements](./form-element-nesting.md)**
	- If you need to create a custom form element that nests other custom form elements like `d2l-input-text` inside its shadow DOM, more information can be found here.

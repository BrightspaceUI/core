# Validation
## d2l-validation-custom

The `d2l-validation-custom` component is used to add custom validation logic to native form elements like `input`, `select` and `textarea` or custom form elements created with the [`FormElementMixin`](../form/docs/form-element-mixin.md).

**Native Form Elements:**
- When attached to native form elements like `input`, `select` and `textarea`, both the `d2l-validation-custom` and native form element **must** be within a [`d2l-form`](../form/docs/form.md) or [`d2l-form-native`](../form/docs/form-native.md) for the validation custom to function.

**Custom Form Elements:**
- When attached to custom form elements created with the [`FormElementMixin`](../form/docs/form-element-mixin.md), the `d2l-validation-custom` will function even if no [`d2l-form`](../form/docs/form.md) or [`d2l-form-native`](../form/docs/form-native.md) is present.

**Usage:**
```html
<script type="module">
  import '@brightspace-ui/core/components/validation/validation-custom.js';
</script>

<d2l-input-text id="my-text-input"></d2l-input-text>
<d2l-validation-custom for="my-text-input" failure-text="My custom error message">
</d2l-validation-custom>

<script>
const input = document.getElementById('my-text-input');
input.addEventListener('d2l-validation-custom-validate', e => {
  // Implement your custom validation logic
  const myTextInput = e.detail.forElement;
  const isValid = myTextInput.value === 'secret phrase';
  e.detail.resolve(isValid);
});
</script>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `for` | String, required | Provide the `id` of the form element the validation custom should validate. Both the validation custom and its target element must be within the same shadow root. |
| `failure-text` | String, required |  The failure text that is displayed when the validation custom fails validation. |

**Events:**
* `d2l-validation-custom-validate`: dispatched when the form element is validated giving the validation custom an opportunity to run its validation logic
  * The form element being validated can be accessed from the `detail`'s `forElement` property.
  * When validation is finished, the `detail`'s `resolve` function **must** be called with a `boolean` value to indicate valid or invalid. If it is not called then validation will never complete and the component will be stuck in a validating state.

## ValidationCustomMixin

If you find yourself duplicating `d2l-validation-custom` validation logic in many places you may want to create your own custom validator using the `ValidationCustomMixin`.

**Usage:**
```javascript
import { ValidationCustomMixin } from '@brightspace-ui/core/validation/validation-custom-mixin.js';

// Use the ValidationCustomMixin
class MyValidationCustom extends ValidationCustomMixin(LitElement) {

  // Implement your custom validation logic
  async validate() {
    const myTextInput = e.detail.forElement;
    return  myTextInput.value === 'secret phrase';
  }
}
customElements.define('my-validation-custom', MyValidationCustom);

```

Once a component has been created using the `ValidationCustomMixin`, it may be used exactly like a `d2l-validation-custom`. However, the `d2l-validation-custom-validate` event isn't needed because the validation logic is included in the component itself.

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!

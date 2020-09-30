# Forms

There are several components and mixins available to help make working with forms easier.

## Validating and Submitting Forms Using `<d2l-form>` and `<d2l-form-native>`

These two components behave much like a native `<form>` element, grouping nested form elements together and controlling how their data is validated and submitted. Unlike native `<form>`s, they support our custom form elements.

- [d2l-form](docs/form.md): supports aggregation of nested forms for validation and submission
- [d2l-form-native](docs/form-native.md): emulates how a native `<form>` submits, but supports our custom form elements

## Custom Elements in Forms

To allow custom elements to participate in `<d2l-form>` and `<d2l-form-native>` submission and validation, use the [FormElementMixin](docs/form-element-mixin.md).

If your custom element uses other nested *custom* form elements internally, read about [form element nesting](docs/form-element-nesting.md).

On the other hand, if your custom element uses other nested *native* form elements internally, read about [form element wrapping](docs/form-element-wrapping.md).

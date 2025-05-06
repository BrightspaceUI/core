# Forms

There are several components and mixins available to help make working with forms easier.

## Validating and Submitting Forms Using `<d2l-form>`

Much like a native `<form>` element, `<d2l-form>` groups nested form elements together and controlls how their data is validated and submitted. Unlike native `<form>`s, it supports our custom form elements.

- [d2l-form](docs/form.md#form-d2l-form): supports aggregation of nested forms for validation and submission

## Custom Elements in Forms

To allow custom elements to participate in `<d2l-form>` submission and validation, use the [FormElementMixin](docs/form-element-mixin.md).

If your custom element uses other nested *custom* form elements internally, read about [form element nesting](docs/form-element-nesting.md).

On the other hand, if your custom element uses other nested *native* form elements internally, read about [form element wrapping](docs/form-element-wrapping.md).

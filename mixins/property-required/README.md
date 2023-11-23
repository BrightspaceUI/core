# PropertyRequiredMixin

This mixin will make a component's property "required". If a value is not provided for a required property, an exception will be thrown asynchronously.

Required properties are useful in situations where a missing value would put the component into an invalid state, such as an accessibility violation.

Only `String` properties can be required.

## Making a Property Required

To require a property, simply set `required` to `true` in the reactive Lit property definition:

```javascript
import { PropertyRequiredMixin } from '@brightspace-ui/core/mixins/property-required/property-required-mixin.js';

class MyElem extends PropertyRequiredMixin(LitElement) {
  static properties = {
    prop: { type: String, required: true }
  };
}
```

If a non-empty `String` value for `prop` is not provided, an exception will be thrown after a few seconds.

## Custom Validation

By default, validating a required property involves ensuring that it's a non-empty `String`. To customize this logic, set `required` to an object and provide a `validator` delegate.

```javascript
static properties = {
  mustBeFoo: {
    required: {
      validator: (value, elem, hasValue) => {
        return value === 'foo';
      }
    },
    type: String
  }
};
```

The `validator` will be passed the current property `value`, a reference to the element and the result of the default validation.

## Custom Messages

To customize the exception message that gets thrown when validation fails, set `required` to an object and provide a `message` delegate.

```javascript
static properties = {
  prop: {
    required: {
      message: (value, elem, defaultMessage) => {
        return `"prop" on "${elem.tagName}" is required.`;
      }
    },
    type: String
  }
};
```

The `message` delegate will be passed the current property `value`, a reference to the element and the default message.

## Dependent Properties

The mixin will automatically listen for updates to a required property and re-run the `validator` when the value changes. If custom validation logic relies on multiple properties, list them in `dependentProps`.

```javascript
static properties = {
  prop: {
    required: {
      dependentProps: ['isReallyRequired']
      validator: (value, elem, hasValue) => {
        return elem.isReallyRequired && hasValue;
      }
    },
    type: String
  },
  isReallyRequired: { type: Boolean }
};
```

## Unit Testing

If no custom `validator` is used, tests that assert the correct required property errors are thrown are unnecessary -- `@brightspace-ui/core` already covers those tests.

Required property exceptions are thrown asynchronously multiple seconds after the component has rendered. For unit tests, this makes catching them challenging.

To help, use the `flushRequiredPropertyErrors()` method.

```javascript
const tag = defineCE(
  class extends PropertyRequiredMixin(LitElement) {
    static properties = {
      prop: {
        type: String,
        required: {
          validator: (value) => value === 'valid'
        }
      }
    };
  }
);
const elem = await fixture(`<${tag} prop="invalid"></${tag}>`);
expect(() => elem.flushRequiredPropertyErrors()).to.throw();
```

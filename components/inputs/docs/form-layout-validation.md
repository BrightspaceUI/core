# Form Layout & Validation

There are several components available for working with collections of inputs. Inputs can be validated and submitted in a form, visually layed out using an input group, and related to each other semantically using an input fieldset.

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/form/form.js';
  import '@brightspace-ui/core/components/inputs/input-fieldset.js';
  import '@brightspace-ui/core/components/inputs/input-group.js';
  import '@brightspace-ui/core/components/inputs/input-text.js';

  const form = document.querySelector('d2l-form');
  document.querySelector('d2l-button').addEventListener('click', () => form.submit());
</script>
<d2l-form>
  <d2l-input-group>
    <d2l-input-text label="Name" required style="max-width: 200px;"></d2l-input-text>
    <d2l-input-fieldset label="Address" label-style="heading">
      <d2l-input-group>
        <d2l-input-text label="Street" style="max-width: 350px;"></d2l-input-text>
        <d2l-input-text label="City" style="max-width: 200px;"></d2l-input-text>
      </d2l-input-group>
    </d2l-input-fieldset>
  </d2l-input-group>
  <d2l-button primary style="margin-top: 1rem;">Submit</d2l-button>
</d2l-form>
```

## Form [d2l-form]

The `<d2l-form>` component is used to wrap inputs which are then validated and submitted together.

Unlike the standard HTML `<form>` element, `<d2l-form>` supports validating and submitting custom elements. It also displays an aggregated summary of validation errors at the top of the form.

<!-- docs: demo code properties name:d2l-form sandboxTitle:'Form' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/form/form.js';
  import '@brightspace-ui/core/components/inputs/input-group.js';
  import '@brightspace-ui/core/components/inputs/input-text.js';
  import '@brightspace-ui/core/components/inputs/input-textarea.js';

  const form = document.querySelector('d2l-form');
  document.querySelector('d2l-button')
    .addEventListener('click', () => form.submit());
  form.addEventListener('d2l-form-submit', e => {
    const data = e.detail.formData; // data.name, data.description
  })
</script>
<d2l-form>
  <d2l-input-group>
    <d2l-input-text label="Name" required style="max-width: 200px;"></d2l-input-text>
    <d2l-input-textarea label="Description" rows="3" style="max-width: 300px;"></d2l-input-textarea>
  </d2l-input-group>
  <d2l-button primary style="margin-top: 1rem;">Submit</d2l-button>
</d2l-form>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `no-nesting` | Boolean, default: `false` | Indicates that the form should opt-out of nesting.<br><br>This means that it will not be submitted or validated if an ancestor form is submitted or validated. However, directly submitting or validating a form with `no-nesting` will still trigger submission and validation for its descendant forms unless they also opt-out using `no-nesting`. |

### Events
- `d2l-form-submit`: Dispatched when the form is submitted. The form data can be obtained from the `detail`'s `formData` property.
- `d2l-form-invalid`: Dispatched when the form fails validation. The error map can be obtained from the `detail`'s `errors` property.
- `d2l-form-dirty`: Dispatched whenever any form element fires an `input` or `change` event. Can be used to track whether the form is dirty or not.
<!-- docs: end hidden content -->

### Submitting and Handling Form Submissions

A typical setup will involve listening for the `d2l-form-submit` event on the `<d2l-form>` and calling the form's `submit()` API to trigger the submission.

Before submission can proceed, all inputs in the form are validated.

If validation succeeds, the form data will be aggregated and provided to the `d2l-form-submit` event's `detail.formData`. If validation fails, a summary of the errors will be displayed to the user.

### Nested Forms

By default, `<d2l-form>` will discover nested descendant `<d2l-form>` elements and include their inputs in its validation and submission process. To opt a form out of this behaviour, set the `no-nesting` attribute.

When forms are nested, validation is _**atomic**_. Validation will only succeed if validation succeeds for the root form and all nested forms. If any form fails validation, none of them will be submitted.

Alternatively, nested form submission is _**independent**_. As a result, when nested forms all pass validation, each `<d2l-form>` will fire its own `d2l-form-submit` event with the data associated with that form. This avoids potential collisions when inputs in different forms share the same `name`.

## Input Group [d2l-input-group]

When more than one input is displayed together, a `<d2l-input-group>` can be used to apply a consistent gap to elements in its slot, as well as appropriate space between itself and a parent `<d2l-form>`'s validation errors.

<!-- docs: demo code display:block name:d2l-input-group sandboxTitle:'Input Group' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-group.js';
  import '@brightspace-ui/core/components/inputs/input-text.js';
  import '@brightspace-ui/core/components/inputs/input-textarea.js';
</script>
<d2l-input-group>
  <d2l-input-text label="Name" style="max-width: 200px;"></d2l-input-text>
  <d2l-input-textarea label="Description" rows="3" style="max-width: 300px;"></d2l-input-textarea>
</d2l-input-group>
```

## Input Fieldset [d2l-input-fieldset]

When inputs are related to each other (for example multiple inputs which together form a mailing address), a `<d2l-input-fieldset>` is used to provide that additional context.

Within the fieldset, `<d2l-input-group>` can still be used to provide a consistent gap between the inputs.

<!-- docs: demo code properties display:block name:d2l-input-fieldset sandboxTitle:'Input Fieldset' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-fieldset.js';
  import '@brightspace-ui/core/components/inputs/input-group.js';
  import '@brightspace-ui/core/components/inputs/input-text.js';
</script>
<d2l-input-fieldset label="Contact Information" label-style="heading">
  <d2l-input-group>
    <d2l-input-text type="tel" label="Phone" style="max-width: 200px;"></d2l-input-text>
    <d2l-input-text type="email" label="Email" style="max-width: 250px;"></d2l-input-text>
  </d2l-input-group>
</d2l-input-fieldset>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `label` | String, required | Label for the fieldset
| `label-hidden` | Boolean | Hides the label visually |
| `label-style` | Boolean | Style of the fieldset label |
| `required` | Boolean | Indicates that a value is required for inputs in the fieldset |

### Slots

* `inline-help`: Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
<!-- docs: end hidden content -->

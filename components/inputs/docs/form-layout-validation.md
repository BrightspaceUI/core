# Form Layout & Validation

Collections of inputs can be validated and submitted as part of a form, consistently displayed visually using an input group or related to each other semantically using an input fieldset.

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
  <d2l-input-text label="Name"></d2l-input-text>
  <d2l-input-textarea label="Description" max-rows="4" rows="4"></d2l-input-textarea>
</d2l-input-group>
```

## Input Fieldset [d2l-input-fieldset]

When inputs are related to each other (for example multiple inputs which together form a mailing address), a `<d2l-input-fieldset>` is used to provide that additional context.

<!-- docs: demo code properties display:block name:d2l-input-fieldset sandboxTitle:'Input Fieldset' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-fieldset.js';
  import '@brightspace-ui/core/components/inputs/input-group.js';
  import '@brightspace-ui/core/components/inputs/input-text.js';
</script>
<d2l-input-fieldset label="Contact Information">
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
| `required` | Boolean | Indicates that a value is required for inputs in the fieldset |

### Slots

* `inline-help`: Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
<!-- docs: end hidden content -->

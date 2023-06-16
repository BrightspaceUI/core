# Checkboxes

Checkboxes are used in forms to toggle an option or preference.

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-checkbox.js';
</script>
<d2l-input-checkbox checked>Label for checkbox</d2l-input-checkbox>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use in a form to indicate an option or preference.
* Use to allow the user to select multiple, independent options from a set
* Use an indeterminate state to indicate a mixed state where some child items are checked and some are not
* Use as progressive disclosure in forms, so long as users are made aware both visually and non-visually that new options have been made available.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use as a toggle that performs an immediate action, use a Switch component.
* Don't use for mutually exclusive options, use radio buttons.
* Don't use labels as “instructions” or “phrases”. Good label: “Visible to Students”. Bad label: (“Check this to make it visible to students”)
* Don't use labels to describe the default or “off” state of the option. As much as possible, use the label to refer to the “on” state. Good label: “Visible”. Bad label: “Hidden”.
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Checkbox Input [d2l-input-checkbox]

The `<d2l-input-checkbox>` element can be used to get a checkbox and optional visible label.

<!-- docs: demo code properties name:d2l-input-checkbox display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-checkbox.js';

  window.addEventListener('load', function () {
    var input = document.querySelector('#checkbox');
    input.addEventListener('change', (e) => {
      console.log('checked value: ', input.checked);
    });
  });
</script>
<div>
  <d2l-input-checkbox id="checkbox">Label for checkbox</d2l-input-checkbox>
  <d2l-input-checkbox>Label for second checkbox</d2l-input-checkbox>
</div>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `aria-label` | String | Set instead of placing label inside to hide the visible label |
| `checked` | Boolean | Checked state |
| `description` | String | A description to be added to the `input` for accessibility |
| `disabled` | Boolean | Disables the input |
| `indeterminate` | Boolean | Sets checkbox to an indeterminate state |
| `name` | String | Name of the input |
| `not-tabbable` | Boolean | Sets `tabindex="-1"` on the checkbox |
| `value` | String | Value of the input |

### Events

When the checkbox's state changes, it dispatches the `change` event:

```javascript
checkbox.addEventListener('change', (e) => {
  console.log(checkbox.checked);
});
```
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-input-checkbox` accessible, use the following properties when applicable:

| Attribute | Description |
|---|---|
| `aria-label` | Use when text on checkbox does not provide enough context |
| `description` | Use when label on input does not provide enough context. |

### Methods

- `simulateClick()`: useful for testing, it simulates the user clicking on the checkbox, which toggles the state of the checkbox and fires the `change` event

## Checkbox Spacer [d2l-input-checkbox-spacer]

To align related content below checkboxes, the `d2l-input-checkbox-spacer` element can be used:

<!-- docs: demo code display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-checkbox.js';
  import '@brightspace-ui/core/components/inputs/input-checkbox-spacer.js';
</script>
<div>
  <d2l-input-checkbox>Label for checkbox</d2l-input-checkbox>
  <d2l-input-checkbox-spacer>
    Additional content can go here and will
    line up nicely with the edge of the checkbox.
  </d2l-input-checkbox-spacer>
</div>
```

## Applying styles to native checkboxes

As an alternative to using the `<d2l-input-checkbox>` custom element, you can style a native checkbox inside your own element. Import `input-checkbox-styles.js` and apply the `d2l-input-checkbox` CSS class to the input:

<!-- docs: demo code display:block -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { checkboxStyles } from '@brightspace-ui/core/components/inputs/input-checkbox.js';

  class MyCheckboxElem extends LitElement {

    static get styles() {
      return checkboxStyles;
    }

    render() {
      return html`<input type="checkbox" class="d2l-input-checkbox">`;
    }

  }
  customElements.define('d2l-my-checkbox-elem', MyCheckboxElem);
</script>
<d2l-my-checkbox-elem></d2l-my-checkbox-elem>
```

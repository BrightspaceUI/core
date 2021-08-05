# Radio Buttons

Radio Buttons are used in forms to offer a single choice among mutually exclusive options.

<!-- docs: start hidden content -->
![example screenshot of radio inputs](../screenshots/radio.gif?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/demo/input-radio-label-simple-test.js';
</script>
<d2l-test-input-radio-label-simple></d2l-test-input-radio-label-simple>
```

Unlike checkboxes, individual radio buttons cannot be placed in a custom element. Items belonging to a radio group cannot span across different shadow roots -- all radios in the same group must be in the same shadow root.

As a result, we have to apply styles to native radio inputs.

Note: in order for RTL to function correctly, make sure your component uses the `RtlMixin`.

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use as an input for traditional forms
* Use when there are 3 or more mutually exclusive options
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t use two radio buttons if a single checkbox works better
* Don’t use for triggering an immediate action. Notable exceptions are forms that autosave with clear indication and as a trigger for progressive disclosure on traditional forms, so long as users are made aware that new options have been made available
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Radio Inputs With Labels

The simplest way to apply radio styles is to use the `d2l-input-radio-label` CSS class on a `<label>` element that wraps the input.

For disabled items, add the `d2l-input-radio-label-disabled` class on the label and the `disabled` attribute on the input itself.

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/demo/input-radio-label-test.js';
</script>
<d2l-test-input-radio-label></d2l-test-input-radio-label>
```

```javascript
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { radioStyles } from '@brightspace-ui/core/components/inputs/input-radio-styles.js';

class MyElem extends RtlMixin(LitElement) {

  static get styles() {
    return radioStyles;
  }

  render() {
    return html`
      <label class="d2l-input-radio-label">
        <input type="radio" name="myGroup" checked>
        Option 1 (selected)
      </label>
      <label class="d2l-input-radio-label d2l-input-radio-label-disabled">
        <input type="radio" name="myGroup" disabled>
        Option 2 (disabled)
      </label>
      <label class="d2l-input-radio-label">
        <input type="radio" name="myGroup">
        Option 3
      </label>
    `;
  }

}
```

## Individual Radio Inputs

If you'd like to manually link the radio input with a label, or use an ARIA label, place the `d2l-radio-input` CSS class on the input itself to style it. For example:

```javascript
import { radioStyles } from './input-radio-styles.js';

class MyElem extends LitElement {

  static get styles() {
    return radioStyles;
  }

  render() {
    return html`
      <input type="radio" class="d2l-input-radio" aria-label="Option 1">
    `;
  }

}
```

The example below uses a component similar to that in the code above which allows toggling of properties in order to see what those styles look like.

<!-- docs: demo live name:d2l-test-input-radio-solo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/demo/input-radio-solo-test.js';
</script>
<d2l-test-input-radio-solo></d2l-test-input-radio-solo>
```

## Radio Spacer [d2l-input-radio-spacer]

To align related content below radio buttons, the `d2l-input-radio-spacer` element can be used:

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/demo/input-radio-spacer-test.js';
</script>
<d2l-test-input-radio-spacer></d2l-test-input-radio-spacer>
```

```javascript
import '@brightspace-ui/core/components/inputs/input-radio-spacer.js';
import { radioStyles } from '@brightspace-ui/core/components/inputs/input-radio-styles.js';

class MyElem extends LitElement {

  static get styles() {
    return radioStyles;
  }

  render() {
    return html`
	  <input type="radio" class="d2l-input-radio" aria-label="Option 1">
	  <d2l-input-radio-spacer>
		Additional content can go here and will
		line up nicely with the edge of the radio.
	  </d2l-input-radio-spacer>
    `;
  }

}
```

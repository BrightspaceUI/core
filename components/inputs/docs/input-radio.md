# Radio Buttons

Unlike checkboxes, individual radio buttons cannot be placed in a custom element. Items belonging to a radio group cannot span across different shadow roots -- all radios in the same group must be in the same shadow root.

As a result, we have to apply styles to native radio inputs.

Note: in order for RTL to function correctly, make sure your component uses the `RtlMixin`.

## Radio Inputs With Labels

The simplest way to apply radio styles is to use the `d2l-input-radio-label` CSS class on a `<label>` element that wraps the input.

![example screenshot of radio inputs](../screenshots/radio.gif?raw=true)

For disabled items, add the `d2l-input-radio-label-disabled` class on the label and the `disabled` attribute on the input itself.

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

If you'd like to manually link the radio input with a label, or use an ARIA label, place the `d2l-radio-input` CSS class on the input itself to style it.

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

## Radio Spacer

To align related content below radio buttons, the `d2l-input-radio-spacer` element can be used:

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

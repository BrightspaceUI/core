# Styling Native Inputs

In the majority of cases, it's recommended to use our web component wrappers around native inputs like text, textarea, checkboxes and radios. They'll provide functionality like inline help, skeletons, form participation, and localized validation out-of-the-box.

In the rare circumstance where a native HTML input is preferred, it is possible to apply styles such that they appear similar to our web component variants.

## Checkbox Input

Import `input-checkbox-styles.js` and apply the `d2l-input-checkbox` CSS class to the input:

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

## Radio Inputs

### With Labels

The simplest way to apply radio styles is to use the `d2l-input-radio-label` CSS class on a `<label>` element that wraps the input.

For disabled items, add the `d2l-input-radio-label-disabled` class on the label and the `disabled` attribute on the input itself.

<!-- docs: demo code display:block -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { radioStyles } from '@brightspace-ui/core/components/inputs/input-radio-styles.js';

  class MyRadioElem extends LitElement {

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
  customElements.define('d2l-my-radio-elem', MyRadioElem);
</script>
<d2l-my-radio-elem></d2l-my-radio-elem>
```

### Individual Radio Inputs

If you'd like to manually link the radio input with a label, or use an ARIA label, place the `d2l-radio-input` CSS class on the input itself to style it. For example:

<!-- docs: demo code properties name:d2l-test-input-radio-solo display:block -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { radioStyles } from '@brightspace-ui/core/components/inputs/input-radio-styles.js';

  class MyRadioElem extends LitElement {

    static get properties() {
      return {
        checked: { type: Boolean },
        disabled: { type: Boolean },
        invalid: { type: Boolean }
      };
    }

    static get styles() {
      return radioStyles;
    }

    render() {
      const invalid = this.invalid ? 'true' : 'false';
      return html`
        <input
          aria-invalid="${invalid}"
          aria-label="Option 1"
          ?checked="${this.checked}"
          class="d2l-input-radio"
          ?disabled="${this.disabled}"
          type="radio">
      `;
    }

  }
  customElements.define('d2l-test-input-radio-solo', MyRadioElem);
</script>
<d2l-test-input-radio-solo></d2l-test-input-radio-solo>
```

### Radio Spacer [d2l-input-radio-spacer]

To align related content below radio buttons, the `d2l-input-radio-spacer` element can be used in conjunction with the `d2l-input-radio-label` class:

<!-- docs: demo code display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/inputs/input-radio-spacer.js';
  import { html, LitElement } from 'lit';
  import { inlineHelpStyles } from '@brightspace-ui/core/components/inputs/input-inline-help.js';
  import { radioStyles } from '@brightspace-ui/core/components/inputs/input-radio-styles.js';

  class MyRadioElem extends LitElement {

    static get styles() {
      return [ radioStyles, inlineHelpStyles ];
    }

    render() {
      return html`
        <label class="d2l-input-radio-label">
          <input type="radio" aria-describedby="desc1" value="normal" checked>
          Option 1
        </label>
        <d2l-input-radio-spacer id="desc1" class="d2l-input-inline-help">
          Additional content can go here and will line up nicely with the edge of the radio.
        </d2l-input-radio-spacer>
      `;
    }

  }
  customElements.define('d2l-my-radio-spacer-elem', MyRadioElem);
</script>
<d2l-my-radio-spacer-elem></d2l-my-radio-spacer-elem>
```

## Text Input

Import `input-styles.js` and apply the `d2l-input` CSS class to the native `<input>`:

<!-- docs: demo code -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';

  class MyTextInputElem extends LitElement {

    static get styles() {
      return inputStyles;
    }

    render() {
      return html`<input type="text" class="d2l-input">`;
    }

  }
  customElements.define('d2l-my-text-input-elem', MyTextInputElem);
</script>
<d2l-my-text-input-elem></d2l-my-text-input-elem>
```

## Textarea Input

Import `input-styles.js` and apply the `d2l-input` CSS class to the  native `<textarea>`.

<!-- docs: demo code -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';

  class MyTextareaInputElem extends LitElement {
    static get styles() {
      return inputStyles;
    }
    render() {
      return html`
        <textarea class="d2l-input">
        </textarea>
        `;
    }
  }
  customElements.define('d2l-my-textarea-input-elem', MyTextareaInputElem);
</script>
<d2l-my-textarea-input-elem></d2l-my-textarea-input-elem>
```

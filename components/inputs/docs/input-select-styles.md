# Select Lists

A Select List allows the user to select a single option out of a relatively large number of items, or to reduce the visual prominence of an option selection.

<!-- docs: demo -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

  class MySelectElem extends LitElement {

    static get styles() {
      return selectStyles;
    }
    render() {
      return html`
        <select class="d2l-input-select">
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
        `;
    }

  }
  customElements.define('d2l-my-select-elem', MySelectElem);
</script>
<d2l-my-select-elem></d2l-my-select-elem>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use to allow the user to select a single option from a relatively large list of options
* Use to save space / reduce the visual prominence of an exclusive selection option (instead of a choice from 8 radio buttons)
* Use a Select List to tuck away non-critical options, or options where the default selection is likely to be the most desirable.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use if your options are more than 1-2 words. The cognitive load of comparing options in a Select List is relatively high
* Select Lists show the available options offscreen – be careful if the selections you are asking the user to make are on the critical path – see [Dropdowns should be the UI of last resort](https://www.lukew.com/ff/entry.asp?1950) and be careful about your selection.
* Select Lists are form controls, and should not submit data or have instant actions on page occur without an explicit submit action.
Toggling progressive disclosure is OK
* Don't use prompt text in place of a Select List field label – it’s harder to scan and negatively impacts accessibility.
* Don't use for numeric input – a text field with type “number” or a date-picker is much easier to use control
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Applying styles to native select elements

Native `<select>` elements can be styled by importing `input-select-styles.js` into your LitElement and applying the `d2l-input-select` CSS class.

The styles support the pseudo-classes `disabled`, `focus`, and `hover`, as well as the `aria-invalid` attribute.

When applying styles to the native element, we also recommend using the [`SkeletonMixin`](https://github.com/BrightspaceUI/core/tree/main/components/skeleton) to help convey to users that the page, or at least a section of it, has not finished loading yet.

<!-- docs: demo code name:d2l-test-input-select -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';
  import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

  class TestInputSelect extends SkeletonMixin(LitElement) {
  static get styles() {
    return [ super.styles, selectStyles ];
  }

  render() {
    return html`
      <div class="d2l-skeletize">
        <select
          aria-label="Choose a dinosaur:"
          class="d2l-input-select">
          <option>Tyrannosaurus</option>
          <option>Velociraptor</option>
          <option>Deinonychus</option>
        </select>
      </div>
    `;
  }

  }
  customElements.define('d2l-test-input-select', TestInputSelect);
</script>
<d2l-test-input-select></d2l-test-input-select>
```

### Invalid

Use the [`aria-invalid`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid) attribute to support screenreader users and apply our consistent error styles.

<!-- docs: demo -->
```html
<script type="module">
  import { html, LitElement } from 'lit';
  import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

  class TestInputSelect extends LitElement {

    static get properties() {
    return {
      invalid: { type: Boolean }
    };
  }

  static get styles() {
    return [ selectStyles ];
  }

  render() {
    const invalid = this.invalid ? 'true' : 'false';
    return html`
      <select
        aria-label="Choose a dinosaur:"
        aria-invalid="${invalid}"
        class="d2l-input-select">
        <option>Tyrannosaurus</option>
        <option>Velociraptor</option>
        <option>Deinonychus</option>
      </select>
    `;
  }

  }
  customElements.define('d2l-test-input-select', TestInputSelect);
</script>
<d2l-test-input-select invalid></d2l-test-input-select>
```

## Accessibility

- Due to merely being a CSS class, the accessibility provided by `selectStyles` comes purely in the way of following the guidelines for [contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) and [focus](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- There are several things that can be done to make sure your `select` component is accessible, including:
  - Following the W3C [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) pattern
  - Using either the `aria-label` or `aria-labelledby` to appropriately assign a label to your component
  - Using `label` for `optgroup` if you choose to use that element within the select element, so that it can be read out to screenreaders

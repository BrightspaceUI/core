# Select Lists

Native `<select>` elements can be styled by importing `input-select-styles.js` into your LitElement and applying the `d2l-input-select` CSS class.

![example screenshot of select inputs](../screenshots/select.gif?raw=true)

Note: in order for RTL to function correctly, make sure your component uses the `RtlMixin`.

```javascript
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';
class MyElem extends RtlMixin(LitElement) {
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
```

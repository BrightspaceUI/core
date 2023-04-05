# FocusMixin

The `FocusMixin` can be used to delegate focus to an element within a component's shadow root when its `focus()` method is called.

If the component has yet to render, focus will automatically be applied after `firstUpdated`.

## Usage

Apply the mixin and set the static `focusElementSelector` to a CSS query selector which will match the element to which focus should be delegated.

```js
import { FocusMixin } from '@brightspace-ui/core/mixins/focus/focus-mixin.js';

class MyComponent extends FocusMixin(LitElement) {

  // delegate focus to the underlying input
  static get focusElementSelector() {
    return 'input';
  }

  render() {
    return html`<input type="text">`;
  }

}
```

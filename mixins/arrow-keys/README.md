# ArrowKeysMixin

The `ArrowKeysMixin` enables the user to move focus using the arrow keys. The `right/down` arrow keys move focus to the next element or the first element if focus is currently at the end. The `left/up` arrow keys move focus to the previous element, or the last element if focus is currently at beginning. The `home` and `end` key apply focus to the first and last elements respectively.

## Usage

The focusable elements can be provided in one of two ways:

If the elements are known up-front and are in the element's local DOM scope, simply add the d2l-arrowkeys-focusable class.

```javascript
import { ArrowKeysMixin } from '@brightspace-ui/core/mixins/arrow-keys/arrow-keys-mixin.js';
class MyElement extends ArrowKeysMixin(LitElement) {
  render() {
    return this.arrowKeysContainer(html`
      <div>
        ...
        <a href="..." class="d2l-arrowkeys-focusable">link 1</a>
        <a href="..." class="d2l-arrowkeys-focusable">link 2</a>
        ...
      </div>
    `);
  }
}
customElements.define('my-element', MyElement);
```

If the elements are not known up front, or the elements cannot be simply queried in the element's local DOM-scope, an async arrowKeysFocusablesProvider may be implemented.

```javascript
import { ArrowKeysMixin } from '@brightspace-ui/core/mixins/arrow-keys/arrow-keys-mixin.js';
class MyElement extends ArrowKeysMixin(LitElement) {
  render() {
    return this.arrowKeysContainer(html`
      <div>
        ...
        <a href="...">link 1</a>
        <a href="...">link 2</a>
        ...
      </div>
    `);
  }
  async arrowKeysFocusablesProvider() {
    return [ /* array containing focusable elements */]
  }
}
customElements.define('my-element', MyElement);
```

**Properties:**

- `arrowKeysDirection` (String): Indicates which arrow keys are allowed (default is leftright)
- `arrowKeysNoWrap` (Boolean): Whether focus should wrap from end-to-start and start-to-end

**Methods:**
- `arrowKeysContainer(innerHtmlTemplate)`: Hooks up the event listener, to be used in your `render` function to wrap the focusable elements
- `async arrowKeysFocusablesProvider()` (Array): Optional - Override to provide the focusable elements if necessary (see above)
- `async arrowKeysOnBeforeFocus(elemToBeFocused)`: Optional - Override to provide an async callback invoked before focus is applied

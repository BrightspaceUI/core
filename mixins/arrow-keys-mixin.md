# ArrowKeysMixin

Used for managing focus with the arrow keys.

right/down - focuses next element, or first if currently at the end
left/up - focuses previous element, or last if currently at beginning
home - focuses first
end - focuses last

# Usage

The focusable elements can be provided in one of two ways.

If the elements are known up-front and are in the element's local DOM scope, simply add the d2l-arrowkeys-focusable class.

```javascript
import { ArrowKeysMixin } from '@brightspace-ui/core/mixins/arrowkeys-mixin.js';
class MyElement extends ArrowKeysMixin(LitElement) {
   render() {
      return html`
         <div>
            ...
            <a href="..." class="d2l-arrowkeys-focusable">link 1</a>
            <a href="..." class="d2l-arrowkeys-focusable">link 2</a>
            ...
         </div>
      `;
   }
}
customElements.define('my-element', MyElement);
```

If the elements are not known up front, or the elements cannot be simply queried in the element's local DOM-scope, an async arrowKeysFocusablesProvider may be implemented.

```javascript
import { ArrowKeysMixin } from '@brightspace-ui/core/mixins/arrowkeys-mixin.js';
class MyElement extends ArrowKeysMixin(LitElement) {
   render() {
      return html`
         <div>
            ...
            <a href="...">link 1</a>
            <a href="...">link 2</a>
            ...
         </div>
      `;
   }
   async arrowKeysFocusablesProvider() {
      return [ /* array containing focusable elements */]
   }
}
customElements.define('my-element', MyElement);
```

# Properties:

`arrowKeysDirection` (optional): string listing which arrow keys are allowed (default is leftright)
`arrowKeysNoWrap` (optional): To opt out of wrapping focus from end-to-start and start-to-end
`arrowKeysBeforeFocus` (optional): Async callback invoked before focus us applied

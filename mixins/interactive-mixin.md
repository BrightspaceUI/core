# InteractiveMixin

The `InteractiveMixin` enables keyboard toggling of interactive elements (such as those that use arrow keys) inside nested grids. It addresses the issue of conflicting arrow key behaviour. If the component is rendered as a descendant of a grid, keyboard users use the `Enter` key to toggle into interactive mode, and the `Escape` key to toggle out. 

## Usage

Apply the mixin and set the static `focusElementSelector` to a CSS query selector which will match the element to which focus should be delegated.

```js
import { InteractiveMixin } from '@brightspace-ui/core/mixins/interactive-mixin.js';

class MyComponent extends InteractiveMixin(LitElement) {

  render() {
    return this._renderInteractiveContainer(
      html`
        <div>interactive content</div>
      `
    );
  }

}
```

# InteractiveMixin

The `InteractiveMixin` enables keyboard toggling of interactive elements (such as those that use arrow keys) inside nested grids. It addresses the issue of conflicting arrow key behaviour. If the component is rendered as a descendant of a grid, keyboard users use the `Enter` key to toggle into interactive mode, and the `Escape` key to toggle out.

## Usage

Apply the mixin, call its `renderInteractiveContainer` method from `render`, providing the interactive content, label for the toggle, and a focus delegate that the mixin can call to focus on the contents.

**Note:** consumers _must_ provide a focus delegate as mentioned. They _should not_ implement a `focus` method, since the mixin manages focus with its own implementation.

```js
import { InteractiveMixin } from '@brightspace-ui/core/mixins/interactive-mixin.js';

class MyComponent extends InteractiveMixin(LitElement) {

  render() {
    return this.renderInteractiveContainer(
      html`<div>interactive content</div>`,
      'My Label',
      () => {
        // focus on interactive content element
      }
    );
  }

}
```

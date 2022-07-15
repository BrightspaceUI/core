# TrimWhitespaceMixin

The `TrimWhitespaceMixin` trims all descendant text nodes in a component, removing all leading and trailing whitespace. This can be useful in components where whitespace between elements has a visible effect, e.g. those with `display: inline`.

The mixin has `trimWhitespaceDeep` setting that can optionally be set, telling it to recurse into all nested shadow DOMs, and there is a `noTrim` directive available to exclude individual elements from having trim applied.

## Usage

Apply the mixin and optionally set the `trimWhitespaceDeep` property, either in the constructor or as an attribute.

When the component is connected (`connectedCallback`), the mixin will search all descendants of the component, trimming the whitespace in any text nodes. A listener is also added to trim any components that are subsequently added or changed, and the listener is removed on the component's `disconnectedCallback`.

```js
import { TrimWhitespaceMixin, noTrim } from '@brightspace-ui/core/mixins/trim-whitespace/trim-whitespace-mixin.js';

class MyComponent extends TrimWhitespaceMixin(LitElement) {

  // Optional - this is only recommended when it's necessary to descend into nested shadow DOMs.
  // static get trimWhitespaceDeep() {
  //   return true;
  // }

  render() {
    return html`
      <span> Even though there is a newline and spaces before and inside this span, they will not show up when rendered. </span>
      <span ${noTrim()}> This span will keep its whitespace. </span>

      <some-component>
        <!-- Anything in this component's nested shadow DOM *won't* be trimmed unless trim-whitespace-deep is true. -->
        <span> Any nested slotted elements like this one will still be trimmed. </span>
      </some-component>
    `;
  }

}
```

## Limitations

- `noTrim`: Doesn't recurse, meaning it only prevents trimming of an element's own direct text nodes, not any of its descendants
- Performance: To respond to updates in the text, this mixin relies on a `MutationObserver` watching a node's full `subtree` for `characterData` and `childList` changes. If the component is large, this could become expensive.
- Nodes: This mixin only trims nodes, it does not delete empty text nodes. While deleting empty nodes would be ideal, this interferes with Lit's internal tracking of nodes for handling updates, and so is out of scope.

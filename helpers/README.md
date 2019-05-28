# Helpers

## DOM

DOM helper functions to make your life easier.

### Usage

```js
import { ... } from '@brightspace-ui/core/helpers/dom.js';

// returns null or the closest ancestor that fulfills the specified predicate fxn
findComposedAncestor(node, predicate);

// gets the composed children (including shadow children & distributed children)
getComposedChildren(element);

// gets the composed parent (including shadow host & insertion points)
getComposedParent(node);

// returns true/false whether the specified ancestorNode is an ancestor of node
isComposedAncestor(ancestorNode, node);
```

## UniqueId

A simple helper that returns a unique id.

### Usage

```js
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';

// gets a unique indexed id (for lifetime of page)
getUniqueId();
```

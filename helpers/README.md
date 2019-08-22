# Helpers

## Dismissible

Dismissible components are those that should be dismissible when the user presses
the `ESC` key. This is a requirement for components who display on-hover or
on-focus under [WCAG 2.1 Criterio 1.4.13: Content on Hover or Focus](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html).

The dismissible helper uses a first-in-last-out ordering to ensure that each time
the `ESC` key is pressed, only the most recent component is dismissed.

### Usage

When the component becomes visible to the user, call `setDismissible(cb)`, passing a callback. The callback will be called if the user presses `ESC` and that component should be dismissed.

`setDismissible` also returns a unique identifier which can be saved and used later to remove itself from being notified. `clearDismissible(id)` should be called if the component is hidden or removed through any means other than the user pressing `ESC`. Web components should call `clearDismissible` in their `disconnectedCallback`.

```js
import {clearDismissible, setDismissible} from '@brightspace-ui/core/helpers/dismissible.js';

// Call when component is made visible
// to be notified of ESC key presses.
const id = setDismissible(() => {
	// Callback will be called if user presses ESC.
	// Component should dismiss itself.
});

// Call when component is hidden or removed
// through other means. It will no longer be
// notified of ESC key presses.
clearDismissible(id);
```

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

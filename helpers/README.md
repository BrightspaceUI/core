# Helpers

## Announce

A helper for announcing text to screen readers.

```js
import { announce } from '@brightspace-ui/core/helpers/announce.js';

// announce some text
announce('...');
```

## AsyncStateEvent

A simple helper class that returns a `pending-state` event for a given pending promise. Can be used in conjunction with the `AsyncContainerMixin` to track pending work.

```js
import { AsyncStateEvent } from '@brightspace-ui/core/helpers/asyncStateEvent.js';

const asyncStateEvent = new AsyncStateEvent(pendingPromise);
```

## Dismissible

Dismissible components are those that should be dismissible when the user presses
the `ESC` key. This is a requirement for components who display on-hover or
on-focus under [WCAG 2.1 Criterio 1.4.13: Content on Hover or Focus](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html).

The dismissible helper uses a first-in-last-out ordering to ensure that each time
the `ESC` key is pressed, only the most recent component is dismissed.

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

```js
import { ... } from '@brightspace-ui/core/helpers/dom.js';

// returns null or the closest ancestor that fulfills the specified predicate fxn
findComposedAncestor(node, predicate);

// gets the composed children (including shadow children & distributed children)
getComposedChildren(element);

// gets the composed parent (including shadow host & insertion points)
getComposedParent(node);

// returns the closest composed sibling at least one dom level up
getNextAncestorSibling(node, predicate = () => true);

// browser consistent implementation of HTMLElement.offsetParent
getOffsetParent(node);

// returns true/false whether the specified ancestorNode is an ancestor of node
isComposedAncestor(ancestorNode, node);

// returns true/false whether the element is visible regardless of positioning
isVisible(node);
```

## Focus

Focus helper functions to easily select focusable DOM nodes

```js
import { ... } from '@brightspace-ui/core/helpers/focus.js';

// gets the active element, including shadow DOM active elements
getComposedActiveElement()

// gets the first focusable descendant given a node, including those within the shadow DOM
getFirstFocusableDescendant(node, includeHidden, predicate)

// gets the last fusable descendant given a node, including those within the shadow DOM
getLastFocusableDescendant(node, includeHidden)

// gets the previous focusable node on the page given a node
getPreviousFocusable(node, includeHidden)

// gets the next focusable node on the page given a node
getNextFocusable(node, includeHidden)

// gets the ancestor of the given node that is focusable
getPreviousFocusableAncestor(node, includeHidden, includeTabbablesOnly)

// returns true/false whether the element is focusable
isFocusable(node, includeHidden, includeTabbablesOnly, includeDisabled)
```

## Gesture - Swipe

A simple helper for swipe touch gestures, providing distance, direction, and duration.

```js
import { registerGestureSwipe } from '@brightspace-ui/core/helpers/gestures.js';

// sets up event listeners for swipe gesture
registerGestureSwipe(element);

// listen for custom swipe event
element.addEventListener('d2l-gesture-swipe', (e) => {
    console.log(
        e.detail.distance,             // .x/.y
        e.detail.direction.angle,      // deg, clock-wise from y-axis
        e.detail.direction.horizontal, // left/right
        e.detail.direction.vertical,   // up/down
        e.detail.duration              // ms
    );
});
```

## queueMicrotask

A polyfill for [queueMicrotask](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask). For more information on microtasks, read [this article from Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide).

```js
import '@brightspace-ui/core/helpers/queueMicrotask.js';
queueMicrotask(() => {
    // do some work
});
```

## requestIdleCallback

A simple shim for [requestIdleCallback](https://www.w3.org/TR/requestidlecallback/#the-requestidlecallback-method) and [cancelIdleCallback](https://www.w3.org/TR/requestidlecallback/#the-cancelidlecallback-method) that transparently falls back to `setTimeout` if it's not natively supported.

The Google Developer update on [using requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback) has some excellent examples of usage. Provide a callback for non-essential work, and optionally a `timeout` after which the callback will be invoked regardless of activity on the main thread. A `deadline` object is passed with a `timeRemaining()` function and a `didTimeout` property, enabling the consumer to queue tasks across callbacks if necessary.

```js
import '@brightspace-ui/core/helpers/requestIdleCallback.js';

requestIdleCallback((deadline) => {
    // do some work
}, { timeout: 1000 });
```

## UniqueId

A simple helper that returns a unique id.

```js
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';

// gets a unique indexed id (for lifetime of page)
getUniqueId();
```

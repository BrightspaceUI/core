# Helpers

## Announce

A helper for announcing text to screen readers.

```js
import { announce } from '@brightspace-ui/core/helpers/announce.js';

// announce some text
announce('...');
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

// browser consistent implementation of HTMLElement.offsetParent
getOffsetParent(node);

// returns true/false whether the specified ancestorNode is an ancestor of node
isComposedAncestor(ancestorNode, node);
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

## queueMicrotask

A polyfill for [queueMicrotask](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask).

```js
import '@brightspace-ui/core/helpers/queueMicrotask.js';
queueMicrotask(() => {
	// do some work
});
```

## UniqueId

A simple helper that returns a unique id.

```js
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';

// gets a unique indexed id (for lifetime of page)
getUniqueId();
```

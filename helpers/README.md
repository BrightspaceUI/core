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

## composeMixins

A helper function for cleanly incorporating a list of mixins into a base class. Designed for use with Lit components with a large amount of reusable functionality.

```js
// other imports...
import { composeMixins } from '@brightspace-ui/core/helpers/composeMixins.js';

class ExampleComponent extends composeMixins(
  LitElement,
  EntityMixin,
  LocalizeMixin,
) {
  // ...
}
```

Read more about mixins on [the `open-wc` docs](https://open-wc.org/docs/development/dedupe-mixin/#what-is-a-mixin).

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

// adds a value to an id-list attribute (e.g. aria-labelledby)
elemIdListAdd(node, attrName, value);

// removes a value from an id-list attribute (e.g. aria-labelledby)
elemIdListRemoves(node, attrName, value);

// returns null or the closest ancestor that fulfills the specified predicate fxn
findComposedAncestor(node, predicate);

// gets the composed children (including shadow children & distributed children)
// includes a predicate which will add children nodes when predicate(node) is true
getComposedChildren(element, predicate = () => true);

// gets the composed parent (including shadow host & insertion points)
getComposedParent(node);

// returns the next composed sibling at least one dom level up
// includes a predicate which will return the node when predicate(node) is true
getNextAncestorSibling(node, predicate = () => true);

// returns the previous composed sibling at least one dom level up
// includes a predicate which will return the node when predicate(node) is true
getPreviousAncestorSibling(node, predicate = () => true);

// browser consistent implementation of HTMLElement.offsetParent
getOffsetParent(node);

// returns true/false whether the specified ancestorNode is an ancestor of node
isComposedAncestor(ancestorNode, node);

// returns true/false whether the element is visible regardless of positioning
isVisible(node, parentIsKnownVisible);

// returns the first visible ancestor of the given node
getFirstVisibleAncestor(node)

// similar to document.querySelector or element.querySelector,
// except it queries not just the light DOM but also shadow DOM
querySelectorComposed(node, selector)
```

## Focus

Focus helper functions to easily select focusable DOM nodes

```js
import { ... } from '@brightspace-ui/core/helpers/focus.js';

// gets the active element, including shadow DOM active elements
getComposedActiveElement()

// gets the first focusable descendant given a node, including those within the shadow DOM
getFirstFocusableDescendant(node, includeHidden, predicate, includeTabbablesOnly, nodeIsKnownVisible)

// gets the first focusable node alternative, including those within the shadow DOM
// focusable alternatives include itself, a descendant, or it's parent's first focusable alternative
getFocusAlternative(node, includeHidden, predicate, includeTabbablesOnly, nodeIsKnownVisible)

// gets the focusable elements within the specified element
getFocusableDescendants(node, { deep: false, disabled: false, hidden: false, predicate: elem => false, tabbablesOnly: true })

// gets the focus pseudo-class to used in selectors (focus-visible if supported, or focus)
// Usage:
//	css`
//		some-element:${unsafeCSS(getFocusPseudoClass())} { ... }
//	`
getFocusPseudoClass()

// gets the last focusable descendant given a node, including those within the shadow DOM
getLastFocusableDescendant(node, includeHidden)

// gets the previous focusable node on the page given a node
getPreviousFocusable(node, includeHidden)

// gets the next focusable node on the page given a node
getNextFocusable(node, includeHidden)

// gets the nearest focusable ancestor of the given node
getPreviousFocusableAncestor(node, includeHidden, includeTabbablesOnly)

// returns true/false whether the element is focusable
isFocusable(node, includeHidden, includeTabbablesOnly, includeDisabled)

// returns true/false whether the :focus-visible is supported
isFocusVisibleSupported()
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

## offsetParent-legacy

A ponyfill for [offsetParent](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent) for "legacy" `offsetParent` behaviour, which will include any ancestor shadow DOMs when searching for the closest positioned ancestor. The native browser behaviour was changed in 2022 to not leak nodes within a shadow tree.

To use the ponyfill, import `getLegacyOffsetParent` (and/or `getLegacyOffsetTop`, `getLegacyOffsetLeft`):

```js
import { getLegacyOffsetParent } from '@brightspace-ui/core/helpers/offsetParent-legacy.js';

// Replace `element.offsetParent` with:
const offsetParent = getLegacyOffsetParent(element);
```

## Plugins

Plugin helpers provide a way for modules to implement and register objects that can be plugged into other project's modules without requiring the plugin consumer to import those modules or objects directly. A higher order module (ex. in BSI) is responsible for importing the plugin registrations.

The plugin implementor uses the `registerPlugin` helper method to make its implementation available to interested consumers. The implementor provides a key for the set of plugins in which to register and the plugin implementation.

Optionally, an object to specify a `key` for the plugin and/or the `sort` value may be provided. The `key` is useful if consumers intend to request a specific plugin, while the `sort` is useful in cases where the order of plugins is important to consumers. If `sort` is not specified for at least one plugin, they will be provided to consumers in registration order.

**Important!** plugin registrations should defer loading their dependencies using dynamic imports. They should **not** be synchronously imported in the registration module.

```js
import { registerPlugin } from '@brightspace-ui/core/helpers/plugins.js';

// Provide plugin set key, plugin
registerPlugin('foo-plugins', { prop1: 'some value' });
registerPlugin('foo-plugins', { prop1: 'other value' });

// Optionally provide key and/or sort value
registerPlugin('foo-plugins', { prop1: 'some value' }, { key: 'key-1', sort: 1 });
registerPlugin('foo-plugins', { prop1: 'other value' }, { key: 'key-2', sort: 2 });

// Defer loading dependencies until needed
registerPlugin('foo-plugins', { getRenderer: async () => {
    return (await import('./some-module.js')).renderer
}});
```

The plugin consumer uses the `getPlugins` helper method to get references to the registered plugins by providing a key for the set of plugins. If the consumer knows the key of the plugin it needs, it can request the plugin by using `tryGetPluginByKey` and specifying the plugin set key and plugin key.

```js
import { getPlugins, tryGetPluginByKey } from '@brightspace-ui/core/helpers/plugins.js';

// Call getPlugins to get plugins
const plugins = getPlugins('foo-plugins');

// Call tryGetPluginByKey to get a specific plugin by key
const plugin = tryGetPluginByKey('foo-plugins', 'key-1');
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

## Viewport Size

Background: the `vh` (viewport height) and `vw` (viewport width) CSS units will often reflect a mobile device's full screen size, instead of the browser window size. Device chrome (like the browser URL bar or device-specific toolbars) takes up space within that viewport, which often causes elements sized using `vh` or `vw` to be sized or positioned incorrectly.

This helper provides CSS custom properties `--d2l-vh` and `--d2l-vw` for use in place of `vh` and `vw` units. They will equal `1%` of the value of `window.innerHeight` and `window.innerWidth` respectively.

Including the helper will set up the variables and add an event listener to update them when the browser resizes:

```javascript
import '@brightspace-ui/core/helpers/viewport-size.js';
```

```css
.full-screen-elem {
    min-height: calc(var(--d2l-vh, 1vh) * 100);
    min-width: calc(var(--d2l-vw, 1vw) * 100);
}
```

## Visual Ready

A helper for determining that the page is visually "ready" (i.e., necessary pieces are loaded) and calculations can be done. Currently it handles waiting for fonts to be ready, but going forward it can have other pieces added as needed. This is useful in places like the tooltip, where the fonts being loaded has an impact on the tooltip position calculation.

Example usage within a component:
```javascript
import { visualReady } from '../../helpers/visualReady.js';

async getUpdateComplete() {
    await super.getUpdateComplete();
    await visualReady;
}
```

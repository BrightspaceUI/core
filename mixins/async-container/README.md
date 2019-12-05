# AsyncContainerMixin

The `AsyncContainerMixin` provides an `asyncState` property that reflects the collective state of async descendants. It may be used in instances where a component containing async children needs to respond to collective state changes. For instance, displaying a spinner while async children are pending, or resizing/changing layout once async children have rendered.

The mixin is initially in the `initial` state, and changes to the `pending` state when it receives one or more promise-carrying `pending-state` events. Once all pending promises are resolved, the mixin state changes to `complete`. Once in the complete state, the mixin does not return to the initial or pending states unless `resetAsyncState` is called.

## Usage

Apply the mixin and use the `asyncState` property as necessary. The `render` method will be called automatically when `asyncState` changes. Optionally, the `asyncPendingDelay` property may be configured to delay the transition to the pending state.

```js
import { AsyncContainerMixin, asyncStates } from '@brightspace-ui/core/mixins/async-container-mixin.js';
class MyComponent extends AsyncContainerMixin(LitElement) {

  constructor() {
    super();
    this.asyncPendingDelay = 100;
  }

  render() {
    if (this.asyncState === asyncStates.complete) {
      return html`<slot></slot>`;
    } else if (this.asyncState === asyncStates.pending) {
      return html`<d2l-loading-spinner></d2l-loading-spinner>`;
    } else {
      return html`Initial...`;
    }
  }

}
```

Async children may dispatch the promise-carrying `pending-state` event through a variety of methods, for example by calling `dispatchEvent` directly.

```js
this.dispatchEvent(new CustomEvent('pending-state', {
  composed: true,
  bubbles: true,
  detail: { promise: pendingPromise }
}));
```

**Properties:**

- `asyncState` (read-only, `asyncStates`): The current collective state (`initial`, `pending`, `complete`)
- `asyncPendingDelay` (Number): The delay (in ms) before transitioning to the `pending` state

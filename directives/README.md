# Directives

## duplicateOffscreen

Duplicates a content node and renders it off-screen. The duplicated node will be marked with
the attribute `data-duplicate` and invisible to screen readers.

```js
import { duplicateOffscreen } from '@brightspace-ui/core/directives/duplicate-offscreen.js';

class SomeComponent extends LitElement {
  render() {
    const someNode = html`<div>A node with stuff in it</div>`;

    return html`${duplicateOffscreen(someNode)}`;
  }
}
```

### Parameters

- `value` The content node to duplicate.

## runAsync

Runs an async function whenever the key changes, and calls one of several
`lit-html` template functions depending on the state of the async call:

- `success()` is called when the result of the function resolves.
- `pending()` is called immediately
- `initial()` is called if the function rejects with a InitialStateError, which lets the function indicate that it couldn't proceed with the provided key. This is usually the case when there isn't data to load.
- `failure()` is called if the function rejects.

### Parameters

- `key` A parameter passed to the task function. The task function is only called when they key changes.
- `task` An async function to run when the key changes
- `templates` The templates to render for each state of the task
- `options` The directive options, for example whether to dispatch pending-state

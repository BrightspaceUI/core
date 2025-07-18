# LoadingCompleteMixin

The `LoadingCompleteMixin` contains boilerplate code for [`getLoadingComplete`](https://github.com/BrightspaceUI/testing#waiting-for-asynchronous-components). It simplifies fixture setup for custom components in automated tests, and provides a `loadingComplete` promise that can be used internally.

## Usage
Apply the mixin and call `resolveLoadingComplete()` once your component has finished loading

```js
import { LoadingCompleteMixin } from '@brightspace-ui/core/mixins/loading-complete/loading-complete-mixin.js';

class MyComponent extends LoadingCompleteMixin(LitElement) {

	connectedCallback() {
		this._fetchMyData().then(this.resolveLoadingComplete);
	}

}
```

To make use of the `loadingComplete` promise, simply `await` it where needed:

```js
async removeSkeleton() {
	await this.loadingComplete;
	this.skeleton = false;
}
```

If for any reason `resolveLoadingComplete` is never called, `loadingComplete` won't resolve and any consumers will hang. A warning will be thrown indicating that the component has entered a bad state.

### `getLoadingComplete`

In some cases, instead of finding one spot to call `resolveLoadingComplete`, you may find it easier to `await` a set of promises in a custom `getLoadingComplete` method.

You'll also need to use this method if you're working in a general-use mixin rather than directly in a component.

```js
class MyComponent extends LoadingCompleteMixin(LitElement) {

	async getLoadingComplete() {
		await super.getLoadingComplete();
		await this._myCustomIconImport;
		await Promise.all(this._allMyDataPromises);
	}
}
```
Note that the work to generate these promises should have already started, before `firstUpdated`, and we simply `await` them here.

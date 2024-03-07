# LoadingCompleteMixin

The `LoadingCompleteMixin` contains boilerplate code for [`getLoadingComplete`](https://github.com/BrightspaceUI/testing#waiting-for-asynchronous-components). It simplifies fixture setup for custom components in automated tests.

## Usage
Apply the mixin and call `resolveLoadingComplete()` once your component has finished loading to indicate it is ready for validation.

```js
import { LoadingCompleteMixin } from '@brightspace-ui/core/mixins/loading-complete/loading-complete-mixin.js';

class MyComponent extends LoadingCompleteMixin(LitElement) {

	connectedCallback() {
		this._fetchMyData().then(() => {
			this.resolveLoadingComplete();
		});
	}

}
```

If for whatever reason `resolveLoadingComplete` is never called, the `getLoadingComplete` promise will never resolve. In such cases any consumers (e.g. fixtures) will hang. If this behavior is not desired, ensure all code paths eventually call `resolveLoadingComplete`, or specify `{ awaitLoadingComplete: false }` in the `fixture` call.

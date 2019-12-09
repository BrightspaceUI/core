# ProviderMixin

The `ProviderMixin` and `RequesterMixin` can be used to create a DI-like system within your app. Components can register themselves as providers of data (`ProviderMixin`), as well as request a provider of data via a key (`RequesterMixin`). Some more detail about this approach is provided in [this YouTube video](https://youtu.be/x9YDQUJx2uw?t=2104) from Google Developer Group's DevFest Nantes 2019.

## Usage

Apply the `ProviderMixin` to the component that will be responsible for providing some data to components that request it:

```js
import { ProviderMixin } from '@brightspace-ui/core/mixins/provider-mixin.js';

class InterestingFactProvider extends ProviderMixin(LitElement) {
	constructor() {
		super();

		this.provide('d2l-interesting-fact', 'Olives are not the same as fish');
	}
}
```

Once this has been set up, child components can request your provider's data via the `RequesterMixin` mixin, using the same key as the provider. Since the event that is generated to request a provider is bubbled until it is fulfilled, this means there can be an arbitrary number of components in the hierarchy between the provider and the requester, none of which have any knowledge of the data being requested or provided.

```js
import { RequesterMixin } from '@brightspace-ui/core/mixins/provider-mixin.js'

class InterestingFactUI extends RequesterMixin(LitElement) {
	static get properties() {
		return {
			_interestingFact: { type: String }
		};
	}

	constructor() {
		super();

		this._interestingFact = this.requestInstance('d2l-interesting-fact');
	}

	render() {
		return html`
			<p>Interesting fact from Interesting Fact Provider: ${this._interestingFact}</p>
		`;
	}
}
```

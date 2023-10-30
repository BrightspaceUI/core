# ProviderMixin

The `ProviderMixin` and `RequesterMixin` can be used to create a DI-like system within your app. Components can register themselves as providers of data (`ProviderMixin`), as well as request a provider of data via a key (`RequesterMixin`). Some more detail about this approach is provided in [this YouTube video](https://youtu.be/x9YDQUJx2uw?t=2104) from Google Developer Group's DevFest Nantes 2019.

## Usage

Apply the `ProviderMixin` to the component that will be responsible for providing some data to components that request it. Optionally, the `ProviderDelegate` class can be used to specify a function that will provide a cached value when requested. If `noCache: true` is passed, the value will not be cached.

```js
import { ProviderMixin, ProviderDelegate } from '@brightspace-ui/core/mixins/provider/provider-mixin.js';

class InterestingFactProvider extends ProviderMixin(LitElement) {
	constructor() {
		super();
		this.provideInstance('d2l-interesting-fact-string', 'Olives are not the same as fish');
		this.provideInstance('d2l-interesting-fact-object', { fact: 'Olives are not the same as fish' });
		this.provideInstance('d2l-interesting-fact-function', x => `${x} are not the same as fish`);
		this.provideInstance('d2l-interesting-fact-delegate', new ProviderDelegate(() => 'Olives are not the same as fish'));
		this.provideInstance('d2l-interesting-fact-delegate', new ProviderDelegate(() => 'Olives are not the same as fish', noCache));
		this.provideInstance('d2l-interesting-fact-async-delegate', new ProviderDelegate(() => new Promise(...)));
	}
}
```

Once this has been set up, child components can request your provider's data via the `RequesterMixin` mixin, using the same key as the provider. Since the event that is generated to request a provider is bubbled until it is fulfilled, this means there can be an arbitrary number of components in the hierarchy between the provider and the requester, none of which have any knowledge of the data being requested or provided.

NB: due to its reliance on DOM events, `requestInstance()` needs to be called after the element has been attached to the DOM, such as in `connectedCallback()`.

```js
import { RequesterMixin } from '@brightspace-ui/core/mixins/provider/provider-mixin.js'

class InterestingFactUI extends RequesterMixin(LitElement) {
	static get properties() {
		return {
			_factString: { type: String },
			_factObjectString: { type: String },
			_factFunctionString: { type: String }
		};
	}

	render() {
		return html`
			<p>Interesting fact from Interesting Fact Provider: ${this._factString}</p>
			<p>Interesting fact from Interesting Fact Provider: ${this._factObjectString}</p>
			<p>Interesting fact from Interesting Fact Provider: ${this._factFunctionString}</p>
		`;
	}

	connectedCallback() {
		super.connectedCallback();
		this._factString = this.requestInstance('d2l-interesting-fact-string');
		this._factObjectString = this.requestInstance('d2l-interesting-fact-object').fact;
		this._factFunctionString = this.requestInstance('d2l-interesting-fact-function')('Olives');
	}
}
```

In the absence of a component context, the `requestInstance` helper may be used by providing the `node` context and the `key` for the instance.

```js
import { requestInstance } from '@brightspace-ui/core/mixins/provider/provider-mixin.js'

const factString = requestInstance(node, 'd2l-interesting-fact-string');
const factObjectString = requestInstance(node, 'd2l-interesting-fact-object').fact;
const factFunctionString = requestInstance(node, 'd2l-interesting-fact-function')('Olives');
```

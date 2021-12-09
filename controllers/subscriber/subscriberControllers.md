# Subscriber Controllers

The `SubscriberRegistryController` and the corresponding `*SubscriberController`s can be used to create a subscription system within your app. Components can setup a subscriber registry instance to keep track of all components subscribed to them with the `SubscriberRegistryController`. Whenever it makes sense to do so, they can iterate over their subscribers to perform some action, update them with new data, etc.  Components can subscribe themselves to different registries using the `IdSubscriberController` or the `EventSubscriberController`. This system supports a many-to-many relationship - registry components can contain multiple registry instances with multiple subscribers in each, and subscriber components can subscribe to multiple different registries.

## Usage

Create an instance of the `SubscriberRegistryController` in the component that will be responsible for providing some data or performing some function on all its subscribers:

```js
import { SubscriberRegistryController } from '@brightspace-ui/core/controllers/subscriber/subscriberControllers.js';

class InterestingFactSubscription extends LitElement {
	constructor() {
		super();
		this._catFactSubscribers = new SubscriberRegistryController(this,
			{ onSubscribe: this._sendCatsAreBestWelcome.bind(this), updateSubscribers: this._sendCatFact.bind(this) },
			{ eventName: 'd2l-interesting-fact-subscribe-cat' }
		);

		this._dogFactSubscribers = new SubscriberRegistryController(this, {},
			{ updateSubscribers: this._sendDogFact.bind(this) },
			{ eventName: 'd2l-interesting-fact-subscribe-dog' }
		);

		// This controller only supports registering by id - no event is needed
		this._generalFactSubscribers = new SubscriberRegistryController(this,
			{ updateSubscribers: this._sendGeneralFact.bind(this) }, {});
	}

	getController(controllerId) {
	 	if (controllerId === 'cat') {
			return this._catFactSubscribers;
		} else if (controllerId === 'dog') {
			return this._selectablesController;
		} else if (controllerId === 'general') {
			return this._generalFactSubscribers;
		}
	}

	_sendCatFact(subscribers) {
		subscribers.forEach(subscriber => subscriber.catFact = 'A house cat is genetically 95.6% tiger.');
	}

	_sendGeneralFact(subscribers) {
		subscribers.forEach(subscriber => subscriber.setFact('Like fingerprints, everyone\'s tongue print is different.'));
	}

	...
 }
```

When creating the controller, you can pass in callbacks to run whenever a subscriber is added, removed, or `updateSubscribers` is called (which handles request debouncing for you).

The `*subscriberController`s will use a `getController` method that needs to be exposed on the registry component. If you only have one `SubscriberRegistryController` you can simple return that.  If you have multiple, you will return the proper controller depending on the id the subscriber component passed to you.

Once this has been set up, components can subscribe to particular registries two different ways:
1. Using a matching event name with `EventSubscriberController`. The component will need to be a child of the registry component for this to work.
2. By pointing to the registry component's id with `IdSubscriberController`. The component will need to be in the same DOM scope as the registry component for this to work.

Like the `SubscriberRegistryController`, these `*subscriberController`s take optional callbacks to throw at different points in the subscription process.

```js
import { EventSubscriberController, ForPropertySubscriberController } from '@brightspace-ui/core/controllers/subscriber/subscriberControllers.js';

class AnimalFactsUI extends LitElement {
	static get properties() {
		return {
			catFact: { type: String },
			dogFact: { type: String }
		};
	}

	constructor() {
		super();
		this._catSubscriberController = new EventSubscriberController(this,
			{ onSubscribe: this._catsRejoice.bind(this) }
			{ eventName: 'd2l-interesting-fact-subscribe-cat', controllerId: 'cat' }
		);

		this._dogSubscriberController = new EventSubscriberController(this, {},
			{ eventName: 'd2l-interesting-fact-subscribe-dog', controllerId: 'dog' }
		);
	}

	render() {
		return html`
			<p>Cat Fact: ${this.catFact}</p>
			<p>Dog Fact: ${this.dogFact}</p>
		`;
	}

	...
}

class GeneralFactsUI extends LitElement {
	static get properties() {
		return {
			for: { type: String },
			_fact: { type: String }
		};
	}

	constructor() {
		super();
		this._generalSubscriberController = new IdSubscriberController(this,
			{ onError: this._onError.bind(this) },
			{ idPropertyName: 'for', controllerId: 'general' }
		);
	}

	render() {
		return html`
			<p>Did you know? ${this._fact}</p>
		`;
	}

	setFact(fact) {
		this._fact = fact;
	}

	_onError() {
		throw new Error('We need facts!');
	}

	...
}
```

An example of what this could look like altogether:
```html
<interesting-fact-subscription id="facts">
	<animal-facts-ui></animal-facts-ui>
</interesting-fact-subscription>
<general-facts-ui for="facts"></general-facts-ui>
```

NOTE: Until we are on Lit 2, the controller lifecycle events will need to be manually called:
```js
	connectedCallback() {
		super.connectedCallback();
		if (this._subscriptionController) this._subscriptionController.hostConnected();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._subscriptionController) this._subscriptionController.hostDisconnected();
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (this._subscriptionController) this._subscriptionController.hostUpdated(changedProperties);
	}
```

## Available Callbacks

### SubscriberRegistryController
| Callback Name | Description | Passed to Callback |
|---|---|---|
| `onSubscribe` | Runs whenever a new subscriber is added | Subscriber that was just subscribed | 
| `onUnsubscribe` | Runs whenever a subscriber is removed | Subscriber that was just unsubscribed |
| `updateSubscribers` | Runs whenever `updateSubscribers` is called on the controller, handles debouncing requests for you | Map of all current subscribers |

### EventSubscriberController
| Callback Name | Description | Passed to Callback |
|---|---|---|
| `onSubscribe` | Runs when successfully subscribed to a registry component | Registry that was just subscribed to |
| `onError` | Runs if the event was unacknowledged and no registry component was found | None |

### IdSubscriberController
| Callback Name | Description | Passed to Callback |
|---|---|---|
| `onSubscribe` | Runs whenever a registry component is successfully subscribed to | Registry that was just subscribed to |
| `onUnsubscribe` | Runs whenever we unsubscribe to a registry (because it is now gone, or its id was removed from the id property list) | Id of the registry that was just unsubscribed to |
| `onError` | Runs if no registry component was found for an id | Id of the registry we do not have a component for |

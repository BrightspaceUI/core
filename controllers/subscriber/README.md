# Subscriber Controllers

The `SubscriberRegistryController` and the corresponding `*SubscriberController`s can be used to create a subscription system within your app. Components can setup a subscriber registry instance to keep track of all components subscribed to them with the `SubscriberRegistryController`. Whenever it makes sense to do so, they can iterate over their subscribers to perform some action, update them with new data, etc.  Components can subscribe themselves to different registries using the `IdSubscriberController` or the `EventSubscriberController`. This system supports a many-to-many relationship - registry components can contain multiple registry instances with multiple subscribers in each, and subscriber components can subscribe to multiple different registries.

## Usage

Create an instance of the `SubscriberRegistryController` in the component that will be responsible for providing some data or performing some function on all its subscribers:

```js
import { SubscriberRegistryController } from '@brightspace-ui/core/controllers/subscriber/subscriberControllers.js';

class CableSubscription extends LitElement {
	constructor() {
		super();
		this._sportsSubscribers = new SubscriberRegistryController(this,
			{ onSubscribe: this._unlockSportsChannels.bind(this) },
			{ eventName: 'd2l-channels-subscribe-sports' }
		);

		this._movieSubscribers = new SubscriberRegistryController(this, {},
			{ onSubscribe: this._unlockMovieChannels.bind(this), updateSubscribers: this._sendMovieGuide.bind(this) },
			{ eventName: 'd2l-channels-subscribe-movies' }
		);

		// This controller only supports registering by id - no event is needed
		this._kidsChannelSubscribers = new SubscriberRegistryController(this,
			{ onSubscribe: this._unlockKidsChannels.bind(this) }, {});
	}

	getController(controllerId) {
		if (controllerId === 'sports') {
			return this._sportsSubscribers;
		} else if (controllerId === 'movies') {
			return this._movieSubscribers;
		} else if (controllerId === 'kids') {
			return this._kidsChannelSubscribers;
		}
	}

	_sendMovieGuide(subscribers) {
		subscribers.forEach(subscriber => subscriber.updateGuide(new MovieGuide(new Date().getMonth())));
	}

	_unlockMovieChannels(subscriber) {
		subscriber.addChannels([330, 331, 332, 333, 334, 335]);
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
import { EventSubscriberController, IdSubscriberController } from '@brightspace-ui/core/controllers/subscriber/subscriberControllers.js';

class GeneralViewer extends LitElement {
	static get properties() {
		return {
			_subscribedChannels: { type: Object }
		};
	}

	constructor() {
		super();
		this._subscribedChannels = new Set();
	
		this._sportsSubscription = new EventSubscriberController(this,
			{ onError: this._onSportsError.bind(this) }
			{ eventName: 'd2l-channels-subscribe-sports', controllerId: 'sports' }
		);

		this._movieSubscription = new EventSubscriberController(this, {},
			{ eventName: 'd2l-channels-subscribe-movies', controllerId: 'movies' }
		);
	}

	addChannels(channels) {
		channels.forEach(channel => this._subscribedChannels.add(channel));
	}

	_onSportsError() {
		throw new Error('Where are the sports?');
	}

	...
}

class YoungerViewer extends LitElement {
	static get properties() {
		return {
			for: { type: String },
			_subscribedChannels: { type: Object }
		};
	}

	constructor() {
		super();
		this._subscribedChannels = new Set();

		this._kidsSubscription = new IdSubscriberController(this,
			{ onSubscribe: this._onSubscribe.bind(this), onUnsubscribe: this._onUnsubscribe.bind(this) },
			{ idPropertyName: 'for', controllerId: 'kids' }
		);
	}

	addChannels(channels) {
		channels.forEach(channel => this._subscribedChannels.add(channel));
	}

	_onSubscribe(cableProvider) {
		console.log(`Subscribed with ${cableProvider.id} successfully.`);
	}

	_onUnsubscribe(cableProviderId) {
		console.log(`Looks like ${cableProviderId} is having an outage again.`);
	}

	...
}
```

An example of what this could look like altogether:
```html
<cable-subscription id="rogers">
	<general-viewer></general-viewer>
</cable-subscription>
<younger-viewer for="rogers"></younger-viewer>
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

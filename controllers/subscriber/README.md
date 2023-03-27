# Subscriber Controllers

The `SubscriberRegistryController` and the corresponding `*SubscriberController`s can be used to create a subscription system within your app. Components can set up a subscriber registry instance to keep track of all components subscribed to them with the `SubscriberRegistryController`. Whenever it makes sense to do so, they can iterate over their subscribers to perform some action, update them with new data, etc.  Components can subscribe themselves to different registries using the `IdSubscriberController` or the `EventSubscriberController`. This system supports a many-to-many relationship - registry components can contain multiple registry instances with multiple subscribers in each, and subscriber components can subscribe to multiple different registries.

## Usage

Create an instance of the `SubscriberRegistryController` in the component that will be responsible for providing some data or performing some function on all its subscribers:

```js
import { SubscriberRegistryController } from '@brightspace-ui/core/controllers/subscriber/subscriberControllers.js';

class CableSubscription extends LitElement {
	constructor() {
		super();

		this._sportsSubscribers = new SubscriberRegistryController(this, 'channels-sports', {
			onSubscribe: this._unlockSportsChannels.bind(this)
		});

		this._movieSubscribers = new SubscriberRegistryController(this, 'channels-movies', {
			onSubscribe: this._unlockMovieChannels.bind(this),
			updateSubscribers: this._sendMovieGuide.bind(this)
		}

		this._kidsChannelSubscribers = new SubscriberRegistryController(this, 'channels-kids', {
			onSubscribe: this._unlockKidsChannels.bind(this)
		});
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

When creating the controller, you must provide a unique name for the subscription (e.g. `'channels-sports'`). You may also pass in an optional `updateSubscribers` callback (invoked by calling `.updateSubscribers` on the controller, with built-in debouncing), and lifecycle callbacks to run whenever a subscriber is added (`onSubscribe`) or removed (`onUnsubscribe`).

Once this has been set up, components can subscribe to particular registries two different ways:
1. Using `EventSubscriberController` with the target subscription name. The component will need to be a child of the registry component for this to work.
2. Using `IdSubscriberController` with the target subscription name and the `idPropertyName` option, which will point to the registry component's id. The component will need to be in the same DOM scope as the registry component for this to work.

Like the `SubscriberRegistryController`, these `*subscriberController`s take optional callbacks invoked at different points in the subscription process.

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

		this._sportsSubscription = new EventSubscriberController(this, 'channels-sports', {
			onError: this._onSportsError.bind(this)
		}

		this._movieSubscription = new EventSubscriberController(this, 'channels-movies');
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

		this._kidsSubscription = new IdSubscriberController(this, 'channels-kids', {
			idPropertyName: 'for',
			onSubscribe: this._onSubscribe.bind(this),
			onUnsubscribe: this._onUnsubscribe.bind(this)
		});
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

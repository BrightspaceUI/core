
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

export const FilterInfoProviderMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_activeFilterValues: { type: Object, attribute: false }
		};
	}

	constructor() {
		super();
		this._activeFilterValues = new Map();
		this._subscribers = new SubscriberRegistryController(this,
			{ onSubscribe: this._onSubscribe.bind(this), updateSubscribers: this._updateSubscribers.bind(this) },
			{}
		);
	}

	connectedCallback() {
		super.connectedCallback();
		this._subscribers.hostConnected();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._subscribers.hostDisconnected();
	}

	getController() {
		return this._subscribers;
	}

	_onSubscribe(subscriber) {
		subscriber.updateActiveFilters(this.id, this._activeFilterValues);
	}

	_updateSubscribers(subscribers) {
		subscribers.forEach(subscriber => subscriber.updateActiveFilters(this.id, this._activeFilterValues));
	}

};


import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

export const FilterInfoProviderMixin = superclass => class extends superclass {

	constructor() {
		super();
		this._activeFilters = null;
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

	_getActiveFilters() {
		throw new Error('FilterInfoProviderMixin._getActiveFilters must be overridden');
	}

	_onSubscribe(subscriber) {
		if (!this._activeFilters) this._activeFilters = this._getActiveFilters();
		subscriber.updateActiveFilters(this.id, this._activeFilters);
	}

	_updateSubscribers(subscribers) {
		this._activeFilters = this._getActiveFilters();
		subscribers.forEach(subscriber => subscriber.updateActiveFilters(this.id, this._activeFilters));
	}

};

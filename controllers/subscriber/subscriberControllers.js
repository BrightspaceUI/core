import { cssEscape } from '../../helpers/dom.js';

export class SubscriberRegistryController {

	constructor(host, callbacks, options) {
		this._host = host;
		host.addController(this);
		this._callbacks = callbacks || {};
		this._eventName = options && options.eventName;
		this._subscribers = new Map();

		this._handleSubscribe = this._handleSubscribe.bind(this);
	}

	get subscribers() {
		return this._subscribers;
	}

	hostConnected() {
		if (this._eventName) this._host.addEventListener(this._eventName, this._handleSubscribe);
	}

	hostDisconnected() {
		if (this._eventName) this._host.removeEventListener(this._eventName, this._handleSubscribe);
	}

	subscribe(target) {
		if (this._subscribers.has(target)) return;
		this._subscribers.set(target, target);
		if (this._callbacks.onSubscribe) this._callbacks.onSubscribe(target);
	}

	unsubscribe(target) {
		this._subscribers.delete(target);
		if (this._callbacks.onUnsubscribe) this._callbacks.onUnsubscribe(target);
	}

	updateSubscribers() {
		if (!this._subscribers || this._subscribers.size === 0) return;
		if (!this._callbacks.updateSubscribers) return;

		// debounce the updates
		if (this._updateSubscribersRequested) return;

		this._updateSubscribersRequested = true;
		setTimeout(() => {
			this._callbacks.updateSubscribers(this._subscribers);
			this._updateSubscribersRequested = false;
		}, 0);
	}

	_handleSubscribe(e) {
		e.stopPropagation();
		e.detail.registry = this._host;
		const target = e.composedPath()[0];
		this.subscribe(target);
	}
}

export class EventSubscriberController {

	constructor(host, callbacks, options) {
		this._host = host;
		host.addController(this);
		this._callbacks = callbacks || {};
		this._eventName = options && options.eventName;
		this._controllerId = options && options.controllerId;
		this._registry = null;
	}

	get registry() {
		return this._registry;
	}

	hostConnected() {
		// delay subscription otherwise import/upgrade order can cause selection mixin to miss event
		requestAnimationFrame(() => {
			const evt = new CustomEvent(this._eventName, {
				bubbles: true,
				composed: true,
				detail: {}
			});
			this._host.dispatchEvent(evt);
			this._registry = evt.detail.registry;

			if (!this._registry) {
				if (this._callbacks.onError) this._callbacks.onError();
				return;
			}
			if (this._callbacks.onSubscribe) this._callbacks.onSubscribe(this._registry);
		});
	}

	hostDisconnected() {
		if (this._registry) this._registry.getSubscriberController(this._controllerId).unsubscribe(this._host);
	}

}

export class IdSubscriberController {

	constructor(host, callbacks, options) {
		this._host = host;
		host.addController(this);
		this._callbacks = callbacks || {};
		this._idPropertyName = options && options.idPropertyName;
		this._idPropertyValue = this._idPropertyName ? this._host[this._idPropertyName] : undefined;
		this._controllerId = options && options.controllerId;
		this._registries = new Map();
		this._timeouts = new Set();
	}

	get registries() {
		return Array.from(this._registries.values());
	}

	hostDisconnected() {
		if (this._registryObserver) this._registryObserver.disconnect();
		this._timeouts.forEach(timeoutId => clearTimeout(timeoutId));
		this._registries.forEach(registry => {
			registry.getSubscriberController(this._controllerId).unsubscribe(this._host);
		});
	}

	hostUpdated() {
		const propertyValue = this._host[this._idPropertyName];
		if (propertyValue === this._idPropertyValue) return;

		this._idPropertyValue = propertyValue;

		if (this._registryObserver) this._registryObserver.disconnect();
		this._registries.forEach(registry => {
			registry.getSubscriberController(this._controllerId).unsubscribe(this._host);
			if (this._callbacks.onUnsubscribe) this._callbacks.onUnsubscribe(registry.id);
		});
		this._registries = new Map();

		this._updateRegistries();

		this._registryObserver = new MutationObserver(() => {
			this._updateRegistries();
		});

		this._registryObserver.observe(this._host.getRootNode(), {
			childList: true,
			subtree: true
		});
	}

	_updateRegistries() {
		let registryIds = this._host[this._idPropertyName];
		if (!registryIds) return;

		registryIds = registryIds.split(' ');
		registryIds.forEach(registryId => {
			this._updateRegistry(registryId, 0);
		});
	}

	_updateRegistry(registryId, elapsedTime) {
		let registryComponent = this._host.getRootNode().querySelector(`#${cssEscape(registryId)}`);
		if (!registryComponent && this._callbacks.onError) {
			if (elapsedTime < 3000) {
				const timeoutId = setTimeout(() => {
					this._timeouts.delete(timeoutId);
					this._updateRegistry(registryId, elapsedTime + 100);
				}, 100);
				this._timeouts.add(timeoutId);
			} else {
				this._callbacks.onError(registryId);
			}
		}

		registryComponent = registryComponent || undefined;
		if (this._registries.get(registryId) === registryComponent) return;

		if (registryComponent) {
			registryComponent.getSubscriberController(this._controllerId).subscribe(this._host);
			this._registries.set(registryId, registryComponent);
			if (this._callbacks.onSubscribe) this._callbacks.onSubscribe(registryComponent);
		} else {
			this._registries.delete(registryId);
			if (this._callbacks.onUnsubscribe) this._callbacks.onUnsubscribe(registryId);
		}
	}

}

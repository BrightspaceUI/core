import { cssEscape } from '../../helpers/dom.js';

export class SubscriberRegistryController {

	constructor(host, name, options = {}) {
		if (!host || !name) throw 'must have a host and name';

		this._host = host;
		host.addController(this);
		this._name = name;
		this._options = options;
		this._eventName = `d2l-subscribe-${this._name}`;
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
		if (this._options.onSubscribe) this._options.onSubscribe(target);
	}

	unsubscribe(target) {
		this._subscribers.delete(target);
		if (this._options.onUnsubscribe) this._options.onUnsubscribe(target);
	}

	updateSubscribers() {
		if (!this._subscribers || this._subscribers.size === 0) return;
		if (!this._options.updateSubscribers) return;

		// debounce the updates
		if (this._updateSubscribersRequested) return;

		this._updateSubscribersRequested = true;
		setTimeout(() => {
			this._options.updateSubscribers(this._subscribers);
			this._updateSubscribersRequested = false;
		}, 0);
	}

	_handleSubscribe(e) {
		e.stopPropagation();
		e.detail.registry = this._host;
		e.detail.registryController = this;
		const target = e.composedPath()[0];
		this.subscribe(target);
	}
}

export class EventSubscriberController {

	constructor(host, name, options = {}) {
		if (!host || !name) throw 'must have a host and name';

		this._host = host;
		host.addController(this);
		this._name = name;
		this._options = options || {};
		this._eventName = `d2l-subscribe-${this._name}`;
		this._registry = null;
		this._registryController = null;
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
			this._registryController = evt.detail.registryController;

			if (!this._registry) {
				if (this._options.onError) this._options.onError();
				return;
			}
			if (this._options.onSubscribe) this._options.onSubscribe(this._registry);
		});
	}

	hostDisconnected() {
		if (this._registryController) this._registryController.unsubscribe(this._host);
	}

}

export class IdSubscriberController {

	constructor(host, name, options = {}) {
		if (!host || !name) throw 'must have a host and name';

		this._host = host;
		host.addController(this);
		this._name = name;
		this._options = options || {};
		this._idPropertyName = options && options.idPropertyName;
		this._idPropertyValue = this._idPropertyName ? this._host[this._idPropertyName] : undefined;
		this._registries = new Map();
		this._registryControllers = new Map();
		this._timeouts = new Set();
	}

	get registries() {
		return Array.from(this._registries.values());
	}

	hostDisconnected() {
		if (this._registryObserver) this._registryObserver.disconnect();
		this._timeouts.forEach(timeoutId => clearTimeout(timeoutId));
		this._registryControllers.forEach(controller => {
			controller.unsubscribe(this._host);
		});
	}

	hostUpdated() {
		const propertyValue = this._host[this._idPropertyName];
		if (propertyValue === this._idPropertyValue) return;

		this._idPropertyValue = propertyValue;

		if (this._registryObserver) this._registryObserver.disconnect();
		this._registryControllers.forEach((controller, key) => {
			controller.unsubscribe(this._host);
			if (this._options.onUnsubscribe) this._options.onUnsubscribe(key);
		});
		this._registries = new Map();
		this._registryControllers = new Map();

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

		registryIds = registryIds.trim().split(' ');
		registryIds.forEach(registryId => {
			this._updateRegistry(registryId, 0);
		});
	}

	_updateRegistry(registryId, elapsedTime) {
		let registryComponent = this._host.getRootNode().querySelector(`#${cssEscape(registryId)}`);
		if (!registryComponent && this._options.onError) {
			if (elapsedTime < 3000) {
				const timeoutId = setTimeout(() => {
					this._timeouts.delete(timeoutId);
					this._updateRegistry(registryId, elapsedTime + 100);
				}, 100);
				this._timeouts.add(timeoutId);
			} else {
				this._options.onError(registryId);
			}
		}

		registryComponent = registryComponent || undefined;
		if (this._registries.get(registryId) === registryComponent) return;

		if (registryComponent) {
			const evt = new CustomEvent(this._eventName, { detail: {} });
			registryComponent.dispatchEvent(evt);
			this._registries.set(registryId, evt.detail.registry);
			this._registryControllers.set(registryId, evt.detail.registryController);
			if (this._options.onSubscribe) this._options.onSubscribe(registryComponent);
		} else {
			this._registries.delete(registryId);
			this._registryControllers.delete(registryId);
			if (this._options.onUnsubscribe) this._options.onUnsubscribe(registryId);
		}
	}

}

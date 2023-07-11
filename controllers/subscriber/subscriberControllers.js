import { cssEscape } from '../../helpers/dom.js';

class BaseController {
	constructor(host, name, options = {}) {
		if (!host || !name) throw new TypeError('SubscriberController: missing host or subscription name');

		host.addController(this);
		this._host = host;
		this._name = name;
		this._options = options;
		this._eventName = `d2l-subscribe-${this._name}`;
	}
}

class BaseSubscriber extends BaseController {
	constructor() {
		super(...arguments);

		this._subscriptionComplete = Promise.resolve();
		this._timeouts = new Set();
	}

	hostDisconnected() {
		this._timeouts.forEach(timeoutId => clearTimeout(timeoutId));
	}

	_keepTrying(callback, interval, maxTime, errorPayload, elapsedTime = 0) {
		const response = callback();

		if (response) return response;
		if (elapsedTime >= maxTime) {
			if (this._options.onError) this._options.onError(errorPayload);
			return response;
		}

		return new Promise(resolve => {
			const timeoutId = setTimeout(async() => {
				this._timeouts.delete(timeoutId);
				resolve(await this._keepTrying(callback, interval, maxTime, errorPayload, elapsedTime + interval));
			}, interval);
			this._timeouts.add(timeoutId);
		});
	}

	_subscribe(target = this._host, targetLabel) {
		const isBroadcast = target === this._host;

		const options = isBroadcast ? { bubbles: true, composed: true } : {};
		const evt = new CustomEvent(this._eventName, {
			...options,
			detail: { subscriber: this._host }
		});
		target.dispatchEvent(evt);

		const { registry, registryController } = evt.detail;
		if (!registry) return false;

		if (targetLabel) {
			this._registries.set(targetLabel, registry);
			this._registryControllers.set(targetLabel, registryController);
		} else {
			this._registry = registry;
			this._registryController = registryController;
		}

		if (this._options.onSubscribe) this._options.onSubscribe(registry);
		return true;
	}
}

export class SubscriberRegistryController extends BaseController {

	constructor(host, name, options) {
		super(host, name, options);

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
		const target = e.detail.subscriber;
		this.subscribe(target);
	}
}

export class EventSubscriberController extends BaseSubscriber {

	constructor(host, name, options) {
		super(host, name, options);

		this._registry = null;
		this._registryController = null;
	}

	get registry() {
		return this._registry;
	}

	hostConnected() {
		this._subscriptionComplete = this._keepTrying(() => this._subscribe(), 40, 400);
	}

	hostDisconnected() {
		super.hostDisconnected();
		if (this._registryController) this._registryController.unsubscribe(this._host);
	}

}

export class IdSubscriberController extends BaseSubscriber {

	constructor(host, name, options) {
		super(host, name, options);

		this._idPropertyName = options && options.idPropertyName;
		this._registries = new Map();
		this._registryControllers = new Map();

		this._handlePassthrough = this._handlePassthrough.bind(this);
	}

	get registries() {
		return Array.from(this._registries.values());
	}

	hostConnected() {
		// Id controllers will catch events the same name of nested children and hook them up to the same registry(ies?)
		if (this._eventName) this._host.addEventListener(this._eventName, this._handlePassthrough);
	}

	hostDisconnected() {
		super.hostDisconnected();
		if (this._eventName) this._host.removeEventListener(this._eventName, this._handlePassthrough);

		if (this._registryObserver) this._registryObserver.disconnect();
		this._registryControllers.forEach(controller => {
			controller.unsubscribe(this._host);
		});
		this._idPropertyValue = undefined;
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

	_handlePassthrough(e) {
		if (this._registryControllers.size > 0) {
			const target = e.composedPath()[0];
			if (target === this._host) return;
			Array.from(this._registryControllers.values())[0]._handleSubscribe(e); // Just give it the first one for now - need to discuss
		}
	}

	_updateRegistries() {
		let registryIds = this._host[this._idPropertyName];
		if (!registryIds) return;

		registryIds = registryIds.trim().split(' ');
		registryIds.forEach(registryId => {
			this._keepTrying(() => this._updateRegistry(registryId), 100, 3000, registryId);
		});
	}

	_updateRegistry(registryId) {
		const registryComponent = this._host.getRootNode().querySelector(`#${cssEscape(registryId)}`) || undefined;

		if (this._registries.get(registryId) === registryComponent) return registryComponent;

		if (registryComponent) {
			const success = this._subscribe(registryComponent, registryId);
			if (!success && this._options.onError) this._options.onError(registryId);
		} else {
			this._registries.delete(registryId);
			this._registryControllers.delete(registryId);
			if (this._options.onUnsubscribe) this._options.onUnsubscribe(registryId);
		}

		return registryComponent;
	}

}

import { cssEscape } from '../../helpers/dom.js';

export class ProviderController {

	constructor(host, callbacks, options) {
		this._host = host;
		this._callbacks = callbacks || {};
		this._eventName = options && options.eventName;
		this.subscribers = new Map();

		this._handleSubscribe = this._handleSubscribe.bind(this);
	}

	hostConnected() {
		if (this._eventName) this._host.addEventListener(this._eventName, this._handleSubscribe);
	}

	hostDisconnected() {
		if (this._eventName) this._host.removeEventListener(this._eventName, this._handleSubscribe);
	}

	subscribe(target) {
		if (this.subscribers.has(target)) return;
		this.subscribers.set(target, target);
		this.updateSubscribers();
		if (this._callbacks.onSubscribe) this._callbacks.onSubscribe(target);
	}

	unsubscribe(target) {
		this.subscribers.delete(target);
		if (this._callbacks.onUnsubscribe) this._callbacks.onUnsubscribe(target);
	}

	updateSubscribers() {
		if (!this.subscribers || this.subscribers.size === 0) return;
		if (!this._callbacks.updateSubscribers) return;

		// debounce the updates
		if (this._updateSubscribersRequested) return;

		this._updateSubscribersRequested = true;
		setTimeout(() => {
			this._callbacks.updateSubscribers(this.subscribers);
			this._updateSubscribersRequested = false;
		}, 0);
	}

	_handleSubscribe(e) {
		e.stopPropagation();
		e.detail.provider = this._host;
		const target = e.composedPath()[0];
		this.subscribe(target);
	}
}

export class EventSubscriberController {

	constructor(host, callbacks, options) {
		this._host = host;
		this._callbacks = callbacks || {};
		this._eventName = options && options.eventName;
		this._controllerId = options && options.controllerId;
		this._provider = null;
	}

	get provider() {
		return this._provider;
	}

	hostConnected() {
		/* Do we try not to fire this event if someone wants to use the other provider instead based on set attributes?
		 * That's really the selection-observer-mixin's problem, not these cotnrollers, who should assume you want to use them...
		 */

		// delay subscription otherwise import/upgrade order can cause selection mixin to miss event
		requestAnimationFrame(() => {
			const evt = new CustomEvent(this._eventName, {
				bubbles: true,
				composed: true,
				detail: {}
			});
			this._host.dispatchEvent(evt);
			this._provider = evt.detail.provider;
			if (this._callbacks.onSubscribe) this._callbacks.onSubscribe(evt.detail.provider);
		});
	}

	hostDisconnected() {
		if (this._provider) this._provider.getController(this._controllerId).unsubscribe(this._host);
	}

}

export class ForPropertySubscriberController {

	constructor(host, callbacks, options) {
		this._host = host;
		this._callbacks = callbacks || {};
		this._forPropertyName = options && options.forProperty;
		this._controllerId = options && options.controllerId;
		this._providers = new Map();
	}

	get providers() {
		return Array.from(this._providers.values());
	}

	hostDisconnected() {
		if (this._forObserver) this._forObserver.disconnect();
		this._providers.forEach(provider => {
			provider.getController(this._controllerId).unsubscribe(this._host);
		});
	}

	hostUpdated(changedProperties) {
		if (!changedProperties.has(this._forPropertyName)) return;

		if (this._forObserver) this._forObserver.disconnect();
		this._providers.forEach(provider => {
			provider.getController(this._controllerId).unsubscribe(this._host);
		});
		this._providers = new Map();

		this._updateProviders();

		this._forObserver = new MutationObserver(() => {
			this._updateProviders();
		});

		this._forObserver.observe(this._host.getRootNode(), {
			childList: true,
			subtree: true
		});
	}

	_updateProvider(providerId, elapsedTime) {
		const providerComponent = this._host.getRootNode().querySelector(`#${cssEscape(providerId)}`);
		if (!providerComponent && this._callbacks.onError) {
			if (elapsedTime < 3000) {
				setTimeout(() => {
					this._updateProvider(providerId, elapsedTime + 100);
				}, 100);
			} else {
				this._callbacks.onError(providerId);
			}
		}

		if (this._providers.get(providerId) === providerComponent) return;

		if (providerComponent) {
			providerComponent.getController(this._controllerId).subscribe(this._host);
			this._providers.set(providerId, providerComponent);
			if (this._callbacks.onSubscribe) this._callbacks.onSubscribe(providerComponent);
		} else {
			this._providers.delete(providerId);
			if (this._callbacks.onUnsubscribe) this._callbacks.onUnsubscribe(providerComponent);
		}
	}

	_updateProviders() {
		let providerIds = this._host[this._forPropertyName];
		if (!providerIds) {
			// callback for no provider ids?
			return;
		}

		if (typeof(providerIds) === 'string') providerIds = [providerIds];

		providerIds.forEach(providerId => {
			this._updateProvider(providerId, 0);
		});
	}

}

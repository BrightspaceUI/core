export class ProviderDelegate {
	constructor(delegate, noCache) {
		this._noCache = noCache;
		this._delegate = delegate;
	}
	getValue() {
		if (this._noCache || this._value === undefined) {
			this._value = this._delegate();
		}
		return this._value;
	}
}

export function provideInstance(node, key, obj) {
	if (!node._providerInstances) {
		node._providerInstances = new Map();
		node.addEventListener('d2l-request-instance', e => {
			if (node._providerInstances.has(e.detail.key)) {
				const instance = node._providerInstances.get(e.detail.key);
				if (instance instanceof ProviderDelegate) {
					e.detail.instance = instance.getValue();
				} else {
					e.detail.instance = instance;
				}
				e.stopPropagation();
			}
		});
	}
	node._providerInstances.set(key, obj);
}

/**
 * @template {CustomElementConstructor} S
 * @param {S} superclass
 */
export const ProviderMixin = superclass => class extends superclass {
	provideInstance(key, obj) {
		provideInstance(this, key, obj);
	}
};

export function requestInstance(node, key) {
	const event = new CustomEvent('d2l-request-instance', {
		detail: { key },
		bubbles: true,
		composed: true,
		cancelable: true
	});
	node.dispatchEvent(event);
	return event.detail.instance;
}

/**
 * @template {CustomElementConstructor} S
 * @param {S} superclass
 */
export const RequesterMixin = superclass => class extends superclass {
	requestInstance(key) {
		return requestInstance(this, key);
	}
};

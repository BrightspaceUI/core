export const ProviderMixin = superclass => class extends superclass {
	constructor() {
		super();
		this._instances = new Map();
		this.addEventListener('d2l-request-instance', e => {
			if (this._instances.has(e.detail.key)) {
				e.detail.instance = this._instances.get(e.detail.key);
				e.stopPropagation();
			}
		});
	}

	provideInstance(key, obj) {
		this._instances.set(key, obj);
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

export const RequesterMixin = superclass => class extends superclass {
	requestInstance(key) {
		return requestInstance(this, key);
	}
};

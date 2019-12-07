export const ProviderMixin = superclass => class extends superclass {

	constructor() {
		super();
		this._providers = new Map();
		this.addEventListener('d2l-request-provider', this._handleRequest);
	}

	_handleRequest(e) {
		if (this._providers.has(e.detail.key)) {
			e.detail.provider = this._providers.get(e.detail.key);
			e.stopPropagation();
		}
	}

	provide(key, factory) {
		this._providers.set(key, factory);
	}

	delete(key) {
		this._providers.delete(key);
	}
};

export const RequestProviderMixin = superclass => class extends superclass {

	requestProvider(key) {
		const event = new CustomEvent('d2l-request-provider', {
			detail: { key },
			bubbles: true,
			composed: true,
			cancelable: true
		});

		this.dispatchEvent(event);
		return event.detail.provider;
	}
};

const controllerCallbacks = new Map();

const contextObserver = new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		controllerCallbacks.forEach(callback => callback(mutation.attributeName));
	});
});

export class HtmlAttributeObserverController {

	constructor(host, attribute) {
		this._host = host;
		this._attribute = attribute;

		this.value = undefined;
	}

	hostConnected() {
		this.value = document.documentElement.hasAttribute(this._attribute)
			? document.documentElement.getAttribute(this._attribute)
			: undefined;
		if (controllerCallbacks.size === 0) contextObserver.observe(document.documentElement, { attributes: true });
		controllerCallbacks.set(this, this._handleContextChange.bind(this));
	}

	hostDisconnected() {
		controllerCallbacks.delete(this);
	}

	_handleContextChange(attributeName) {
		if (attributeName !== this._attribute) return;
		this.value = document.documentElement.hasAttribute(this._attribute)
			? document.documentElement.getAttribute(this._attribute)
			: undefined;
		this._host.requestUpdate();
	}

}

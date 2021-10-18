const controllerCallbacks = [];

const contextObserver = new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		controllerCallbacks.forEach(callback => callback(mutation.attributeName));
	});
});

export class HtmlAttributeController {

	constructor(host, attribute) {
		this._host = host;
		this._attribute = attribute;
	}

	hostConnected() {
		this.value = document.documentElement.getAttribute(this._attribute);
		controllerCallbacks.push(this._handleContextChange.bind(this));
		if (controllerCallbacks.length === 0) contextObserver.observe(document.documentElement, { attributes: true });
	}

	hostDisconnected() {
		const controllerIndex = controllerCallbacks.indexOf(this);
		if (controllerIndex > -1) controllerCallbacks.splice(controllerIndex, 1);
	}

	_handleContextChange(attributeName) {
		if (attributeName !== this._attribute) return;
		this.value = document.documentElement.getAttribute(this._attribute);
		this._host.requestUpdate();
	}

}

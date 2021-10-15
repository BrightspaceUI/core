let controllerCallbacks = [];

const contextObserver = new MutationObserver(mutations => {
	let contextUpdated = false;
	
	mutations.forEach(mutation => {
		controllerCallbacks.forEach(callback => {
			const success = callback(mutation.attributeName);
			if (success) contextUpdated = true;
		});
	});

	if (contextUpdated) {
		controllerCallbacks = [];
		contextObserver.disconnect();
	}
});

export class HtmlAttributeContextController {

	constructor(host, contextAttribute) {
		this._host = host;
		this._contextAttribute = contextAttribute;

		this.value = {};
	}

	hostConnected() {
		if (document.documentElement.getAttribute(this._contextAttribute)) {
			this._handleContextChange();
			return;
		}
		if (controllerCallbacks.length === 0) contextObserver.observe(document.documentElement, { attributes: true });
		controllerCallbacks.push(this._handleContextChange.bind(this));
	}

	hostDisconnected() {
		const controllerIndex = controllerCallbacks.indexOf(this);
		if (controllerIndex > -1) controllerCallbacks.splice(controllerIndex, 1);
	}

	_handleContextChange(attributeName) {
		if (attributeName !== this._contextAttribute) return false;
		this.value = JSON.parse(document.documentElement.getAttribute(this._contextAttribute)) || {};
		this._host.requestUpdate();
		return true;
	}

}

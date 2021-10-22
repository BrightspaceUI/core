const controllerCallbacks = new Map();

const contextObserver = new MutationObserver(mutations => {
	controllerCallbacks.forEach(callback => callback(
		mutations.map(mutation => mutation.attributeName)
	));
});

export class HtmlAttributeObserverController {

	constructor(host, ...attributes) {
		if (attributes.length === 0) throw new Error(
			`Can't construct controller; must supply at least one observed attribute.`
		);

		this._host = host;
		this._attributes = attributes;
		this.values = new Map();
	}

	hostConnected() {
		this._setAttributes(this._attributes);
		if (controllerCallbacks.size === 0) contextObserver.observe(document.documentElement, { attributes: true });
		controllerCallbacks.set(this, this._handleContextChange.bind(this));
	}

	hostDisconnected() {
		controllerCallbacks.delete(this);
	}

	_handleContextChange(attributeNames) {
		const attributes = attributeNames.filter(attr => this._attributes.includes(attr));
		if (attributes.length === 0) return;
		this._setAttributes(attributes);
		this._host.requestUpdate();
	}

	_setAttributes(attributes) {
		attributes.forEach(attribute => {
			this.values.set(
				attribute,
				document.documentElement.hasAttribute(attribute)
					? document.documentElement.getAttribute(attribute)
					: undefined
			);
		});
	}

}


export const ValidationCustomMixin = superclass => class extends superclass {

	static get properties() {
		return {
			failureText: { type: String, attribute: 'failure-text' },
			for: { type: String }
		};
	}

	constructor() {
		super();
		this._target = null;
	}

	connectedCallback() {
		super.connectedCallback();
		this._updateTarget();
		const connected = new CustomEvent('d2l-validation-custom-connected', { bubbles: true, composed: true });
		this.dispatchEvent(connected);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._target = null;
		const disconnected = new CustomEvent('d2l-validation-custom-disconnected', { bubbles: true, composed: true });
		this.dispatchEvent(disconnected);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'for') {
				this._updateTarget();
			}
		});
	}

	get target() {
		return this._target;
	}

	async validate() {}

	_updateTarget() {
		const root = this.getRootNode();
		this._target = root.getElementById(this.for);
	}

};

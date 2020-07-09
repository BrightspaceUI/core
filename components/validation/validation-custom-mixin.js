import { isCustomFormElement } from '../form/form-helper.js';

export const ValidationCustomMixin = superclass => class extends superclass {

	static get properties() {
		return {
			failureText: { type: String, attribute: 'failure-text' },
			for: { type: String }
		};
	}

	constructor() {
		super();
		this._forElement = null;
	}

	connectedCallback() {
		super.connectedCallback();
		this._updateForElement();
		const connected = new CustomEvent('d2l-validation-custom-connected', { bubbles: true, composed: true });
		this.dispatchEvent(connected);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (isCustomFormElement(this._forElement)) {
			this._forElement.validationCustomDisconnected(this);
		}
		this._forElement = null;
		const disconnected = new CustomEvent('d2l-validation-custom-disconnected', { bubbles: true, composed: true });
		this.dispatchEvent(disconnected);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'for') {
				this._updateForElement();
			}
		});
	}

	get forElement() {
		return this._forElement;
	}

	async validate() {
		throw new Error('ValidationCustomMixin requires validate to be overridden');
	}

	_updateForElement() {
		const oldForElement = this._forElement;
		if (this.for) {
			const root = this.getRootNode();
			this._forElement = root.getElementById(this.for);
			if (!this._forElement) {
				throw new Error(`validation-custom failed to find element with id ${this.for}`);
			}
		} else {
			this._forElement = null;
		}
		if (this._forElement !== oldForElement) {
			if (isCustomFormElement(oldForElement)) {
				oldForElement.validationCustomDisconnected(this);
			}
			if (isCustomFormElement(this._forElement)) {
				this._forElement.validationCustomConnected(this);
			}
		}
	}

};

import { isCustomFormElement } from '../form/form-helpers.js';
import { LitElement } from 'lit-element/lit-element.js';

class ValidationCustom extends LitElement {

	static get properties() {
		return {
			failureText: { type: String, attribute: 'failure-text' },
			for: { type: String }
		};
	}

	constructor() {
		super();
		this._source = null;
	}

	connectedCallback() {
		super.connectedCallback();
		const connected = new CustomEvent('d2l-validation-custom-connected', { bubbles: true, composed: true });
		this.dispatchEvent(connected);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		const disconnected = new CustomEvent('d2l-validation-custom-disconnected', { bubbles: true, composed: true });
		this.dispatchEvent(disconnected);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'for') {
				const root = this.getRootNode();
				const oldSource = this._source;
				this._source = root.getElementById(this.for);
				if (this._source !== oldSource) {
					if (isCustomFormElement(oldSource)) {
						oldSource.validationCustomDisconnected(this);
					}
					if (isCustomFormElement(this._source)) {
						this._source.validationCustomConnected(this);
					}
				}
			}
		});
	}

	get source() {
		return this._source;
	}

	async validate() {
		const validation = new Promise(resolve => {
			const details = { bubbles: true, detail: { source: this._source, resolve } };
			const event = new CustomEvent('d2l-validation-custom-validate', details);
			return this.dispatchEvent(event);
		});
		return validation;
	}

}
customElements.define('d2l-validation-custom', ValidationCustom);

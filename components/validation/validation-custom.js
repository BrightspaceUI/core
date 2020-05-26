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

	async validate() {
		const validation = new Promise(resolve => {
			const details = { bubbles: true, detail: { source: this._source, resolve } };
			const event = new CustomEvent('d2l-validation-custom-validate', details);
			return this.dispatchEvent(event);
		});
		return validation;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'for') {
				const root = this.getRootNode();
				this._source = root.getElementById(this.for);
			}
		});
	}

	get source() {
		return this._source;
	}
}
customElements.define('d2l-validation-custom', ValidationCustom);

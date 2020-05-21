import { LitElement } from 'lit-element/lit-element.js';

class ValidationCustom extends LitElement {

	static get properties() {
		return {
			failureText: { type: String, attribute: 'failure-text' }
		};
	}

	async validate() {
		const validation = new Promise(resolve => {
			const details = { bubbles: true, detail: { resolve } };
			const event = new CustomEvent('d2l-validation-custom-validate', details);
			return this.dispatchEvent(event);
		});
		return validation;
	}

}
customElements.define('d2l-validation-custom', ValidationCustom);

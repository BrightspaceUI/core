import { LitElement } from 'lit-element/lit-element.js';

class ValidationCustom extends LitElement {

	static get properties() {
		return {
			failureText: { type: String, attribute: 'failure-text' }
		};
	}

	validate() {
		const event = new CustomEvent('d2l-validation-custom-validate', { bubbles: true, cancelable: true });
		return this.dispatchEvent(event);
	}

}
customElements.define('d2l-validation-custom', ValidationCustom);

import { html, LitElement } from 'lit-element/lit-element.js';
import { ValidationGroupBehavior } from './validation-group-behavior.js';

class ValidationGroup extends LitElement {

	constructor() {
		super();
		this._behavior = new ValidationGroupBehavior();
	}

	connectedCallback() {
		super.connectedCallback();
		this._behavior.install(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._behavior.uninstall();
	}

	render() {
		return html`<slot></slot>`;
	}

	checkValidity() {
		return this._behavior.checkValidity();
	}

	reportValidity() {
		return this._behavior.reportValidity();
	}

}
customElements.define('d2l-validation-group', ValidationGroup);

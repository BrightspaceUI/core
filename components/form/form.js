import { css, html, LitElement } from 'lit-element/lit-element.js';
import { FormBehavior } from './form-behavior.js';

class Form extends LitElement {

	static get properties() {
		return {
			method: { type: String },
			location: { type: String }
		};
	}
	static get styles() {
		return css``;
	}

	constructor() {
		super();

		this._formBehavior = new FormBehavior();
	}

	connectedCallback() {
		super.connectedCallback();
		this._formBehavior.install(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._formBehavior.uninstall(this);
	}

	render() {
		return html`<slot></slot>`;
	}

	submit() {
		this._formBehavior.submit();
	}

}
customElements.define('d2l-form', Form);

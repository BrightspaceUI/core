import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formInstall, formUninstall } from './form-behavior.js';

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

	connectedCallback() {
		super.connectedCallback();
		formInstall(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		formUninstall(this);
	}

	render() {
		return html`<slot></slot>`;
	}

	submit() {
		this._formBehavior.submit();
	}

}
customElements.define('d2l-form', Form);

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ValidationContainerMixin } from './validation-container-mixin';

class ValidationContainer extends ValidationContainerMixin(LitElement) {

	static get properties() {
		return { form: { type: String }};
	}

	static get styles() {
		return css``;
	}

	connectedCallback() {
		super.connectedCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	render() {
		return html`
			${this._errors ? html`<ol>${this._errors.map(e => html`<li>${e.message}</li>`)}<ol>` : null }
			<slot>
			</slot>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'form') {
				this._form = this._findForm();
			}
		});
	}

	_findForm() {
		let form;
		if (this.form) {
			const ownerRoot = this.getRootNode();
			const targetSelector = `#${this.form}`;
			form = ownerRoot.querySelector(targetSelector);
		}
		return form;
	}

	getFormElement() {
		return this._form;
	}
}
customElements.define('d2l-validation-container', ValidationContainer);

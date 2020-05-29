import { css, html, LitElement } from 'lit-element/lit-element.js';

class ValidationErrorSummary extends LitElement {

	static get properties() {
		return {
			errors: { type: Array }
		};
	}

	static get styles() {
		return css``;
	}

	constructor() {
		super();
		this.errors = [];
	}

	render() {
		return html`
			<ul>
				${this.errors.map(error => html`<li @click=${
		// eslint-disable-next-line lit/no-template-arrow
		() => this._onErrorClick(error)}><a href="#${error.id}">${error.message}</a></li>`)}
			</ul>
		`;
	}

	_onErrorClick(error) {
		const root = this.getRootNode();
		const ele = root.getElementById(error.id);
		if (ele) {
			ele.focus();
		}
	}

}
customElements.define('d2l-validation-error-summary', ValidationErrorSummary);

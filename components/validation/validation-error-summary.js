import '../link/link.js';
import { html, LitElement } from 'lit-element/lit-element.js';

class ValidationErrorSummary extends LitElement {

	static get properties() {
		return {
			errors: { type: Object }
		};
	}

	constructor() {
		super();
		this.errors = new Map();
	}

	render() {
		const errors = [...this.errors];
		return html`
			<ul>
				${errors.map(([ele, messages]) => html`
					<li>
						<d2l-link @click=${/* eslint-disable lit/no-template-arrow */() => ele.focus()}>${messages[0]}</d2l-link>
					</li>
				`)}
			</ul>
		`;
	}

}
customElements.define('d2l-validation-error-summary', ValidationErrorSummary);

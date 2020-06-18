import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class BreadCrumb extends LitElement {

	static get properties() {
		return {
			compact: {
				type: String,
				reflect: true
			},
			href: {
				type: String,
				reflect: true
			},
			target: {
				type: String,
				reflect: true
			},
			text: {
				type: String,
				reflect: true
			},
			ariaLabel: {
				attribute: 'aria-label',
				type: String,
				reflect: true
			},
		};
	}

	static get styles() {
		return css`
		`;
	}

	constructor() {
		super();
		this.href = '#';
	}

	render() {
		return html`
			${this.text}
		`;
	}

}
customElements.define('d2l-breadcrumb', BreadCrumb);

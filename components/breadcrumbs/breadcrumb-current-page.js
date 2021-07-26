import { css, html, LitElement } from 'lit-element/lit-element.js';

/**
 * An entry within a <d2l-breadcrumbs> parent representing the current page.
 */
class BreadcrumbCurrentPage extends LitElement {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			_role: { type: 'string', attribute: 'role', reflect: true },
			/**
			 * REQUIRED: The title of the current page
			 * @type {string}
			 */
			text: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		/** @ignore */
		this._role = 'listitem';
	}

	render() {
		return html`<span aria-current="page">${this.text}</span>`;
	}

}
customElements.define('d2l-breadcrumb-current-page', BreadcrumbCurrentPage);

import '../../components/colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element';

class TemplatePrimarySecondary extends LitElement {

	static get properties() {
		return {
			_hasFooter: { type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.container {
				display: grid;
				grid-template-columns: minmax(320px, 2fr) 1px minmax(320px, 1fr);
				grid-template-rows: auto 1fr auto;
				grid-template-areas:
				"header header header"
				"primary divider secondary"
				"footer footer footer";
				height: 100vh;
			}
			header {
				grid-area: header;
			}
			main {
				grid-area: primary;
				overflow-y: auto;
			}
			.d2l-template-primary-secondary-divider {
				grid-area: divider;
				background-color: var(--d2l-color-mica);
				width: 1px;
			}
			aside {
				grid-area: secondary;
				overflow-y: auto;
			}
			footer {
				grid-area: footer;
				box-shadow: 0 -2px 4px rgba(86, 90, 92, .2);
				padding: 0.75rem 1rem;
			}
		`;
	}

	render() {
		return html`
			<div class="container">
				<header><slot name="header"></slot></header>
				<main><slot name="primary"></slot></main>
				<div class="d2l-template-primary-secondary-divider"></div>
				<aside><slot name="secondary"></slot></aside>
				<footer ?hidden="${!this._hasFooter}"><slot name="footer" @slotchange="${this._handleFooterSlotChange}"></slot></footer>
			</div>
		`;
	}

	_handleFooterSlotChange(e) {
		const nodes = e.target.assignedNodes();
		this._hasFooter = (nodes.length !== 0);
	}
}

customElements.define('d2l-template-primary-secondary', TemplatePrimarySecondary);

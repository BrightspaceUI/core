import '../../components/colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element';

class TemplatePrimarySecondary extends LitElement {

	static get properties() {
		return {
			widthType: { type: String, attribute: 'width-type', reflect: true },
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
			:host([width-type="normal"]) .d2l-template-primary-secondary-content-container,
			:host([width-type="normal"]) .d2l-template-primary-secondary-footer-container {
				margin: 0 auto;
				max-width: 1230px;
				width: 100%;
			}
			.container {
				display: grid;
				grid-template-columns: auto;
				grid-template-rows: auto 1fr auto;
				grid-template-areas:
				"header"
				"content"
				"footer";
				height: 100vh;
			}
			header {
				grid-area: header;
			}
			.d2l-template-primary-secondary-content-container {
				display: grid;
				grid-template-columns: minmax(320px, 2fr) 1px minmax(320px, 1fr);
				grid-template-rows: auto;
				grid-template-areas:
				"primary divider secondary";
				grid-area: content;
				overflow: hidden;
			}
			main {
				grid-area: primary;
				overflow-y: auto;
			}
			.d2l-template-primary-secondary-divider {
				grid-area: divider;
				background-color: var(--d2l-color-mica);
			}
			aside {
				grid-area: secondary;
				overflow-y: auto;
			}
			footer {
				grid-area: footer;
				box-shadow: 0 -2px 4px rgba(73, 76, 78, .2); /* ferrite */
				padding: 0.75rem 1rem;
			}
			@media only screen and (max-width: 768px) {
				.container {
					height: 100vh;
				}
				.d2l-template-primary-secondary-content-container {
					grid-template-areas:
					"primary"
					"divider"
					"secondary";
					grid-template-columns: auto;
					grid-template-rows: auto 1px auto;
					overflow-y: auto;
				}
				main {
					grid-area: primary;
					overflow-y: visible;
				}
				aside {
					grid-area: secondary;
					overflow-y: visible;
				}
			}
		`;
	}

	constructor() {
		super();
		this.widthType = 'fullscreen';
	}

	render() {
		return html`
			<div class="container">
				<header><slot name="header"></slot></header>
				<div class="d2l-template-primary-secondary-content-container">
					<main><slot name="primary"></slot></main>
					<div class="d2l-template-primary-secondary-divider"></div>
					<aside><slot name="secondary"></slot></aside>
				</div>
				<footer ?hidden="${!this._hasFooter}">
					<div class="d2l-template-primary-secondary-footer-container"><slot name="footer" @slotchange="${this._handleFooterSlotChange}"></div></slot>
				</footer>
			</div>
		`;
	}

	_handleFooterSlotChange(e) {
		const nodes = e.target.assignedNodes();
		this._hasFooter = (nodes.length !== 0);
	}
}

customElements.define('d2l-template-primary-secondary', TemplatePrimarySecondary);

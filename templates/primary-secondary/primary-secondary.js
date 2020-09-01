import '../../components/colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element';

/**
 * A two panel (primary and secondary) page template with header and optional footer
 * @slot header - Page header content
 * @slot footer - Page footer content
 * @slot primary - Main page content
 * @slot secondary - Supplementary page content
 */
class TemplatePrimarySecondary extends LitElement {

	static get properties() {
		return {
			/**
			 * Controls how the primary panel's contents overflow
			 * @type {'default'|'hidden'}
			 */
			primaryOverflow: { attribute: 'primary-overflow', reflect: true, type: String },
			/**
			 * Whether content fills the screen or not
			 * @type {'fullscreen'|'normal'}
			 */
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
			:host([width-type="normal"]) .d2l-template-primary-secondary-content,
			:host([width-type="normal"]) .d2l-template-primary-secondary-footer {
				margin: 0 auto;
				max-width: 1230px;
				width: 100%;
			}
			.d2l-template-primary-secondary-container {
				display: grid;
				grid-template-areas:
					"header"
					"content"
					"footer";
				grid-template-columns: auto;
				grid-template-rows: auto 1fr auto;
				height: 100vh;
			}
			header {
				grid-area: header;
				z-index: 2;
			}
			.d2l-template-primary-secondary-content {
				display: grid;
				grid-area: content;
				grid-template-areas: "primary divider secondary";
				grid-template-columns: minmax(320px, 2fr) 1px minmax(320px, 1fr);
				grid-template-rows: auto;
				overflow: hidden;
				z-index: auto;
			}
			main {
				grid-area: primary;
				overflow-x: hidden;
			}
			:host([primary-overflow="hidden"]) main {
				overflow: hidden;
			}
			.d2l-template-primary-secondary-divider {
				background-color: var(--d2l-color-mica);
				grid-area: divider;
			}
			aside {
				grid-area: secondary;
				overflow-y: auto;
			}
			footer {
				background-color: #ffffff;
				box-shadow: 0 -2px 4px rgba(73, 76, 78, 0.2); /* ferrite */
				grid-area: footer;
				padding: 0.75rem 1rem;
				z-index: 2; /* ensures the footer box-shadow is over main areas with background colours set */
			}
			@media only screen and (max-width: 768px) {
				.d2l-template-primary-secondary-container {
					height: 100%;
				}
				.d2l-template-primary-secondary-content {
					grid-template-areas:
						"primary"
						"divider"
						"secondary";
					grid-template-columns: auto;
					grid-template-rows: auto 1px auto;
				}
				footer {
					bottom: 0;
					position: sticky;
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
			<div class="d2l-template-primary-secondary-container">
				<header><slot name="header"></slot></header>
				<div class="d2l-template-primary-secondary-content">
					<main><slot name="primary"></slot></main>
					<div class="d2l-template-primary-secondary-divider"></div>
					<aside><slot name="secondary"></slot></aside>
				</div>
				<footer ?hidden="${!this._hasFooter}">
					<div class="d2l-template-primary-secondary-footer"><slot name="footer" @slotchange="${this._handleFooterSlotChange}"></div></slot>
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

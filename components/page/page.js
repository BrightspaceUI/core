import '../button/floating-buttons.js';
import { css, html, LitElement } from 'lit';
import { isWindows, pageScrollStyles } from './styles.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Page template with header, optional footer and optional navigation panel or supporting panel
 * @slot - The main content of the page (expecting d2l-page-main)
 * @slot header - The header content of the page (expecting d2l-page-header-*)
 * @slot side-nav - The side navigation content of the page (expecting d2l-page-side-nav)
 * @slot supporting - The supporting content of the page (expecting d2l-page-supporting)
 * @slot footer - The footer content of the page (expecting d2l-page-footer)
 */
class Page extends LitElement {

	static get properties() {
		return {
			/**
			 * Width type of the page and its underlying pieces
			 * @type {'normal'|'fullscreen'}
			 */
			widthType: { type: String, attribute: 'width-type' },
			_hasImmersiveNavbar: { state: true },
			_slotVisibility: { state: true },
			_isMultiPanel: { state: true },
			_isSticky: { state: true }
		};
	}

	static get styles() {
		return [pageScrollStyles, css`
			:host {
				--d2l-page-header-top-max-width: 1230px;
				--d2l-page-header-bottom-margin-inline: auto;
				--d2l-page-header-bottom-max-width: 1230px;
				--d2l-page-content-max-width: 1230px;
				--d2l-page-footer-max-width: 1230px;
				--d2l-page-margin-inline: auto;
				inset: 0;
				overflow: hidden;
				position: absolute;
			}

			:host([hidden]),
			[hidden] {
				display: none;
			}

			:host([width-type="fullscreen"]) {
				--d2l-page-header-top-max-width: 100%;
				--d2l-page-content-max-width: 100%;
				--d2l-page-footer-max-width: 100%;
				--d2l-page-margin-inline: 0;
			}
			.d2l-page {
				height: 100%;
				overflow: auto;
				//overflow: hidden auto; trying to fix floating buttons causign horizontal scrollbar
				width: 100%;
			}
			.d2l-page.d2l-page-sticky {
				display: flex;
				flex-direction: column;
			}

			.d2l-page-container {
				display: flex;
				flex-grow: 1;
				height: 100%;
				flex-direction: column;
			}

			.d2l-page.d2l-page-sticky .d2l-page-container {
				overflow: auto;
			}

			.d2l-page-content {
				margin-inline: var(--d2l-page-margin-inline, 0);
				max-width: var(--d2l-page-content-max-width, 100%);
			}

			.d2l-page.d2l-page-multi-panel .d2l-page-content {
				display: flex;
				flex-grow: 1;
				overflow: auto;			
				height: 100%;
			}

			header {
				z-index: 2; /* ensures the header is over the divider and main areas with background colours set */
			}

			main {
				min-width: 400px; // TBD
			}

			.divider {
				background-color: var(--d2l-color-gypsum);
				flex: none;
				width: 4px;
				z-index: 1;
			}

			.d2l-page-footer-container {
				background-color: white;
				box-shadow: 0 -2px 4px rgba(32, 33, 34, 0.2); /* ferrite */
				padding: 0.75rem 0;
				z-index: 1; /* ensures the footer box-shadow is over main areas with background colours set */
			}
			.d2l-page-footer {
				margin-inline: var(--d2l-page-margin-inline, 0);
				max-width: var(--d2l-page-footer-max-width, 100%);
			}

		`];
	}

	constructor() {
		super();

		this.widthType = 'normal';
		this._hasImmersiveNavbar = false;
		this._slotVisibility = {};
		this._isMultiPanel = false;
		this._isSticky = false;
	}

	render() {
		const pageContainerClasses = {
			'd2l-page': true,
			'd2l-page-multi-panel': this._isMultiPanel,
			'd2l-page-scroll': isWindows,
			'd2l-page-sticky': this._isSticky
		};

		const header = html`
			<header><nav>
				<slot name="header" @slotchange="${this.#handleHeaderSlotChange}"></slot>
			</nav></header>`;

		const mainContent = html`
			<main>
				<slot></slot>
			</main>`;

		const sideNavPanel = html`
			<nav ?hidden="${!this._slotVisibility['side-nav']}">
				<slot name="side-nav" @slotchange="${this.#handleSlotVisibilityChange}"></slot>
			</nav>
			<div class="divider" ?hidden="${!this._slotVisibility['side-nav']}"></div>
			`;

		const supportingPanel = html`
			<div class="divider" ?hidden="${!this._slotVisibility['supporting']}"></div>
			<aside ?hidden="${!this._slotVisibility['supporting']}">
				<slot name="supporting" @slotchange="${this.#handleSlotVisibilityChange}"></slot>
			</aside>`;

		const footer = this._slotVisibility['side-nav'] || this._slotVisibility['supporting'] ? html`
			<div ?hidden="${!this._slotVisibility['footer']}" class="d2l-page-footer-container">
				<div class="d2l-page-footer"><slot name="footer" @slotchange="${this.#handleSlotVisibilityChange}"></slot></div>
			</div>` : html`
			<d2l-floating-buttons ?hidden="${!this._slotVisibility['footer']}">
				<div class="d2l-page-footer"><slot name="footer" @slotchange="${this.#handleSlotVisibilityChange}"></slot></div>
			</d2l-floating-buttons>`;

		return html`
			<div class="${classMap(pageContainerClasses)}">
				${header}
				<div class="d2l-page-container">
					<div class="d2l-page-content">
						${sideNavPanel}
						${mainContent}
						${supportingPanel}
					</div>
					${footer}
				</div>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('_hasImmersiveNavbar') || changedProperties.has('_slotVisibility')) {
			this._isSticky = this._hasImmersiveNavbar || this._slotVisibility['side-nav'] || this._slotVisibility['supporting'];
			this._isMultiPanel = this._slotVisibility['side-nav'] || this._slotVisibility['supporting'];
		}
	}

	#handleHeaderSlotChange(e) {
		const nodes = e.target.assignedNodes();
		this._hasImmersiveNavbar = nodes.some(node => node.tagName.toLowerCase() === 'd2l-demo-nav-immersive');
	}

	#handleSlotVisibilityChange(e) {
		const key = e.target.name;
		const nodes = e.target.assignedNodes();
		this._slotVisibility = { ...this._slotVisibility, [key]: nodes.length !== 0 };
		this.requestUpdate();
	}

}

customElements.define('d2l-page', Page);

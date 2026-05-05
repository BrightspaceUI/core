import '../button/floating-buttons.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * Page template with header, optional footer and optional navigation panel or supporting panel
 * @slot - The main content of the page (expecting d2l-page-main)
 * @slot header - The header content of the page (expecting d2l-page-header-*)
 * @slot side-nav - The side navigation content of the page (expecting d2l-page-side-nav)
 * @slot supporting - The supporting content of the page (expecting d2l-page-supporting)
 * @slot footer - The footer content of the page (expecting d2l-page-footer)
 */
class Page extends LocalizeCoreElement(LitElement) {

	static properties = {
		/**
		 * Width type of the page and its underlying pieces
		 * @type {'normal'|'wide'|'fullscreen'}
		 */
		widthType: { type: String, attribute: 'width-type' },
		_headerIsSticky: { state: true },
		_slotVisibility: { state: true }
	};

	static styles = css`
		:host {
			--d2l-page-header-max-width: 1230px;
			--d2l-page-content-max-width: 1230px;
			--d2l-page-footer-max-width: 1230px;
			--d2l-page-margin-inline: auto;
		}

		:host([width-type="wide"]) {
			--d2l-page-header-max-width: 1440px;
			--d2l-page-content-max-width: 1440px;
			--d2l-page-footer-max-width: 1440px;
		}

		:host([width-type="fullscreen"]) {
			--d2l-page-header-max-width: 100%;
			--d2l-page-content-max-width: 100%;
			--d2l-page-footer-max-width: 100%;
		}

		.page.header-sticky .header {
			position: sticky;
			top: 0;
			z-index: 15; /* To be over sticky content of our core components */
		}

		.content {
			display: flex;
			margin-inline: var(--d2l-page-margin-inline, 0);
			max-width: var(--d2l-page-content-max-width, 100%);
			padding-bottom: var(--d2l-page-footer-height, 0); /* Reserve space for fixed footer */
		}

		main {
			flex: 1;
			min-width: 400px; /* TBD */
			overflow: clip;
		}

		.side-nav-panel,
		.supporting-panel {
			height: calc(100vh - var(--d2l-page-footer-height, 0));
			overflow: clip auto;
			position: sticky;
			top: 0;
		}
		.page.header-sticky .side-nav-panel,
		.page.header-sticky .supporting-panel {
			height: calc(100vh - var(--d2l-page-header-height, 0) - var(--d2l-page-footer-height, 0));
			top: var(--d2l-page-header-height, 0);
		}

		.divider {
			background-color: var(--d2l-color-gypsum);
			flex: none;
			width: 4px;
		}

		.footer:not([hidden]),
		.floating-buttons-container {
			display: inline;
		}
		.fixed-footer {
			background-color: white;
			box-shadow: 0 -2px 4px rgba(32, 33, 34, 0.2); /* ferrite */
			inset: auto 0 0;
			padding: 0.75rem 0;
			position: fixed;
		}
		.floating-footer {
			padding-block-end: 0.75rem;
		}
		.footer-contents {
			margin-inline: var(--d2l-page-margin-inline, 0);
			max-width: var(--d2l-page-footer-max-width, 100%);
		}
	`;

	constructor() {
		super();

		this.widthType = 'normal';
		this._headerIsSticky = false;
		this._slotVisibility = {};
		this.#resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				if (entry.target.classList.contains('header')) {
					const height = entry.target.offsetHeight;
					this.style.setProperty('--d2l-page-header-height', `${height}px`);
				} else if (entry.target.classList.contains('footer')) {
					const height = entry.target.classList.contains('fixed-footer') ? entry.target.offsetHeight : 0;
					this.style.setProperty('--d2l-page-footer-height', `${height}px`);
				}
			}
		});
	}

	connectedCallback() {
		super.connectedCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#resizeObserver.disconnect();
	}

	firstUpdated() {
		const header = this.shadowRoot.querySelector('.header');
		const footer = this.shadowRoot.querySelector('.footer');
		if (header) this.#resizeObserver.observe(header);
		if (footer) this.#resizeObserver.observe(footer);
	}

	render() {
		const pageClasses = {
			'page': true,
			'header-sticky': this._headerIsSticky
		};

		const header = html`
			<header class="header">
				<nav aria-label="${this.localize('components.page.header-nav-label')}">
					<slot name="header" @slotchange="${this.#handleHeaderSlotChange}"></slot>
				</nav>
			</header>`;

		const mainContent = html`
			<main>
				<slot></slot>
			</main>`;

		const sideNavPanel = html`
			<nav class="side-nav-panel" ?hidden="${!this._slotVisibility['side-nav']}" aria-label="${this.localize('components.page.side-nav-label')}">
				<slot name="side-nav" @slotchange="${this.#handleSlotVisibilityChange}"></slot>
			</nav>
			${this._slotVisibility['side-nav'] ? html`<div class="divider"></div>` : nothing}
			`;

		const supportingPanel = html`
			${this._slotVisibility['supporting'] ? html`<div class="divider"></div>` : nothing}
			<aside class="supporting-panel" ?hidden="${!this._slotVisibility['supporting']}">
				<slot name="supporting" @slotchange="${this.#handleSlotVisibilityChange}"></slot>
			</aside>`;

		const fixedFooter = this._slotVisibility['side-nav'] || this._slotVisibility['supporting'];
		const footerContainerClasses = { 'footer': true, 'fixed-footer': fixedFooter };
		const footerContents = html`<div class="footer-contents"><slot name="footer" @slotchange="${this.#handleSlotVisibilityChange}"></slot></div>`;
		const footer = html`
			<div class="${classMap(footerContainerClasses)}" ?hidden="${!this._slotVisibility['footer']}">
				${fixedFooter ? footerContents : this.#renderFloatingButtons(footerContents)}	
			</div>`;

		return html`
			<div class="${classMap(pageClasses)}">
				${header}
				<div class="content">
					${sideNavPanel}
					${mainContent}
					${supportingPanel}
				</div>
				${footer}
			</div>
		`;
	}

	#resizeObserver;

	#handleHeaderSlotChange(e) {
		const nodes = e.target.assignedNodes();
		//this._headerIsSticky = nodes.some(node => node.tagName.toLowerCase() === 'd2l-page-header-immersive');
		this._headerIsSticky = nodes.some(node => node.id === 'immersive-nav'); // temp until the official component exists
	}

	#handleSlotVisibilityChange(e) {
		const key = e.target.name;
		const nodes = e.target.assignedNodes();
		this._slotVisibility = { ...this._slotVisibility, [key]: nodes.length !== 0 };
		this.requestUpdate();
	}

	#renderFloatingButtons(footerContents) {
		// Floating buttons needs to be wrapped as it spawns a sibling element that should be cleaned up as one by Lit
		return html`
			<div class="floating-buttons-container">
				<d2l-floating-buttons>
					<div class="floating-footer">${footerContents}</div>
				</d2l-floating-buttons>
			</div>
		`;
	}

}

customElements.define('d2l-page', Page);

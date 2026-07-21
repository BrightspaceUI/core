import '../button/floating-buttons.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { DIVIDER_WIDTH } from './page-divider-internal.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { ProviderMixin } from '../../mixins/provider/provider-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const DRAWER_MIN_HEIGHT = 200; // TO DO: Confirm
const MAIN_MIN_WIDTH = 600; // TO DO: Confirm
const PANEL_MIN_WIDTH = 320;

class PanelStateController {
	constructor(host, panelConfigs) {
		this.#host = host;
		this.#panels = {};
		for (const [key, config] of Object.entries(panelConfigs)) {
			this.#panels[key] = { collapsed: false, size: 0, minSize: config.minSize, maxSize: config.minSize };
		}
		host.addController(this);
	}

	getCollapsed(key) { return this.#panels[key].collapsed; }
	getMaxSize(key) { return this.#panels[key].maxSize; }
	getMinSize(key) { return this.#panels[key].minSize; }
	getSize(key) { return this.#panels[key].size; }

	resize(key, requestedSize) {
		const panel = this.#panels[key];
		// Clamp requested size to min and max bounds
		panel.size = Math.max(panel.minSize, Math.min(requestedSize, panel.maxSize));
		this.#host.requestUpdate();
	}

	setCollapsed(key, collapsed) {
		const panel = this.#panels[key];
		panel.collapsed = collapsed;
		this.#host.requestUpdate();
	}

	updateMaxSize(key, newMaxSize) {
		const panel = this.#panels[key];
		panel.maxSize = newMaxSize;

		if (panel.size > newMaxSize) {
			this.resize(key, panel.size);
		}
	}

	#host;
	#panels;
}

/**
 * Component for laying out a page, with header, optional footer and optional navigation or supporting panels
 * @slot - The main content of the page (expecting d2l-page-main)
 * @slot header - The header content of the page (expecting d2l-page-header-*)
 * @slot side-nav - The side navigation content of the page (expecting d2l-page-side-nav)
 * @slot supporting - The supporting content of the page (expecting d2l-page-supporting)
 * @slot footer - The footer content of the page (expecting d2l-page-footer)
 */
class Page extends ProviderMixin(LocalizeCoreElement(LitElement)) {

	static properties = {
		/**
		 * Width type of the page and its underlying pieces
		 * @type {'normal'|'wide'|'fullscreen'}
		 */
		widthType: { type: String, attribute: 'width-type' },
		_contentWidth: { state: true },
		_headerHeight: { state: true },
		_headerIsSticky: { state: true },
		_footerHeight: { state: true },
		_slotVisibility: { state: true }
	};

	static styles = css`
		:host {
			--d2l-page-header-max-width: 1230px;
			--d2l-page-content-max-width: 1230px;
			--d2l-page-footer-max-width: 1230px;
			--d2l-page-margin-inline: auto;
			--d2l-page-padding: 30px;
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

		@media (max-width: 929px) {
			:host {
				--d2l-page-padding: 24px;
			}
		}
		@media (max-width: 767px) {
			:host {
				--d2l-page-padding: 18px;
			}
		}

		.header {
			position: relative;
			z-index: 16; /* To be over sticky content of our core components and the divider */
		}

		.page.header-sticky .header {
			position: sticky;
			top: 0;
		}

		.content {
			box-sizing: border-box;
			display: flex;
			margin-inline: var(--d2l-page-margin-inline, 0);
			max-width: var(--d2l-page-content-max-width, 100%);
			padding-bottom: var(--d2l-page-footer-height, 0); /* Reserve space for fixed footer */
		}
		.content.has-panels {
			min-height: calc(100vh - var(--d2l-page-header-height-measured, 0px));
		}

		main {
			flex: 1;
			min-width: min(${MAIN_MIN_WIDTH}px, 100%);
		}

		.side-nav,
		.supporting {
			display: contents;
		}

		.side-nav-panel,
		.supporting-panel,
		.divider {
			max-height: calc(100vh - var(--d2l-page-header-height, 0) - var(--d2l-page-footer-height, 0));
			position: sticky;
			top: var(--d2l-page-header-height, 0);
		}

		.side-nav-panel,
		.supporting-panel {
			overflow: clip auto;
		}

		.divider {
			z-index: 15; /* To be over d2l-page-* panel headers */
		}

		.footer:not([hidden]),
		.floating-buttons-container {
			display: inline;
		}
		.fixed-footer {
			background-color: white;
			box-shadow: 0 -2px 4px rgba(32, 33, 34, 0.2); /* ferrite */
			inset: auto 0 0;
			padding-block-start: 0.75rem;
			position: fixed;
			z-index: 15; /* To be over sticky content of our core components and divider */
		}
		.footer-contents {
			margin-inline: var(--d2l-page-margin-inline, 0);
			max-width: var(--d2l-page-footer-max-width, 100%);
		}
	`;

	constructor() {
		super();

		this.widthType = 'normal';
		this._contentWidth = 0;
		this._headerHeight = 0;
		this._headerIsSticky = false;
		this._footerHeight = 0;
		this._panelState = new PanelStateController(this, {
			'side-nav': { minSize: PANEL_MIN_WIDTH },
			'supporting': { minSize: PANEL_MIN_WIDTH },
			'supporting-mobile': { minSize: DRAWER_MIN_HEIGHT }
		});
		this._slotVisibility = {};
		this.#resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				if (entry.target.classList.contains('header')) {
					this._headerHeight = entry.target.offsetHeight;
					this.style.setProperty('--d2l-page-header-height-measured', `${this._headerHeight}px`);

					const height = this._headerIsSticky ? this._headerHeight : 0;
					this.style.setProperty('--d2l-page-header-height', `${height}px`);
					this._panelState.updateMaxSize('supporting-mobile', this.#getMaxDrawerHeight());
				} else if (entry.target.classList.contains('footer')) {
					this._footerHeight = entry.target.classList.contains('fixed-footer') ? entry.target.offsetHeight : 0;

					this.style.setProperty('--d2l-page-footer-height', `${this._footerHeight}px`);
					this._panelState.updateMaxSize('supporting-mobile', this.#getMaxDrawerHeight());
				} else if (entry.target.classList.contains('content')) {
					this._contentWidth = entry.contentRect.width;

					const newMaxWidth = this.#getMaxPanelWidth();
					this._panelState.updateMaxSize('side-nav', newMaxWidth);
					this._panelState.updateMaxSize('supporting', newMaxWidth);

					// TO DO: Collapse panel if needed
				}
			}
		});
		this.provideInstance('d2l-page-header-configure', (options) => {
			this._headerIsSticky = options.sticky;
		});
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('resize', this.#handleWindowResize);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#resizeObserver.disconnect();
		window.removeEventListener('resize', this.#handleWindowResize);
	}

	firstUpdated() {
		const header = this.shadowRoot.querySelector('.header');
		const footer = this.shadowRoot.querySelector('.footer');
		const content = this.shadowRoot.querySelector('.content');
		if (header) this.#resizeObserver.observe(header);
		if (footer) this.#resizeObserver.observe(footer);
		if (content) this.#resizeObserver.observe(content);
	}

	render() {
		const pageClasses = {
			'page': true,
			'header-sticky': this._headerIsSticky
		};
		const contentClasses = {
			'content': true,
			'has-panels': this._slotVisibility['side-nav'] || this._slotVisibility['supporting']
		};

		return html`
			<div class="${classMap(pageClasses)}">
				${this.#renderHeader()}
				<div class="${classMap(contentClasses)}">
					${this.#renderSideNavPanel()}
					<main><slot></slot></main>
					${this.#renderSupportingPanel()}
				</div>
				${this.#renderFooter()}
			</div>
		`;
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('_contentWidth') && changedProperties.get('_contentWidth') === 0 && this._contentWidth > 0) {
			this.#initializePanelSizes();
		}
	}

	#resizeObserver;

	#handleWindowResize = () => {
		this._panelState.updateMaxSize('supporting-mobile', this.#getMaxDrawerHeight());
	};

	#getMaxDrawerHeight() {
		const reservedSpace = this._headerHeight + this._footerHeight + DIVIDER_WIDTH;
		return Math.max(DRAWER_MIN_HEIGHT, window.innerHeight - reservedSpace);
	}

	#getMaxPanelWidth() {
		const reservedSpace = MAIN_MIN_WIDTH + DIVIDER_WIDTH;
		return Math.max(PANEL_MIN_WIDTH, this._contentWidth - reservedSpace);
	}

	#handleDividerResize(e) {
		const panelKey = e.target.dataset.panelKey;
		this._panelState.resize(panelKey, e.detail.requestedSize);
	};

	#handleDividerToggle(e) {
		const panelKey = e.target.dataset.panelKey;
		const collapsed = !this._panelState.getCollapsed(panelKey);
		this._panelState.setCollapsed(panelKey, collapsed);
	};

	#handleSlotVisibilityChange(e) {
		const key = e.target.name;
		const nodes = e.target.assignedNodes();
		this._slotVisibility = { ...this._slotVisibility, [key]: nodes.length !== 0 };
	}

	#initializePanelSizes() {
		const defaultWidth = Math.floor(this._contentWidth / 3);
		const defaultHeight = Math.floor(window.innerHeight / 2);

		this._panelState.resize('side-nav', defaultWidth);
		this._panelState.resize('supporting', defaultWidth);
		this._panelState.resize('supporting-mobile', defaultHeight);
	}

	#renderDivider(panelKey, label, panelPosition) {
		return html`
			<d2l-page-divider-internal
				class="divider"
				data-panel-key="${panelKey}"
				label="${label}"
				?collapsed="${this._panelState.getCollapsed(panelKey)}"
				current-size="${this._panelState.getSize(panelKey)}"
				max-size="${this._panelState.getMaxSize(panelKey)}"
				min-size="${this._panelState.getMinSize(panelKey)}"
				panel-position="${ifDefined(panelPosition)}"
				@d2l-page-divider-resize="${this.#handleDividerResize}"
				@d2l-page-divider-toggle="${this.#handleDividerToggle}"
			></d2l-page-divider-internal>
		`;
	}

	#renderFloatingButtons(footerContents) {
		// Floating buttons needs to be wrapped as it spawns a sibling element that should be cleaned up as one by Lit
		return html`
			<div class="floating-buttons-container">
				<d2l-floating-buttons>
					${footerContents}
				</d2l-floating-buttons>
			</div>
		`;
	}

	#renderFooter() {
		const fixedFooter = this._slotVisibility['side-nav'] || this._slotVisibility['supporting'];
		const footerContainerClasses = { 'footer': true, 'fixed-footer': fixedFooter };
		const footerContents = html`<div class="footer-contents"><slot name="footer" @slotchange="${this.#handleSlotVisibilityChange}"></slot></div>`;
		return html`
			<div
				role="region"
				aria-label="${this.localize('components.page.footer-region-label')}"
				class="${classMap(footerContainerClasses)}"
				?hidden="${!this._slotVisibility['footer']}">
				${fixedFooter ? footerContents : this.#renderFloatingButtons(footerContents)}	
			</div>
		`;
	}

	#renderHeader() {
		return html`
			<header class="header">
				<nav aria-label="${this.localize('components.page.header-nav-label')}">
					<slot name="header"></slot>
				</nav>
			</header>
		`;
	}

	#renderSideNavPanel() {
		return html`
			<nav class="side-nav" aria-label="${this.localize('components.page.side-nav-label')}">
				<div
					class="side-nav-panel"
					style=${styleMap({ width: `${this._panelState.getSize('side-nav')}px` })}
					?hidden="${!this._slotVisibility['side-nav']}">
					<slot name="side-nav" @slotchange="${this.#handleSlotVisibilityChange}"></slot>
				</div>
				${!this._slotVisibility['side-nav'] ? nothing :
					this.#renderDivider('side-nav', this.localize('components.page.side-nav-divider-label'), 'start')}
			</nav>
		`;
	}

	#renderSupportingPanel() {
		return html`
			<aside class="supporting" aria-label="${this.localize('components.page.supporting-label')}">
				${!this._slotVisibility['supporting'] ? nothing :
					this.#renderDivider('supporting', this.localize('components.page.supporting-divider-label'), 'end')}
				<div
					class="supporting-panel"
					style=${styleMap({ width: `${this._panelState.getSize('supporting')}px` })}
					?hidden="${!this._slotVisibility['supporting']}">
					<slot name="supporting" @slotchange="${this.#handleSlotVisibilityChange}"></slot>
				</div>
			</aside>
		`;
	}

}

customElements.define('d2l-page', Page);

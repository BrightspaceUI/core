import '../button/floating-buttons.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { DIVIDER_WIDTH } from './page-divider-internal.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { ProviderMixin } from '../../mixins/provider/provider-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const VALID_STATE_STORAGE_KEY = /^[a-z0-9_-]+$/i;
export const panelStateStorageKey = key => `d2l-page-panel-state-${key}`;

const DRAWER_MIN_HEIGHT = 200; // TO DO: Confirm
export const MAIN_MIN_WIDTH = 600; // TO DO: Confirm
export const PANEL_MIN_WIDTH = 298;

export const DIVIDER_GUTTER_WIDTH = 18;

export const SIDE_NAV_DEFAULT_WIDTH = 334;
export const supportingDefaultWidth = contentWidth => Math.floor(contentWidth / 3);
export const supportingOverlayDefaultWidth = contentWidth => Math.min(400, Math.floor(0.9 * (contentWidth - DIVIDER_WIDTH - DIVIDER_GUTTER_WIDTH)));
export const supportingMobileDefaultHeight = fullHeight => Math.floor(fullHeight / 2);

const OVERLAY_MODE_BREAKPOINT = 929;
const MOBILE_MODE_BREAKPOINT = 767;

const overlayModeQuery = window.matchMedia(`(max-width: ${OVERLAY_MODE_BREAKPOINT}px)`);
const mobileModeQuery = window.matchMedia(`(max-width: ${MOBILE_MODE_BREAKPOINT}px)`);

class PanelStateController {
	constructor(host, panelConfigs) {
		this.#host = host;
		this.#panels = {};
		for (const [key, config] of Object.entries(panelConfigs)) {
			this.#panels[key] = {
				animate: false,
				collapsed: config.collapsed,
				restoreCollapsed: !config.collapsed,
				size: 0,
				dragSize: null,
				minSize: config.minSize,
				maxSize: config.minSize
			};
		}
		host.addController(this);
	}

	getAnimate(key) { return this.#panels[key].animate; }
	getCollapsed(key) { return this.#panels[key].collapsed; }
	getMaxSize(key) { return this.#panels[key].maxSize; }
	getMinSize(key) { return this.#panels[key].minSize; }
	getSize(key) {
		const panel = this.#panels[key];
		if (panel.dragSize !== null) return panel.dragSize;
		return panel.collapsed ? 0 : panel.size;
	}
	getTrueSize(key) {
		const panel = this.#panels[key];
		if (panel.dragSize !== null) {
			return Math.max(panel.minSize, panel.dragSize);
		}
		return panel.size;
	}

	initialize(defaults) {
		const storedState = this.#getStoredState();

		for (const [key, panel] of Object.entries(this.#panels)) {
			const stored = storedState?.[key];
			if (stored) {
				const storedSize = parseInt(stored.size);
				this.resize(key, isFinite(storedSize) ? storedSize : defaults[key]);
				if (panel.restoreCollapsed && stored.collapsed) panel.collapsed = true;
			} else {
				this.resize(key, defaults[key]);
			}
		}
	}

	resize(key, requestedSize, { animate = false, storeState = false } = {}) {
		const panel = this.#panels[key];
		// Clamp requested size to min and max bounds
		panel.size = Math.max(panel.minSize, Math.min(requestedSize, panel.maxSize));
		panel.animate = animate;
		panel.dragSize = null;
		this.#host.requestUpdate();
		if (storeState) this.#storePanelState(key);
	}

	setCollapsed(key, collapsed) {
		const panel = this.#panels[key];
		panel.collapsed = collapsed;
		panel.dragSize = null;
		panel.animate = true;
		this.#host.requestUpdate();
		this.#storePanelState(key);
	}

	setDragSize(key, dragSize) {
		const panel = this.#panels[key];
		panel.dragSize = dragSize;
		panel.animate = false;
		this.#host.requestUpdate();
	}

	updateMaxSize(key, newMaxSize) {
		const panel = this.#panels[key];
		panel.maxSize = newMaxSize;

		if (panel.size > newMaxSize) {
			this.resize(key, panel.size, { animate: true });
		}
	}

	#host;
	#panels;

	#getPanelStateStorageKey() {
		return this.#host.stateStorageKey ? panelStateStorageKey(this.#host.stateStorageKey) : null;
	}

	#getStoredState() {
		const fullKey = this.#getPanelStateStorageKey();
		if (!fullKey) return;

		try {
			return JSON.parse(localStorage.getItem(fullKey));
		} catch {
			// Return nothing if local storage isn't available or has bad data
			return;
		}
	}

	#storePanelState(panelKey) {
		const fullKey = this.#getPanelStateStorageKey();
		if (!fullKey) return;
		const state = this.#getStoredState() || {};

		try {
			state[panelKey] = {
				size: this.#panels[panelKey].size
			};
			if (this.#panels[panelKey].restoreCollapsed) {
				state[panelKey].collapsed = this.#panels[panelKey].collapsed;
			}
			localStorage.setItem(fullKey, JSON.stringify(state));
		} catch {
			// Do nothing if storage quota exceeded or using private browsing mode of an old Safari version
			// TO DO: If QuotaExceededError, log this to our logging framework
		}
	}
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
		 * Key used to optionally store page state across reloads (using localStorage). Different pages should use different keys.
		 * Currently, this includes panel state info.
		 * @type {string}
		 */
		stateStorageKey: { type: String, attribute: 'state-storage-key' },
		/**
		 * Width type of the page and its underlying pieces
		 * @type {'normal'|'wide'|'fullscreen'}
		 */
		widthType: { type: String, attribute: 'width-type' },
		_contentWidth: { state: true },
		_headerHeight: { state: true },
		_headerIsSticky: { state: true },
		_footerHeight: { state: true },
		_inOverlayMode: { state: true },
		_inMobileMode: { state: true },
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

		@media (max-width: ${OVERLAY_MODE_BREAKPOINT}px) {
			:host {
				--d2l-page-padding: 24px;
			}
		}
		@media (max-width: ${MOBILE_MODE_BREAKPOINT}px) {
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
			position: relative;
		}
		.content.has-panels {
			min-height: calc(100vh - var(--d2l-page-header-height-measured, 0px));
		}

		main {
			flex: 1;
			min-width: min(${MAIN_MIN_WIDTH}px, 100%);
			position: relative;
		}
		.content.has-panels main {
			max-width: calc(100% - ${DIVIDER_WIDTH}px - ${DIVIDER_GUTTER_WIDTH}px);
			min-width: min(${MAIN_MIN_WIDTH}px, calc(100% - ${DIVIDER_WIDTH}px - ${DIVIDER_GUTTER_WIDTH}px));
		}

		.side-nav,
		.supporting {
			display: contents;
		}
		.side-nav[hidden],
		.supporting[hidden] {
			display: none;
		}

		.side-nav-panel,
		.supporting-panel {
			background-color: white;
			overflow: hidden;
		}

		.side-nav-panel,
		.supporting-panel,
		.divider {
			position: sticky;
			top: var(--d2l-page-header-height, 0);
		}

		.side-nav-panel,
		.supporting-panel,
		.side-nav-panel-content,
		.supporting-panel-content,
		.divider {
			max-height: calc(100vh - var(--d2l-page-header-height, 0) - var(--d2l-page-footer-height, 0));
		}

		.side-nav-panel-content,
		.supporting-panel-content {
			box-sizing: border-box;
			overflow: clip auto;
		}
		.side-nav-panel-content {
			float: inline-end;
		}
		.supporting-panel-content {
			float: inline-start;
		}

		.divider {
			z-index: 15; /* To be over d2l-page-* panel headers */
		}

		.side-nav-panel.collapsed {
			padding-inline-end: ${DIVIDER_GUTTER_WIDTH}px;
		}
		.supporting-panel.collapsed {
			padding-inline-start: ${DIVIDER_GUTTER_WIDTH}px;
		}
		.side-nav-panel.collapsed .side-nav-panel-content,
		.supporting-panel.collapsed .supporting-panel-content {
			visibility: hidden;
		}
		@media (prefers-reduced-motion: no-preference) {
			.side-nav-panel.animate,
			.supporting-panel.animate,
			.side-nav-panel.animate .side-nav-panel-content,
			.supporting-panel.animate .supporting-panel-content {
				transition:
					width 400ms cubic-bezier(0, 0.7, 0.5, 1),
					padding 400ms cubic-bezier(0, 0.7, 0.5, 1);
			}
			.side-nav-panel.animate.collapsed .side-nav-panel-content,
			.supporting-panel.animate.collapsed .supporting-panel-content {
				transition:
					width 400ms cubic-bezier(0, 0.7, 0.5, 1),
					visibility 0s 400ms;
			}
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

		/* Overlay Mode */
		.scrim {
			background-color: var(--d2l-color-regolith);
			inset: 0;
			opacity: 0.7;
			position: absolute;
			z-index: 14; /* To be over d2l-page-main panel header and sticky content of our core components */
		}
		@media (max-width: ${OVERLAY_MODE_BREAKPOINT}px) {
			.content.scrimmed {
				overflow: clip;
			}
			.side-nav-panel {
				flex-shrink: 0;
			}
			.supporting {
				display: flex;
				inset-block: 0;
				inset-inline-end: 0;
				position: absolute;
				z-index: 15; /* To be over d2l-page-* panel headers and sticky content of our core components */
			}
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
			'side-nav': { collapsed: false, minSize: PANEL_MIN_WIDTH },
			'side-nav-overlay': { collapsed: true, minSize: PANEL_MIN_WIDTH },
			'supporting': { collapsed: false, minSize: PANEL_MIN_WIDTH },
			'supporting-overlay': { collapsed: true, minSize: PANEL_MIN_WIDTH },
			'supporting-mobile': { collapsed: false, minSize: DRAWER_MIN_HEIGHT }
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

					const newMaxOverlayWidth = this.#getMaxPanelOverlayWidth();
					this._panelState.updateMaxSize('side-nav-overlay', newMaxOverlayWidth);
					this._panelState.updateMaxSize('supporting-overlay', newMaxOverlayWidth);
				}
			}
		});
		this.provideInstance('d2l-page-header-configure', (options) => {
			this._headerIsSticky = options.sticky;
		});
	}

	get stateStorageKey() { return this.#stateStorageKey; }
	set stateStorageKey(value) {
		if (value && !VALID_STATE_STORAGE_KEY.test(value)) {
			this.#stateStorageKey = undefined;
			throw new Error(`d2l-page: invalid state-storage-key "${value}". Keys may only contain alphanumeric characters, dashes, and underscores.`);
		}

		this.#stateStorageKey = value;
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('resize', this.#handleWindowResize);

		this._inOverlayMode = overlayModeQuery.matches;
		overlayModeQuery.addEventListener('change', this.#handleOverlayModeChange);
		this._inMobileMode = mobileModeQuery.matches;
		mobileModeQuery.addEventListener('change', this.#handleMobileModeChange);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#resizeObserver.disconnect();
		window.removeEventListener('resize', this.#handleWindowResize);

		overlayModeQuery.removeEventListener('change', this.#handleOverlayModeChange);
		mobileModeQuery.removeEventListener('change', this.#handleMobileModeChange);
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
		const sideNavPanelKey = this._inOverlayMode ? 'side-nav-overlay' : 'side-nav';
		const supportingPanelKey = this._inMobileMode ? 'supporting-overlay' : (this._inOverlayMode ? 'supporting-overlay' : 'supporting'); // TO DO: Switch to supporting-mobile
		const { showScrim, scrimMessage } = this.#determineScrimVisibility();

		const pageClasses = {
			'page': true,
			'header-sticky': this._headerIsSticky
		};
		const contentClasses = {
			'content': true,
			'has-panels': this._slotVisibility['side-nav'] || this._slotVisibility['supporting'],
			'scrimmed': showScrim
		};

		return html`
			<div class="${classMap(pageClasses)}">
				${this.#renderHeader()}
				<div class="${classMap(contentClasses)}">
					${this.#renderSideNavPanel(sideNavPanelKey)}
					<main aria-label="${ifDefined(showScrim ? this.localize(scrimMessage) : undefined)}">
						<div class="main" ?inert="${showScrim}"><slot></slot></div>
						${showScrim ? html`<div class="scrim" @click="${this.#handleScrimClick}"></div>` : nothing}
					</main>
					${this.#renderSupportingPanel(supportingPanelKey)}
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
	#stateStorageKey;

	#handleMobileModeChange = (e) => {
		// TO DO: Collapse supporting-overlay panel when moving from mobile to overlay mode
		this._inMobileMode = e.matches;
	};

	#handleOverlayModeChange = (e) => {
		if (!this._inOverlayMode && e.matches) {
			this._panelState.setCollapsed('side-nav-overlay', true);
			this._panelState.setCollapsed('supporting-overlay', true);
		} else if (this._inOverlayMode && !e.matches) {
			if (!this._panelState.getCollapsed('side-nav-overlay')) {
				this._panelState.setCollapsed('side-nav', false);
			}
			if (!this._panelState.getCollapsed('supporting-overlay')) {
				this._panelState.setCollapsed('supporting', false);
			}
		}
		this._inOverlayMode = e.matches;
	};

	#handleWindowResize = () => {
		this._panelState.updateMaxSize('supporting-mobile', this.#getMaxDrawerHeight());
	};

	#determineScrimVisibility() {
		let scrimMessage = null;
		if (!this._inOverlayMode) return { showScrim: false, scrimMessage };

		if (this._slotVisibility['side-nav'] && !this._panelState.getCollapsed('side-nav-overlay')) {
			scrimMessage = 'components.page.side-nav-scrim';
		} else if (this._slotVisibility['supporting'] && !this._panelState.getCollapsed('supporting-overlay')) {
			// TO DO: No scrim for supporting in mobile mode
			scrimMessage = 'components.page.supporting-scrim';
		}
		return { showScrim: scrimMessage !== null, scrimMessage };
	}

	#getMaxDrawerHeight() {
		const reservedSpace = this._headerHeight + this._footerHeight + DIVIDER_WIDTH;
		return Math.max(DRAWER_MIN_HEIGHT, window.innerHeight - reservedSpace);
	}

	#getMaxPanelOverlayWidth() {
		const reservedSpace = DIVIDER_WIDTH + DIVIDER_GUTTER_WIDTH;
		return Math.max(PANEL_MIN_WIDTH, this._contentWidth - reservedSpace);
	}

	#getMaxPanelWidth() {
		const reservedSpace = MAIN_MIN_WIDTH + DIVIDER_WIDTH;
		return Math.max(PANEL_MIN_WIDTH, this._contentWidth - reservedSpace);
	}

	#handleDividerResize(e) {
		const panelKey = e.target.dataset.panelKey;
		this._panelState.resize(panelKey, e.detail.requestedSize, { animate: true, storeState: true });
	};

	#handleDividerResizeLive(e) {
		const panelKey = e.target.dataset.panelKey;
		this._panelState.setDragSize(panelKey, e.detail.requestedSize);
	}

	#handleDividerToggle(e) {
		const panelKey = e.target.dataset.panelKey;
		const collapsed = !this._panelState.getCollapsed(panelKey);
		this._panelState.setCollapsed(panelKey, collapsed);
	};

	#handleScrimClick() {
		this._panelState.setCollapsed('side-nav-overlay', true);
		this._panelState.setCollapsed('supporting-overlay', true);
	}

	#handleSlotVisibilityChange(e) {
		const key = e.target.name;
		const nodes = e.target.assignedNodes();
		this._slotVisibility = { ...this._slotVisibility, [key]: nodes.length !== 0 };
	}

	#initializePanelSizes() {
		this._panelState.initialize({
			'side-nav': SIDE_NAV_DEFAULT_WIDTH,
			'side-nav-overlay': SIDE_NAV_DEFAULT_WIDTH,
			'supporting': supportingDefaultWidth(this._contentWidth),
			'supporting-overlay': supportingOverlayDefaultWidth(this._contentWidth),
			'supporting-mobile': supportingMobileDefaultHeight(window.innerHeight)
		});
	}

	#renderDivider(panelKey, label, panelPosition) {
		const classes = {
			'divider': true,
			'animate': this._panelState.getAnimate(panelKey)
		};
		return html`
			<d2l-page-divider-internal
				class="${classMap(classes)}"
				data-panel-key="${panelKey}"
				label="${label}"
				?collapsed="${this._panelState.getCollapsed(panelKey)}"
				collapsed-size="${DIVIDER_GUTTER_WIDTH}"
				current-size="${this._panelState.getSize(panelKey)}"
				max-size="${this._panelState.getMaxSize(panelKey)}"
				min-size="${this._panelState.getMinSize(panelKey)}"
				panel-position="${ifDefined(panelPosition)}"
				@d2l-page-divider-resize="${this.#handleDividerResize}"
				@d2l-page-divider-resize-live="${this.#handleDividerResizeLive}"
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

	#renderSideNavPanel(panelKey) {
		const classes = {
			'side-nav-panel': true,
			'animate': this._panelState.getAnimate(panelKey),
			'collapsed': this._panelState.getSize(panelKey) === 0 // Collapsed and not being dragged
		};
		return html`
			<nav class="side-nav" ?hidden="${!this._slotVisibility['side-nav']}" aria-label="${this.localize('components.page.side-nav-label')}">
				<div
					class="${classMap(classes)}"
					style=${styleMap({ width: `${this._panelState.getSize(panelKey)}px` })}>
					<div class="side-nav-panel-content" style=${styleMap({ width: `${this._panelState.getTrueSize(panelKey)}px` })}>
						<slot name="side-nav" @slotchange="${this.#handleSlotVisibilityChange}"></slot>
					</div>
				</div>
				${!this._slotVisibility['side-nav'] ? nothing :
					this.#renderDivider(panelKey, this.localize('components.page.side-nav-divider-label'), 'start')}
			</nav>
		`;
	}

	#renderSupportingPanel(panelKey) {
		const classes = {
			'supporting-panel': true,
			'animate': this._panelState.getAnimate(panelKey),
			'collapsed': this._panelState.getSize(panelKey) === 0 // Collapsed and not being dragged
		};
		return html`
			<aside class="supporting" ?hidden="${!this._slotVisibility['supporting']}" aria-label="${this.localize('components.page.supporting-label')}">
				${!this._slotVisibility['supporting'] ? nothing :
					this.#renderDivider(panelKey, this.localize('components.page.supporting-divider-label'), 'end')}
				<div
					class="${classMap(classes)}"
					style=${styleMap({ width: `${this._panelState.getSize(panelKey)}px` })}>
					<div class="supporting-panel-content" style=${styleMap({ width: `${this._panelState.getTrueSize(panelKey)}px` })}>
						<slot name="supporting" @slotchange="${this.#handleSlotVisibilityChange}"></slot>
					</div>
				</div>
			</aside>
		`;
	}

}

customElements.define('d2l-page', Page);

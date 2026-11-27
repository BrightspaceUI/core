import '../button/floating-buttons.js';
import '../colors/colors.js';
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

export const HIDE_ARROWS_BREAKPOINT = 400;

const SCROLLBAR_HOVER_STRIP_WIDTH = 12;

//export const isWindows = window.navigator.userAgent.indexOf('Windows') > -1;
//export const isMobile = window.navigator.userAgent.indexOf('mobile') > -1;
//const customScroll = isWindows && !isMobile;

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

	setCollapsed(key, collapsed, { animate = true } = {}) {
		const panel = this.#panels[key];
		panel.collapsed = collapsed;
		panel.dragSize = null;
		panel.animate = animate;
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
		 * For POC: Hide the panel scrollbars until the scrollbar area is hovered or the panel is scrolled
		 * @type {boolean}
		 */
		panelScrollbarsAutoHide: { type: Boolean, attribute: 'panel-scrollbars-auto-hide' },
		/**
		 * For POC: Use thinner custom panel scrollbars
		 * @type {boolean}
		 */
		panelScrollbarsThin: { type: Boolean, attribute: 'panel-scrollbars-thin' },
		/**
		 * For POC: How long (ms) auto-hidden panel scrollbars stay revealed after scrolling stops
		 * @type {number}
		 */
		panelScrollbarsScrollTimeout: { type: Number, attribute: 'panel-scrollbars-scroll-timeout' },
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
		_revealedScrollbar: { state: true },
		_scrollingScrollbar: { state: true },
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
			min-height: calc(100dvh - var(--d2l-page-header-height-measured, 0px));
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
			max-height: calc(100dvh - var(--d2l-page-header-height, 0) - var(--d2l-page-footer-height, 0));
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
			inset-block: auto 0;
			inset-inline: 0;
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
			.content.has-panels {
				overflow-x: clip; /* Needed for iOS to properly calculate content size, not only for scrimming */
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

		/* POC - Thin Panel Scrollbars - Copied primary-secondary for now */
		.page.panel-scrollbars-thin .side-nav-panel-content,
		.page.panel-scrollbars-thin .supporting-panel-content {
			scrollbar-color: var(--d2l-color-galena) rgba(255, 255, 255, 0.4);
			scrollbar-width: thin;
		}
		.page.panel-scrollbars-thin .side-nav-panel-content::-webkit-scrollbar,
		.page.panel-scrollbars-thin .supporting-panel-content::-webkit-scrollbar {
			width: 8px;
		}
		.page.panel-scrollbars-thin .side-nav-panel-content::-webkit-scrollbar-track,
		.page.panel-scrollbars-thin .supporting-panel-content::-webkit-scrollbar-track {
			background: rgba(255, 255, 255, 0.4);
		}
		.page.panel-scrollbars-thin .side-nav-panel-content::-webkit-scrollbar-thumb,
		.page.panel-scrollbars-thin .supporting-panel-content::-webkit-scrollbar-thumb {
			background: var(--d2l-color-galena);
			border-radius: 4px;
		}
		.page.panel-scrollbars-thin .side-nav-panel-content::-webkit-scrollbar-thumb:hover,
		.page.panel-scrollbars-thin .supporting-panel-content::-webkit-scrollbar-thumb:hover {
			background: var(--d2l-color-tungsten);
		}

		/* POC - Auto-hide Panel Scrollbars - Revealed on scrollbar area hover or while scrolling */
		.page.panel-scrollbars-auto-hide .side-nav-panel:not(.scrollbar-revealed):not(.scrollbar-scrolling) .side-nav-panel-content,
		.page.panel-scrollbars-auto-hide .supporting-panel:not(.scrollbar-revealed):not(.scrollbar-scrolling) .supporting-panel-content {
			scrollbar-color: transparent transparent;
		}
		.page.panel-scrollbars-auto-hide .side-nav-panel:not(.scrollbar-revealed):not(.scrollbar-scrolling) .side-nav-panel-content::-webkit-scrollbar-thumb,
		.page.panel-scrollbars-auto-hide .supporting-panel:not(.scrollbar-revealed):not(.scrollbar-scrolling) .supporting-panel-content::-webkit-scrollbar-thumb,
		.page.panel-scrollbars-auto-hide .side-nav-panel:not(.scrollbar-revealed):not(.scrollbar-scrolling) .side-nav-panel-content::-webkit-scrollbar-track,
		.page.panel-scrollbars-auto-hide .supporting-panel:not(.scrollbar-revealed):not(.scrollbar-scrolling) .supporting-panel-content::-webkit-scrollbar-track {
			background: transparent;
		}
		.scrollbar-hover-strip {
			bottom: 0;
			height: 100vh; /* Taller than the scroller, which clips it */
			margin-block-start: -100vh; /* Takes no layout space or scrollable height */
			margin-inline-start: auto;
			position: sticky;
			width: ${SCROLLBAR_HOVER_STRIP_WIDTH}px;
		}
		.collapsed .scrollbar-hover-strip {
			display: none;
		}
	`;

	constructor() {
		super();

		this.panelScrollbarsAutoHide = false;
		this.panelScrollbarsThin = false;
		this.panelScrollbarsScrollTimeout = 1000;
		this.widthType = 'normal';
		this._contentWidth = 0;
		this._headerHeight = 0;
		this._headerIsSticky = false;
		this._footerHeight = 0;
		this._revealedScrollbar = null;
		this._scrollingScrollbar = null;
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

					this.#updateHeaderMetrics();
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
		clearTimeout(this.#scrollingTimeout);
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
			'header-sticky': this._headerIsSticky,
			'panel-scrollbars-auto-hide': this.panelScrollbarsAutoHide,
			'panel-scrollbars-thin': this.panelScrollbarsThin
		};
		const contentClasses = {
			'content': true,
			'has-panels': this._slotVisibility['side-nav'] || this._slotVisibility['supporting']
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
		if (changedProperties.has('_headerIsSticky')) {
			this.#updateHeaderMetrics();
		}
	}

	#resizeObserver;
	#scrollingTimeout;
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
		// Do not animate if dragging past closed size
		const animate = this._panelState.getSize(panelKey) > DIVIDER_GUTTER_WIDTH;
		this._panelState.resize(panelKey, e.detail.requestedSize, { animate, storeState: true });
	};

	#handleDividerResizeLive(e) {
		const panelKey = e.target.dataset.panelKey;
		this._panelState.setDragSize(panelKey, e.detail.requestedSize);
	}

	#handleDividerToggle(e) {
		const panelKey = e.target.dataset.panelKey;
		const collapsed = this._panelState.getCollapsed(panelKey);
		// Do not animate if dragged to fully closed
		const animate = collapsed || this._panelState.getSize(panelKey) > DIVIDER_GUTTER_WIDTH;
		this._panelState.setCollapsed(panelKey, !collapsed, { animate });
	};

	#handlePanelContentScroll(e) {
		if (!this.panelScrollbarsAutoHide) return;
		this._scrollingScrollbar = e.target.dataset.panelKey;
		clearTimeout(this.#scrollingTimeout);
		this.#scrollingTimeout = setTimeout(() => this._scrollingScrollbar = null, this.panelScrollbarsScrollTimeout);
	}

	#handlePanelPointerLeave(e) {
		// Keep revealed while dragging the scrollbar thumb
		if (e.buttons !== 0 || this._revealedScrollbar !== e.currentTarget.dataset.panelKey) return;
		this._revealedScrollbar = null;
	}

	#handlePanelPointerOver(e) {
		if (e.buttons !== 0) return;
		// Events over the scrollbar itself target the scroller outside its client area
		const content = e.currentTarget.firstElementChild;
		if (e.target === content && (e.offsetX < 0 || e.offsetX >= content.clientWidth)) this._revealedScrollbar = e.currentTarget.dataset.panelKey;
	}

	#handleScrimClick() {
		this._panelState.setCollapsed('side-nav-overlay', true);
		this._panelState.setCollapsed('supporting-overlay', true);
	}

	#handleScrollbarHoverStripEnter(e) {
		this._revealedScrollbar = e.currentTarget.dataset.panelKey;
	}

	#handleScrollbarHoverStripLeave(e) {
		if (e.buttons !== 0) return;
		const strip = e.currentTarget;
		// Moving onto the scrollbar keeps it revealed
		const towardsScrollbar = getComputedStyle(strip).direction === 'rtl' ? e.offsetX < 0 : e.offsetX >= strip.offsetWidth;
		if (!towardsScrollbar && this._revealedScrollbar === strip.dataset.panelKey) this._revealedScrollbar = null;
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
		return html`
			<d2l-page-divider-internal
				class="divider"
				data-panel-key="${panelKey}"
				label="${label}"
				?collapsed="${this._panelState.getCollapsed(panelKey)}"
				collapsed-size="${DIVIDER_GUTTER_WIDTH}"
				current-size="${this._panelState.getSize(panelKey)}"
				max-size="${this._panelState.getMaxSize(panelKey)}"
				min-size="${this._panelState.getMinSize(panelKey)}"
				panel-position="${ifDefined(panelPosition)}"
				?hide-arrows="${this._contentWidth < HIDE_ARROWS_BREAKPOINT}"
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

	#renderScrollbarHoverStrip(panelKey) {
		if (!this.panelScrollbarsAutoHide) return nothing;
		return html`<div class="scrollbar-hover-strip" data-panel-key="${panelKey}" @pointerenter="${this.#handleScrollbarHoverStripEnter}" @pointerleave="${this.#handleScrollbarHoverStripLeave}"></div>`;
	}

	#renderSideNavPanel(panelKey) {
		const classes = {
			'side-nav-panel': true,
			'animate': this._panelState.getAnimate(panelKey),
			'collapsed': this._panelState.getSize(panelKey) === 0, // Collapsed and not being dragged
			'scrollbar-revealed': this._revealedScrollbar === panelKey,
			'scrollbar-scrolling': this._scrollingScrollbar === panelKey
		};
		return html`
			<nav class="side-nav" ?hidden="${!this._slotVisibility['side-nav']}" aria-label="${this.localize('components.page.side-nav-label')}">
				<div
					class="${classMap(classes)}"
					data-panel-key="${panelKey}"
					style=${styleMap({ width: `${this._panelState.getSize(panelKey)}px` })}
					@pointerleave="${this.#handlePanelPointerLeave}"
					@pointerover="${this.panelScrollbarsAutoHide ? this.#handlePanelPointerOver : nothing}">
					<div class="side-nav-panel-content" data-panel-key="${panelKey}" style=${styleMap({ width: `${this._panelState.getTrueSize(panelKey)}px` })} @scroll="${this.#handlePanelContentScroll}">
						<slot name="side-nav" @slotchange="${this.#handleSlotVisibilityChange}"></slot>
						${this.#renderScrollbarHoverStrip(panelKey)}
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
			'collapsed': this._panelState.getSize(panelKey) === 0, // Collapsed and not being dragged
			'scrollbar-revealed': this._revealedScrollbar === panelKey,
			'scrollbar-scrolling': this._scrollingScrollbar === panelKey
		};
		return html`
			<aside class="supporting" ?hidden="${!this._slotVisibility['supporting']}" aria-label="${this.localize('components.page.supporting-label')}">
				${!this._slotVisibility['supporting'] ? nothing :
					this.#renderDivider(panelKey, this.localize('components.page.supporting-divider-label'), 'end')}
				<div
					class="${classMap(classes)}"
					data-panel-key="${panelKey}"
					style=${styleMap({ width: `${this._panelState.getSize(panelKey)}px` })}
					@pointerleave="${this.#handlePanelPointerLeave}"
					@pointerover="${this.panelScrollbarsAutoHide ? this.#handlePanelPointerOver : nothing}">
					<div class="supporting-panel-content" data-panel-key="${panelKey}" style=${styleMap({ width: `${this._panelState.getTrueSize(panelKey)}px` })} @scroll="${this.#handlePanelContentScroll}">
						<slot name="supporting" @slotchange="${this.#handleSlotVisibilityChange}"></slot>
						${this.#renderScrollbarHoverStrip(panelKey)}
					</div>
				</div>
			</aside>
		`;
	}

	#updateHeaderMetrics() {
		this.style.setProperty('--d2l-page-header-height', `${this._headerIsSticky ? this._headerHeight : 0}px`);
	}

}

customElements.define('d2l-page', Page);

import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { getFocusRingStyles } from '../../helpers/focus.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

const RTL_MULTIPLIER = navigator.userAgent.indexOf('Edge/') > 0 ? 1 : -1; /* legacy-Edge doesn't reverse scrolling in RTL */
export const SCROLL_AMOUNT = 0.8;

let focusStyleSheet;
function getFocusStyleSheet() {
	if (!focusStyleSheet) {
		focusStyleSheet = new CSSStyleSheet();
		focusStyleSheet.replaceSync(getFocusRingStyles('.d2l-scroll-wrapper-focus'));
	}
	return focusStyleSheet;
}

function getStyleSheetInsertionPoint(elem) {
	if (elem.nodeType === Node.DOCUMENT_NODE || elem.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
		if (elem.querySelector('.d2l-scroll-wrapper-focus') !== null) {
			return elem;
		}
	}
	if (elem.parentNode) {
		return getStyleSheetInsertionPoint(elem.parentNode);
	}
	return null;
}

/**
 *
 * Wraps content which may overflow its horizontal boundaries, providing left/right scroll buttons.
 * @slot - User provided content to wrap
 */
class ScrollWrapper extends LocalizeCoreElement(LitElement) {

	static properties = {
		/**
		 * An object containing custom primary/secondary scroll containers
		 * @type {Object}
		 */
		customScrollers: {
			attribute: false,
			type: Object
		},
		/**
		 * Whether to hide left/right scroll buttons
		 * @type {boolean}
		 */
		hideActions: {
			attribute: 'hide-actions',
			type: Boolean
		},
		/**
		 * The area in pixels to offset scroll width calculations
		 * @type {number}
		 */
		scrollAreaOffset: {
			attribute: 'scroll-area-offset',
			type: Number
		},
		_hScrollbar: {
			attribute: 'h-scrollbar',
			reflect: true,
			type: Boolean
		},
		_scrollbarLeft: {
			attribute: 'scrollbar-left',
			reflect: true,
			type: Boolean
		},
		_scrollbarRight: {
			attribute: 'scrollbar-right',
			reflect: true,
			type: Boolean
		}
	};

	static styles = css`
		:host {
			display: block;
			position: relative;
		}
		:host([hidden]) {
			display: none;
		}
		.d2l-scroll-wrapper-container {
			box-sizing: border-box;
			overflow-y: var(--d2l-scroll-wrapper-overflow-y, visible);
		}
		:host([h-scrollbar]) .d2l-scroll-wrapper-container {
			border-inline: 1px dashed var(--d2l-theme-border-color-standard);
		}
		:host([h-scrollbar][hide-actions]) .d2l-scroll-wrapper-container {
			border-inline: none;
		}
		:host([scrollbar-left]) .d2l-scroll-wrapper-container {
			border-inline-start: none;
		}
		:host([scrollbar-right]) .d2l-scroll-wrapper-container {
			border-inline-end: none;
		}

		.d2l-scroll-wrapper-button-left {
			inset-inline-start: -10px;
		}
		.d2l-scroll-wrapper-button-right {
			inset-inline-end: -10px;
		}

		.d2l-scroll-wrapper-actions {
			position: -webkit-sticky;
			position: sticky;
			top: var(--d2l-table-sticky-top, 0);
			z-index: 5;
		}

		.d2l-scroll-wrapper-button {
			background-color: var(--d2l-theme-background-color-interactive-faint-default);
			border: 1px solid var(--d2l-theme-border-color-standard);
			border-radius: 50%;
			box-shadow: var(--d2l-theme-shadow-floating);
			cursor: pointer;
			display: inline-block;
			height: 18px;
			line-height: 0;
			padding: 10px;
			position: absolute;
			top: 4px;
			width: 18px;
		}
		.d2l-scroll-wrapper-button:hover {
			background-color: var(--d2l-theme-background-color-interactive-faint-hover);
		}
		:host([scrollbar-right]) .d2l-scroll-wrapper-button-right {
			display: none;
		}
		:host([scrollbar-left]) .d2l-scroll-wrapper-button-left {
			display: none;
		}

		@media print {
			.d2l-scroll-wrapper-actions {
				display: none;
			}
			.d2l-scroll-wrapper-container {
				border: none !important;
				box-sizing: content-box !important;
				overflow: visible !important;
			}
		}
	`;

	constructor() {
		super();
		this.customScrollers = {};
		this.hideActions = false;
		this.scrollAreaOffset = 0;
		this._allScrollers = [];
		this._baseContainer = null;
		this._container = null;
		this._hScrollbar = true;

		this._resizeObserver = new ResizeObserver(() => requestAnimationFrame(() => this.checkScrollbar()));
		this._scrollbarLeft = false;
		this._scrollbarRight = false;
		this._syncDriver = null;
		this._syncDriverTimeout = null;

	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._disconnectAll();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._updateScrollTargets();
	}

	render() {
		const containerClasses = {
			'd2l-scroll-wrapper-container': true
		};
		const actionsClasses = {
			'd2l-scroll-wrapper-actions': true
		};
		const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
		const leftScrollLabel = this.localize('components.scroll-wrapper.scroll-left');
		const rightScrollLabel = this.localize('components.scroll-wrapper.scroll-right');
		const actions = !this.hideActions ? html`
			<div class="${classMap(actionsClasses)}">
				<div role="button" aria-label="${isRtl ? rightScrollLabel : leftScrollLabel}" class="d2l-scroll-wrapper-button d2l-scroll-wrapper-button-left vdiff-target" @click="${this._scrollLeft}">
					<d2l-icon icon="tier1:chevron-left"></d2l-icon>
				</div>
				<div role="button" aria-label="${isRtl ? leftScrollLabel : rightScrollLabel}" class="d2l-scroll-wrapper-button d2l-scroll-wrapper-button-right vdiff-target" @click="${this._scrollRight}">
					<d2l-icon icon="tier1:chevron-right"></d2l-icon>
				</div>
			</div>` : null;
		return html`
			${actions}
			<div class="${classMap(containerClasses)}"><slot></slot></div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('customScrollers')) this._updateScrollTargets();
		if (changedProperties.has('_hScrollbar')) this._updateTabIndex();
		if (changedProperties.has('scrollAreaOffset')) {
			this._allScrollers.forEach(element => {
				if (this.scrollAreaOffset) element.style.scrollPaddingInlineStart = `${this.scrollAreaOffset}px`;
			});
		};
	}

	checkScrollbar() {
		if (!this._container) return;
		this._hScrollbar = this._container.offsetWidth !== this._container.scrollWidth;
		this.#checkScrollThresholds();
	}

	notifyResize() {
		// legacy holdover from when this used IronResizableBehavior
		this.checkScrollbar();
	}

	scrollDistance(distance, smooth) {
		if (!this._container) return;
		if (document.documentElement.getAttribute('dir') === 'rtl') distance = distance * RTL_MULTIPLIER;
		if (this._container.scrollBy) {
			this._container.scrollBy({ left: distance, behavior: smooth ? 'smooth' : 'auto' });
		} else {
			// legacy-Edge doesn't support scrollBy
			this._container.scrollLeft = distance;
		}
	}

	#checkFocusSticky = e => {
		if (!this._container) return;
		clearTimeout(this._checkFocusStickyTimeout);
		const horizontallySticky = findComposedAncestor(e.target, element => {
			if (this._allScrollers.includes(element)) return true; // Stop search early if we hit a scroller
			if (element.nodeType !== Node.ELEMENT_NODE) return false;
			const styles = getComputedStyle(element);
			return (styles.position === 'sticky' && styles.insetInlineStart !== 'auto');
		});

		if (horizontallySticky && !(this._allScrollers.includes(horizontallySticky))) {
			this.#focusedSticky = true;
			this._checkFocusStickyTimeout = setTimeout(() => this.#focusedSticky = false, 100);
		}
	};

	#checkScrollThresholds = () => {
		if (!this._container) return;
		const lowerScrollValue = this._container.scrollWidth - this._baseContainer.offsetWidth - Math.abs(this._container.scrollLeft);
		this._scrollbarLeft = (this._container.scrollLeft === 0);
		this._scrollbarRight = (lowerScrollValue <= 0);

	};

	#focusedSticky = false;
	#lastScrollPosition = 0;
	#onScroll = (e) => {
		if (this.#focusedSticky) {
			this._allScrollers.forEach(element => {
				element.scrollLeft = this.#lastScrollPosition;
			});
		} else if (this._secondaryScrollers.length) this.#synchronizeScroll(e.target);
		if (e.target === this._container) this.#checkScrollThresholds();
		this.#lastScrollPosition = this._container.scrollLeft;
	};

	#synchronizeScroll = (target) => {
		if (this._syncDriver && target !== this._syncDriver) return;
		if (this._syncDriverTimeout) clearTimeout(this._syncDriverTimeout);

		this._syncDriver = target;
		this._allScrollers.forEach(element => {
			if (element && element !== target) element.scrollLeft = target.scrollLeft;
		});
		this._syncDriverTimeout = setTimeout(() => this._syncDriver = null, 100);
	};

	_disconnectAll() {
		this._resizeObserver?.disconnect();

		if (this._container) {
			this._container.style.removeProperty('overflow-x');
			this._container.classList.remove('d2l-scroll-wrapper-focus');
			this._container.removeAttribute('tabindex');
			this._container.removeEventListener('scroll', this.#onScroll);
			this._secondaryScrollers.forEach(element => {
				element.style.removeProperty('overflow-x');
				element.removeEventListener('scroll', this.#onScroll);
			});
		}
	}
	_getScrollDistance() {
		return Math.max((this._container.clientWidth - this.scrollAreaOffset) * SCROLL_AMOUNT, 1); // guard against offset being larger than content
	}

	_scrollLeft() {
		if (!this._container) return;
		const scrollDistance = this._getScrollDistance() * -1;
		this.scrollDistance(scrollDistance, true);
	}

	_scrollRight() {
		if (!this._container) return;
		const scrollDistance = this._getScrollDistance();
		this.scrollDistance(scrollDistance, true);
	}

	_updateScrollTargets() {
		this._disconnectAll();

		this._baseContainer = this.shadowRoot.querySelector('.d2l-scroll-wrapper-container');
		this._container = this.customScrollers?.primary || this._baseContainer;
		this._secondaryScrollers = this.customScrollers?.secondary || [];
		if (this._secondaryScrollers.length === undefined) this._secondaryScrollers = [this._secondaryScrollers];
		this._allScrollers = [this._container, ...this._secondaryScrollers];

		if (this._container) {
			this._container.classList.add('d2l-scroll-wrapper-focus');
			const styleRoot = getStyleSheetInsertionPoint(this._container);
			if (styleRoot && 'adoptedStyleSheets' in styleRoot) {
				const sheet = getFocusStyleSheet();
				if (styleRoot.adoptedStyleSheets.indexOf(sheet) === -1) {
					styleRoot.adoptedStyleSheets = [...styleRoot.adoptedStyleSheets, sheet];
				}
			}
			this._container.style.overflowX = 'auto';
			this._resizeObserver.observe(this._container);
			this._container.addEventListener('scroll', this.#onScroll);
			this._container.addEventListener('focusin', this.#checkFocusSticky);
			this._updateTabIndex();
		}

		if (this._secondaryScrollers.length) {
			this._secondaryScrollers.forEach(element => {
				element.style.overflowX = 'hidden';
				element.addEventListener('scroll', this.#onScroll);
				element.addEventListener('focusin', this.#checkFocusSticky);
			});
			this.#synchronizeScroll(this._container);
		}
	}

	_updateTabIndex() {
		if (!this._container) return;
		if (this._hScrollbar) this._container.tabIndex = 0;
		else this._container.removeAttribute('tabindex');
	}
}

customElements.define('d2l-scroll-wrapper', ScrollWrapper);

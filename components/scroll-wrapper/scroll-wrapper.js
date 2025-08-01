import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getFlag } from '../../helpers/flags.js';
import { getFocusRingStyles } from '../../helpers/focus.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';

export const printMediaQueryOnlyFlag = getFlag('GAUD-8263-scroll-wrapper-media-print', false);

const RTL_MULTIPLIER = navigator.userAgent.indexOf('Edge/') > 0 ? 1 : -1; /* legacy-Edge doesn't reverse scrolling in RTL */
const SCROLL_AMOUNT = 0.8;

// remove when cleaning up GAUD-8263-scroll-wrapper-media-print
const PRINT_MEDIA_QUERY_LIST = matchMedia('print');

let focusStyleSheet;
function getFocusStyleSheet() {
	if (!focusStyleSheet) {
		focusStyleSheet = new CSSStyleSheet();
		focusStyleSheet.replaceSync(getFocusRingStyles(
			'.d2l-scroll-wrapper-focus',
			{ extraStyles: css`box-shadow: 0 0 0 2px #ffffff, 0 2px 12px 0 rgba(0, 0, 0, 0.15);` }
		));
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
class ScrollWrapper extends LitElement {

	static get properties() {
		return {
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
			_hScrollbar: {
				attribute: 'h-scrollbar',
				reflect: true,
				type: Boolean
			},
			_printMode: { state: true },
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
	}

	static get styles() {
		return css`
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
				border-inline: 1px dashed var(--d2l-color-mica);
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
				background-color: var(--d2l-color-regolith);
				border: 1px solid var(--d2l-color-mica);
				border-radius: 50%;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
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
				background-color: var(--d2l-color-sylvite);
			}
			:host([scrollbar-right]) .d2l-scroll-wrapper-button-right {
				display: none;
			}
			:host([scrollbar-left]) .d2l-scroll-wrapper-button-left {
				display: none;
			}

			@media print {
				/* remove .print-media-query-only when cleaning up GAUD-8263-scroll-wrapper-media-print */
				.d2l-scroll-wrapper-actions.print-media-query-only {
					display: none;
				}
				/* remove .print-media-query-only when cleaning up GAUD-8263-scroll-wrapper-media-print */
				.d2l-scroll-wrapper-container.print-media-query-only {
					border: none !important;
					box-sizing: content-box !important;
					overflow: visible !important;
				}
			}

		`;
	}

	constructor() {
		super();
		this.customScrollers = {};
		this.hideActions = false;
		this._allScrollers = [];
		this._baseContainer = null;
		this._container = null;
		this._hScrollbar = true;

		// remove when cleaning up GAUD-8263-scroll-wrapper-media-print
		this._printMode = PRINT_MEDIA_QUERY_LIST.matches;

		this._resizeObserver = new ResizeObserver(() => requestAnimationFrame(() => this.checkScrollbar()));
		this._scrollbarLeft = false;
		this._scrollbarRight = false;
		this._syncDriver = null;
		this._syncDriverTimeout = null;
		this._checkScrollThresholds = this._checkScrollThresholds.bind(this);

		// remove when cleaning up GAUD-8263-scroll-wrapper-media-print
		this._handlePrintChange = this._handlePrintChange.bind(this);

		this._synchronizeScroll = this._synchronizeScroll.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();

		// remove when cleaning up GAUD-8263-scroll-wrapper-media-print
		if (!printMediaQueryOnlyFlag) {
			PRINT_MEDIA_QUERY_LIST.addEventListener?.('change', this._handlePrintChange);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._disconnectAll();

		// remove when cleaning up GAUD-8263-scroll-wrapper-media-print
		if (!printMediaQueryOnlyFlag) {
			PRINT_MEDIA_QUERY_LIST.removeEventListener?.('change', this._handlePrintChange);
		}
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._updateScrollTargets();
	}

	render() {

		// when printing, just get scroll-wrapper out of the way; remove when cleaning up GAUD-8263-scroll-wrapper-media-print
		if (this._printMode && !printMediaQueryOnlyFlag) return html`<slot></slot>`;

		const containerClasses = {
			'd2l-scroll-wrapper-container': true,
			'print-media-query-only': printMediaQueryOnlyFlag // remove when cleaning up GAUD-8263-scroll-wrapper-media-print
		};
		const actionsClasses = {
			'd2l-scroll-wrapper-actions': true,
			'print-media-query-only': printMediaQueryOnlyFlag // remove when cleaning up GAUD-8263-scroll-wrapper-media-print
		};

		const actions = !this.hideActions ? html`
			<div class="${classMap(actionsClasses)}">
				<div class="d2l-scroll-wrapper-button d2l-scroll-wrapper-button-left vdiff-target" @click="${this._scrollLeft}">
					<d2l-icon icon="tier1:chevron-left"></d2l-icon>
				</div>
				<div class="d2l-scroll-wrapper-button d2l-scroll-wrapper-button-right vdiff-target" @click="${this._scrollRight}">
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
	}

	checkScrollbar() {
		if (!this._container) return;
		this._hScrollbar = this._container.offsetWidth !== this._container.scrollWidth;
		this._checkScrollThresholds();
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

	_checkScrollThresholds() {
		if (!this._container) return;
		const lowerScrollValue = this._container.scrollWidth - this._baseContainer.offsetWidth - Math.abs(this._container.scrollLeft);
		this._scrollbarLeft = (this._container.scrollLeft === 0);
		this._scrollbarRight = (lowerScrollValue <= 0);

	}

	_disconnectAll() {
		this._resizeObserver?.disconnect();

		if (this._container) {
			this._container.style.removeProperty('overflow-x');
			this._container.classList.remove('d2l-scroll-wrapper-focus');
			this._container.removeAttribute('tabindex');
			this._container.removeEventListener('scroll', this._synchronizeScroll);
			this._container.removeEventListener('scroll', this._checkScrollThresholds);
			this._secondaryScrollers.forEach(element => {
				element.style.removeProperty('overflow-x');
				element.removeEventListener('scroll', this._synchronizeScroll);
			});
		}
	}

	// remove this handler when cleaning up GAUD-8263-scroll-wrapper-media-print
	async _handlePrintChange() {
		if (!this._printMode) {
			this._disconnectAll();
		}
		this._printMode = PRINT_MEDIA_QUERY_LIST.matches;
		if (!this._printMode) {
			await this.updateComplete;
			this._updateScrollTargets();
		}
	}

	_scrollLeft() {
		if (!this._container) return;
		const scrollDistance = this._container.clientWidth * SCROLL_AMOUNT * -1;
		this.scrollDistance(scrollDistance, true);
	}

	_scrollRight() {
		if (!this._container) return;
		const scrollDistance = this._container.clientWidth * SCROLL_AMOUNT;
		this.scrollDistance(scrollDistance, true);
	}

	_synchronizeScroll(e) {
		if (this._syncDriver && e.target !== this._syncDriver) return;
		if (this._syncDriverTimeout) clearTimeout(this._syncDriverTimeout);

		this._syncDriver = e.target;
		this._allScrollers.forEach(element => {
			if (element && element !== e.target) element.scrollLeft = e.target.scrollLeft;
		});
		this._syncDriverTimeout = setTimeout(() => this._syncDriver = null, 100);
	}

	_updateScrollTargets() {
		this._disconnectAll();

		if (this._printMode) return;

		this._baseContainer = this.shadowRoot.querySelector('.d2l-scroll-wrapper-container');
		this._container = this.customScrollers?.primary || this._baseContainer;
		this._secondaryScrollers = this.customScrollers?.secondary || [];
		if (this._secondaryScrollers.length === undefined) this._secondaryScrollers = [ this._secondaryScrollers ];
		this._allScrollers = [ this._container, ...this._secondaryScrollers ];

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
			this._container.addEventListener('scroll', this._checkScrollThresholds);
			this._updateTabIndex();
		}

		if (this._secondaryScrollers.length) {
			this._secondaryScrollers.forEach(element => {
				element.style.overflowX = 'hidden';
				element.addEventListener('scroll', this._synchronizeScroll);
			});
			this._container.addEventListener('scroll', this._synchronizeScroll);
			this._synchronizeScroll({ target: this._container });
		}
	}

	_updateTabIndex() {
		if (!this._container) return;
		if (this._hScrollbar) this._container.tabIndex = 0;
		else this._container.removeAttribute('tabindex');
	}
}

customElements.define('d2l-scroll-wrapper', ScrollWrapper);

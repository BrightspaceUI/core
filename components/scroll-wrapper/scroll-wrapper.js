import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const RTL_MULTIPLIER = navigator.userAgent.indexOf('Edge/') > 0 ? 1 : -1; /* legacy-Edge doesn't reverse scrolling in RTL */
const SCROLL_AMOUNT = 0.8;

/**
 *
 * Wraps content which may overflow its horizontal boundaries, providing left/right scroll buttons.
 * @slot - User provided content to wrap
 */
class ScrollWrapper extends FocusVisiblePolyfillMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
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
				outline: none;
				overflow-x: auto;
				overflow-y: var(--d2l-scroll-wrapper-overflow-y, auto);
			}
			.d2l-scroll-wrapper-container.focus-visible {
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine), 0 2px 12px 0 rgba(0, 0, 0, 0.15);
			}
			:host([h-scrollbar]) .d2l-scroll-wrapper-container {
				border-left: 1px dashed var(--d2l-color-mica);
				border-right: 1px dashed var(--d2l-color-mica);
			}
			:host([h-scrollbar][hide-actions]) .d2l-scroll-wrapper-container {
				border-left: none;
				border-right: none;
			}
			:host([dir="rtl"][scrollbar-right]) .d2l-scroll-wrapper-container,
			:host(:not([dir="rtl"])[scrollbar-left]) .d2l-scroll-wrapper-container {
				border-left: none;
			}
			:host([dir="rtl"][scrollbar-left]) .d2l-scroll-wrapper-container,
			:host(:not([dir="rtl"])[scrollbar-right]) .d2l-scroll-wrapper-container {
				border-right: none;
			}

			:host([dir="rtl"]) .d2l-scroll-wrapper-button-left,
			.d2l-scroll-wrapper-button-right {
				left: auto;
				right: -10px;
			}

			:host([dir="rtl"]) .d2l-scroll-wrapper-button-right,
			.d2l-scroll-wrapper-button-left {
				left: -10px;
				right: auto;
			}

			.d2l-scroll-wrapper-actions {
				position: -webkit-sticky;
				position: sticky;
				top: 0;
				z-index: 4;
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

			/* hide wrapper visuals from print view */
			@media print {
				.d2l-scroll-wrapper-actions {
					display: none;
				}
				.d2l-scroll-wrapper-container {
					overflow-x: visible;
				}
				:host([h-scrollbar]) .d2l-scroll-wrapper-container {
					border-left: none;
					border-right: none;
				}
			}
		`;
	}

	constructor() {
		super();
		this.hideActions = false;
		this._container = null;
		this._hScrollbar = true;
		this._scrollbarLeft = false;
		this._scrollbarRight = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._container = this.shadowRoot.querySelector('.d2l-scroll-wrapper-container');
		new ResizeObserver(() => requestAnimationFrame(() => this.checkScrollbar())).observe(this._container);
	}

	render() {
		const tabindex = this._hScrollbar ? '0' : undefined;
		const actions = !this.hideActions ? html`
			<div class="d2l-scroll-wrapper-actions">
				<div class="d2l-scroll-wrapper-button d2l-scroll-wrapper-button-left" @click="${this._scrollLeft}">
					<d2l-icon icon="tier1:chevron-left"></d2l-icon>
				</div>
				<div class="d2l-scroll-wrapper-button d2l-scroll-wrapper-button-right" @click="${this._scrollRight}">
					<d2l-icon icon="tier1:chevron-right"></d2l-icon>
				</div>
			</div>` : null;
		return html`
			${actions}
			<div class="d2l-scroll-wrapper-container" @scroll="${this._checkScrollThresholds}" tabindex="${ifDefined(tabindex)}"><slot></slot></div>
		`;
	}

	checkScrollbar() {
		if (!this._container) return;
		const hScrollbar = Math.abs(this._container.offsetWidth - this._container.scrollWidth);
		this._hScrollbar = (hScrollbar > 0);
		this._checkScrollThresholds();
	}

	notifyResize() {
		// legacy holdover from when this used IronResizableBehavior
		this.checkScrollbar();
	}

	scrollDistance(distance, smooth) {
		if (!this._container) return;
		if (this.dir === 'rtl') distance = distance * RTL_MULTIPLIER;
		if (this._container.scrollBy) {
			this._container.scrollBy({ left: distance, behavior: smooth ? 'smooth' : 'auto' });
		} else {
			// legacy-Edge doesn't support scrollBy
			this._container.scrollLeft = distance;
		}
	}

	_checkScrollThresholds() {
		if (!this._container) return;
		const lowerScrollValue = this._container.scrollWidth - this._container.offsetWidth - Math.abs(this._container.scrollLeft);
		this._scrollbarLeft = (this._container.scrollLeft === 0);
		this._scrollbarRight = (lowerScrollValue <= 0);

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

}

customElements.define('d2l-scroll-wrapper', ScrollWrapper);

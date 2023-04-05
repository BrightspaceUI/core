import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * A container element that provides specific layout using several slots.
 * @slot content - Slot for primary content such as title and supplementary info (no actionable elements)
 * @slot actions - Slot for buttons and dropdown openers to be placed in top right corner of header
 * @slot badge - Slot for badge content, such as a profile image or status indicator
 * @slot footer - Slot for footer content, such secondary actions
 * @slot header - Slot for header content, such as course image (no actionable elements)
 */
class Card extends FocusMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Style the card's content and footer as centered horizontally
			 * @type {boolean}
			 */
			alignCenter: { type: Boolean, attribute: 'align-center', reflect: true },
			/**
			 * Download a URL instead of navigating to it
			 * @type {boolean}
			 */
			download: { type: Boolean, reflect: true },
			/**
			 * Location for the primary action/navigation
			 * @type {string}
			 */
			href: { type: String, reflect: true },
			/**
			 * Indicates the human language of the linked resource; purely advisory, with no built-in functionality
			 * @type {string}
			 */
			hreflang: { type: String, reflect: true },
			/**
			 * Specifies the relationship of the target object to the link object
			 * @type {string}
			 */
			rel: { type: String, reflect: true },
			/**
			 * Subtle aesthetic on non-white backgrounds
			 * @type {boolean}
			 */
			subtle: { type: Boolean, reflect: true },
			/**
			 * Where to display the linked URL
			 * @type {string}
			 */
			target: { type: String, reflect: true },
			/**
			 * Accessible text for the card (will be announced when AT user focuses)
			 * @type {string}
			 */
			text: { type: String, reflect: true },
			/**
			 * Specifies the media type in the form of a MIME type for the linked URL; purely advisory, with no built-in functionality
			 * @type {string}
			 */
			type: { type: String, reflect: true },
			_active: { type: Boolean, reflect: true },
			_dropdownActionOpen: { type: Boolean, attribute: '_dropdown-action-open', reflect: true },
			_hover: { type: Boolean },
			_badgeMarginTop: { type: String },
			_footerHidden: { type: Boolean },
			_tooltipShowing: { type: Boolean, attribute: '_tooltip_showing', reflect: true }
		};
	}

	static get styles() {
		return [offscreenStyles, css`
			:host {
				background-color: #ffffff;
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 6px;
				box-sizing: border-box;
				display: inline-block;
				position: relative;
				z-index: 0;
			}
			.d2l-card-container {
				align-items: flex-start; /* required so that footer will not stretch to 100% width */
				display: flex;
				flex-direction: column;
				height: 100%;
				position: relative;
			}
			.d2l-card-link-container {
				border-radius: 6px;
				flex-basis: auto;
				flex-grow: 1;
				flex-shrink: 1;
				overflow: hidden;
				width: 100%; /* required for Legacy-Edge and FF when align-items: flex-start is specified */
			}
			.d2l-card-link-text {
				display: inline-block;
			}

			a {
				bottom: -1px;
				display: block;
				left: -1px;
				outline: none;
				position: absolute;
				right: -1px;
				top: -1px;
				z-index: 1;
			}
			:host([subtle]) a {
				bottom: 0;
				left: 0;
				right: 0;
				top: 0;
			}

			:host(:hover) a {
				bottom: -5px;
			}
			:host([subtle]:hover) a {
				bottom: -4px;
			}

			.d2l-card-content {
				padding: 1.2rem 0.8rem 0 0.8rem;
			}
			:host([align-center]) .d2l-card-content {
				text-align: center;
			}

			.d2l-card-footer-hidden .d2l-card-content {
				padding-bottom: 1.2rem;
			}
			.d2l-card-actions {
				position: absolute;
				right: 0.6rem;
				top: 0.6rem;
				/* this must be higher than footer z-index so dropdowns will be on top */
				z-index: 3;
			}
			:host([dir="rtl"]) .d2l-card-actions {
				left: 0.6rem;
				right: auto;
			}
			.d2l-card-actions ::slotted(*) {
				margin-left: 0.3rem;
			}
			:host([dir="rtl"]) .d2l-card-actions ::slotted(*) {
				margin-left: 0;
				margin-right: 0.3rem;
			}
			.d2l-card-badge {
				line-height: 0;
				padding: 0 0.8rem;
			}
			.d2l-card-footer {
				box-sizing: border-box;
				flex: none;
				padding: 1.2rem 0.8rem 0.6rem 0.8rem;
				pointer-events: none;
				width: 100%;
				z-index: 2;
			}
			:host([align-center]) .d2l-card-footer {
				text-align: center;
			}

			.d2l-card-footer ::slotted([slot="footer"]) {
				pointer-events: all;
			}

			.d2l-card-footer-hidden .d2l-card-footer {
				box-sizing: content-box;
				height: auto;
			}

			:host([subtle]) {
				border: none;
				box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.03);
			}
			:host(:hover) {
				box-shadow: 0 2px 14px 1px rgba(0, 0, 0, 0.06);
			}
			:host([subtle]:hover) {
				box-shadow: 0 4px 18px 2px rgba(0, 0, 0, 0.06);
			}
			:host([_active]) {
				border-color: transparent;
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
			}
			:host([_active]:hover),
			:host([subtle][_active]:hover) {
				border-color: transparent;
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
			}
			/* .d2l-card-link-container-hover is used to only color/underline when
			hovering the anchor; these styles are not applied when hovering actions */
			:host([href]) .d2l-card-link-container-hover,
			:host([href][_active]) .d2l-card-content {
				color: var(--d2l-color-celestine);
				text-decoration: underline;
			}
			/* this is needed to ensure tooltip is not be clipped by adjacent cards */
			:host([_tooltip_showing]) {
				z-index: 1;
			}
			/* this is needed to ensure open menu will be ontop of adjacent cards */
			:host([_dropdown-action-open]) {
				z-index: 2;
			}
			:host(:not([href])),
			:host([subtle]:not([href])) {
				box-shadow: none;
			}
			@media (prefers-reduced-motion: no-preference) {
				:host {
					transition: transform 300ms ease-out 50ms, box-shadow 0.2s;
				}

				:host(:hover),
				:host([subtle]:hover),
				:host([_active]:hover),
				:host([subtle][_active]:hover) {
					transform: translateY(-4px);
				}

				:host(:not([href])),
				:host([subtle]:not([href])) {
					transform: none;
				}
			}
		`];
	}

	constructor() {
		super();
		this.alignCenter = false;
		this.download = false;
		this.subtle = false;
		this._active = false;
		this._dropdownActionOpen = false;
		this._footerHidden = true;
		this._hover = false;
		this._tooltipShowing = false;
		this._onBadgeResize = this._onBadgeResize.bind(this);
		this._onFooterResize = this._onFooterResize.bind(this);
	}

	static get focusElementSelector() {
		return 'a';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		const badgeObserver = new ResizeObserver(this._onBadgeResize);
		badgeObserver.observe(this.shadowRoot.querySelector('.d2l-card-badge'));
		const footerObserver = new ResizeObserver(this._onFooterResize);
		footerObserver.observe(this.shadowRoot.querySelector('.d2l-card-footer'));
	}

	render() {

		const containerClass = {
			'd2l-card-container': true,
			'd2l-visible-on-ancestor-target': true,
			'd2l-card-footer-hidden': this._footerHidden
		};

		const linkContainerClass = {
			'd2l-card-link-container': true,
			'd2l-card-link-container-hover': this._hover
		};

		const badgeStyle = {};
		if (this._badgeMarginTop) badgeStyle.marginTop = this._badgeMarginTop;

		const footerClass = {
			'd2l-card-footer': true,
			'd2l-offscreen': this._footerHidden
		};

		return html`
			<div class="${classMap(containerClass)}"
				@d2l-dropdown-open="${this._onDropdownOpen}"
				@d2l-dropdown-close="${this._onDropdownClose}"
				@d2l-tooltip-show="${this._onTooltipShow}"
				@d2l-tooltip-hide="${this._onTooltipHide}">
				<a @blur="${this._onLinkBlur}"
					?download="${this.download}"
					@focus="${this._onLinkFocus}"
					href="${ifDefined(this.href ? this.href : undefined)}"
					hreflang="${ifDefined(this.hreflang)}"
					@mouseenter="${this._onLinkMouseEnter}"
					@mouseleave="${this._onLinkMouseLeave}"
					rel="${ifDefined(this.rel)}"
					target="${ifDefined(this.target)}"
					type="${ifDefined(this.type)}">
					<span class="d2l-card-link-text d2l-offscreen">${this.text}</span>
				</a>
				<div class="${classMap(linkContainerClass)}">
					<div class="d2l-card-header"><slot name="header"></slot></div>
					<div class="d2l-card-badge" style="${styleMap(badgeStyle)}"><slot name="badge"></slot></div>
					<div class="d2l-card-content"><slot name="content"></slot></div>
				</div>
				<div class="d2l-card-actions"><slot name="actions"></slot></div>
				<div class="${classMap(footerClass)}"><slot name="footer"></slot></div>
			</div>
		`;
	}

	_onBadgeResize(entries) {
		if (!entries || entries.length === 0) return;
		const entry = entries[0];
		this._badgeMarginTop = `${-0.5 * entry.contentRect.height}px`;
	}

	_onDropdownClose() {
		this._dropdownActionOpen = false;
	}

	_onDropdownOpen() {
		this._dropdownActionOpen = true;
	}

	_onFooterResize(entries) {
		if (!entries || entries.length === 0) return;
		const entry = entries[0];
		// firefox has a rounding error when calculating the height of the contentRect
		// with `box-sizing: border-box;` so check for numbers which are close to 0 as well
		this._footerHidden = (entry.contentRect.height < 1);
	}

	_onLinkBlur() {
		this._active = false;
	}

	_onLinkFocus() {
		this._active = true;
	}

	_onLinkMouseEnter() {
		this._hover = true;
	}

	_onLinkMouseLeave() {
		this._hover = false;
	}

	_onTooltipHide() {
		this._tooltipShowing = false;
	}

	_onTooltipShow() {
		this._tooltipShowing = true;
	}

}

customElements.define('d2l-card', Card);

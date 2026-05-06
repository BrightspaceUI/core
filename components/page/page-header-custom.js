import '../colors/colors.js';
import '../skip-nav/skip-nav-main.js';
import { css, html, LitElement, nothing } from 'lit';
import { getNextFocusable } from '../../helpers/focus.js';

export const isWindows = window.navigator.userAgent.indexOf('Windows') > -1;
export const isMobile = window.navigator.userAgent.indexOf('mobile') > -1;
const customScroll = isWindows && !isMobile;

/**
 * Generic page header layout component
 * @slot band - Content placed inside band
 * @slot top - Content placed inside top section of the header
 * @slot bottom - Content placed inside bottom section of the header
 */
class PageHeaderCustom extends LitElement {

	static get properties() {
		return {
			/**
			 * Whether to render a skip nav link
			 * @type {boolean}
			 */
			hasSkipNav: { type: Boolean, attribute: 'has-skip-nav', reflect: true },
			_hasBottom: { state: true }
		};
	}

	static get styles() {
		return [css`
			:host {
				background-color: white;
				display: block;
				position: relative;
			}
			:host([hidden]) {
				display: none;
			}
			.band {
				background: linear-gradient(180deg, var(--d2l-branding-primary-color, var(--d2l-color-celestine)) 1.5rem, #ffffff 0%);
				line-height: 0;
				min-height: 4px;
				position: relative; /* Needed for Firefox */
			}
			.band .padding {
				display: inline-block;
				position: unset;
				vertical-align: top;
			}
			.band-scroll {
				overflow-x: auto;
				overflow-y: hidden;
				scroll-behavior: smooth;
			}
			@media (prefers-reduced-motion: reduce) {
				.band-scroll {
					scroll-behavior: auto;
				}
			}
			.band-scroll[data-custom-scroll] {
				/* Firefox Styles */
				scrollbar-color: var(--d2l-color-galena) var(--d2l-color-sylvite);
				scrollbar-width: thin;
			}
			/* Webkit Styles */
			.band-scroll[data-custom-scroll]::-webkit-scrollbar {
				background-color: var(--d2l-color-sylvite);
				border-radius: 8px;
				height: 9px;
			}
			.band-scroll[data-custom-scroll]::-webkit-scrollbar-thumb {
				background-color: var(--d2l-color-galena);
				border-bottom: 1px solid var(--d2l-color-sylvite);
				border-radius: 8px;
				border-top: 1px solid var(--d2l-color-sylvite);
			}
			/* Faded edges styles */
			.band-scroll-before,
			.band-scroll-after {
				height: 100%;
				max-height: 1.5rem; /* should match linear-background height */
				pointer-events: none;
				position: absolute;
				top: 0;
				width: var(--d2l-page-padding, 30px);
				z-index: 2;
			}
			.band-scroll-before {
				background: linear-gradient(to right, var(--d2l-branding-primary-color, var(--d2l-color-celestine)), transparent);
				left: 0;
			}
			.band-scroll-after {
				background: linear-gradient(to left, var(--d2l-branding-primary-color, var(--d2l-color-celestine)), transparent);
				right: 0;
			}
			@media (max-width: 615px) {
				.band-scroll-before,
				.band-scroll-after {
					width: 15px;
				}
			}
			@media (min-width: 1230px) {
				.band-scroll-before,
				.band-scroll-after {
					width: 30px;
				}
			}
			.bottom,
			.top {
				border-bottom: 1px solid rgba(124, 134, 149, 0.18);
			}
			.bottom {
				background-color: var(--d2l-page-header-bottom-background-color, transparent);
			}
			.shadow {
				background-color: rgba(0, 0, 0, 0.02);
				bottom: -4px;
				height: 4px;
				pointer-events: none;
				position: absolute;
				width: 100%;
			}
			.max-width {
				margin-inline: var(--d2l-page-margin-inline, auto);
				max-width: var(--d2l-page-header-max-width, 1230px);
			}
			.padding {
				padding-inline: var(--d2l-page-padding, 30px);
			}
		`];
	}

	constructor() {
		super();
		this.hasSkipNav = false;
		this._hasBottom = false;
	}

	render() {
		return [
			this.#renderSkipNav(),
			this.#renderBand(),
			this.#renderTop(),
			this.#renderBottom(),
			html`<div class="shadow"></div>`
		];
	}

	#handleBandScrollRequest(e) {
		e.stopPropagation();
		const dir = document.documentElement.getAttribute('dir') || 'ltr';
		if (dir.toLowerCase() === 'rtl') {
			return; // We turn off this feature in RTL due to browser inconsistencies
		}

		const scroll = this.shadowRoot.querySelector('.band-scroll');
		requestAnimationFrame(() => {
			scroll.scrollLeft = e.detail.pointToCenter - 0.5 * scroll.offsetWidth;
		});
	}

	#handleBottomSlotChange(e) {
		this._hasBottom = (e.target.assignedNodes().length !== 0);
	}

	#handleSkipNavFail() {
		const nextFocusable = getNextFocusable(this.shadowRoot.querySelector('.shadow'));
		if (nextFocusable) {
			nextFocusable.focus();
		}
	}

	#renderBand() {
		return html`
			<div class="band" @d2l-page-band-slot-scroll-request="${this.#handleBandScrollRequest}">
				<div class="max-width">
					<div class="band-scroll" ?data-custom-scroll="${customScroll}">
						<div class="band-scroll-before"></div>
						<div class="band-scroll-after"></div>
						<div class="padding">
							<slot name="band"></slot>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	#renderBottom() {
		return html`
			<div class="bottom" ?hidden="${!this._hasBottom}">
				<div class="max-width">
					<div class="padding">
						<slot name="bottom" @slotchange="${this.#handleBottomSlotChange}"></slot>
					</div>
				</div>
			</div>
		`;
	}

	#renderSkipNav() {
		if (!this.hasSkipNav) return nothing;
		return html`
			<d2l-skip-nav-main @d2l-skip-nav-main-fail="${this.#handleSkipNavFail}"></d2l-skip-nav-main>
		`;
	}

	#renderTop() {
		return html`
			<div class="top">
				<div class="max-width">
					<div class="padding">
						<slot name="top"></slot>
					</div>
				</div>
			</div>
		`;
	}

}

customElements.define('d2l-page-header-custom', PageHeaderCustom);

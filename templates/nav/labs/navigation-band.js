import '../../../components/colors/colors.js';
import { centererStyles, guttersStyles } from './navigation-styles.js';
import { css, html, LitElement } from 'lit';

function useCustomScroll() {
	const userAgent = navigator.userAgent.toLowerCase();
	return (userAgent.indexOf('win') > -1 && userAgent.indexOf('mobile') === -1);
}

class NavigationBand extends LitElement {

	static get styles() {
		return [centererStyles, guttersStyles, css`
			:host {
				background: linear-gradient(180deg, var(--d2l-branding-primary-color, var(--d2l-color-celestine)) var(--d2l-labs-navigation-band-slot-height, 1.5rem), #ffffff 0%);
				display: block;
				min-height: 4px;
				position: relative; /* Needed for Firefox */
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-labs-navigation-scroll {
				overflow-x: auto;
				overflow-y: hidden;
				scroll-behavior: smooth;
			}

			.d2l-labs-navigation-scroll[data-custom-scroll] {
				/* Firefox Styles */
				scrollbar-color: var(--d2l-color-galena) var(--d2l-color-sylvite);
				scrollbar-width: thin;
			}
			/* Webkit Styles */
			.d2l-labs-navigation-scroll[data-custom-scroll]::-webkit-scrollbar {
				background-color: var(--d2l-color-sylvite);
				border-radius: 8px;
				height: 9px;
			}
			.d2l-labs-navigation-scroll[data-custom-scroll]::-webkit-scrollbar-thumb {
				background-color: var(--d2l-color-galena);
				border-bottom: 1px solid var(--d2l-color-sylvite);
				border-radius: 8px;
				border-top: 1px solid var(--d2l-color-sylvite);
			}
			/* Faded edges styles */
			.d2l-labs-navigation-scroll-before,
			.d2l-labs-navigation-scroll-after {
				height: 100%;
				max-height: var(--d2l-labs-navigation-band-slot-height, 1.5rem);
				pointer-events: none;
				position: absolute;
				top: 0;
				width: 2.439%; /* should match gutter width */
				z-index: 2;
			}
			.d2l-labs-navigation-scroll-before {
				background: linear-gradient(to right, var(--d2l-branding-primary-color, var(--d2l-color-celestine)), transparent);
				left: 0;
			}
			.d2l-labs-navigation-scroll-after {
				background: linear-gradient(to left, var(--d2l-branding-primary-color, var(--d2l-color-celestine)), transparent);
				right: 0;
			}
			/* Styles to ensure the right padding is respected when scrolling */
			.d2l-labs-navigation-centerer {
				line-height: 0;
				position: relative;
			}
			.d2l-labs-navigation-gutters {
				display: inline-block;
				position: unset;
				vertical-align: top;
			}
			@media (max-width: 615px) {
				.d2l-labs-navigation-scroll-before,
				.d2l-labs-navigation-scroll-after {
					width: 15px;
				}
			}
			@media (min-width: 1230px) {
				.d2l-labs-navigation-scroll-before,
				.d2l-labs-navigation-scroll-after {
					width: 30px;
				}
			}
		`];
	}

	constructor() {
		super();
		this._customScroll = useCustomScroll();
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-labs-navigation-band-slot-scroll-request', this._handleScrollRequest);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-labs-navigation-band-slot-scroll-request', this._handleScrollRequest);
	}

	render() {
		return html`
			<div class="d2l-labs-navigation-centerer">
				<div class="d2l-labs-navigation-scroll" ?data-custom-scroll="${this._customScroll}">
					<div class="d2l-labs-navigation-scroll-before"></div>
					<div class="d2l-labs-navigation-scroll-after"></div>
					<div class="d2l-labs-navigation-gutters">
						<slot></slot>
					</div>
				</div>
			</div>
		`;
	}

	_handleScrollRequest(e) {
		e.stopPropagation();
		const dir = document.documentElement.getAttribute('dir') || 'ltr';
		if (dir.toLowerCase() === 'rtl') {
			return; // We turn off this feature in RTL due to browser inconsistencies
		}

		const scroll = this.shadowRoot.querySelector('.d2l-labs-navigation-scroll');
		requestAnimationFrame(() => {
			scroll.scrollLeft = e.detail.pointToCenter - 0.5 * scroll.offsetWidth;
		});
	}
}

customElements.define('d2l-labs-navigation-band', NavigationBand);

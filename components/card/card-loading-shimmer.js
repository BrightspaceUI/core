import '../colors/colors.js';
import { css, html, LitElement } from 'lit';

/**
 * A card layout component for when the card header is loading.
 * @slot - Slot for header content being loaded
 */
class CardLoadingShimmer extends LitElement {

	static get properties() {
		return {
			/**
			 * Whether the header content is being loaded
			 * @type {boolean}
			 */
			loading: { type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host([hidden]) {
				display: none;
			}

			.d2l-card-loading-indicator {
				background-color: var(--d2l-color-regolith);
				border-radius: 7px 7px 0 0;
				box-shadow: inset 0 -1px 0 0 var(--d2l-color-gypsum);
				height: inherit;
				overflow: hidden;
				position: relative;
			}

			.d2l-card-loading-indicator::after {
				animation: loadingShimmer 1.5s ease-in-out infinite;
				background: linear-gradient(90deg, rgba(249, 250, 251, 0.1), rgba(114, 119, 122, 0.1), rgba(249, 250, 251, 0.1));
				background-color: var(--d2l-color-regolith);
				content: "";
				height: 100%;
				left: 0;
				position: absolute;
				top: 0;
				width: 100%;
			}

			@keyframes loadingShimmer {
				0% { transform: translate3d(-100%, 0, 0); }
				100% { transform: translate3d(100%, 0, 0); }
			}
		`;
	}

	constructor() {
		super();
		this.loading = false;
	}

	render() {
		return html`
			<div ?hidden="${!this.loading}" class="d2l-card-loading-indicator"></div>
			<div ?hidden="${this.loading}"><slot></slot></div>
		`;
	}

}

customElements.define('d2l-card-loading-shimmer', CardLoadingShimmer);

import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { SkeletonMixin, skeletonStyles } from '../skeleton/skeleton-mixin.js';

/**
 * A card layout component for when the card header is loading.
 * @slot - Slot for header content being loaded
 */
class CardLoadingShimmer extends SkeletonMixin(LitElement) {

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
		return [skeletonStyles, css`
			:host([hidden]) {
				display: none;
			}
			.d2l-skeletize {
				border-radius: 7px 7px 0 0;
				height: inherit;
				overflow: hidden;
				position: relative;
			}

			:host([skeleton]) .d2l-skeletize::before {
				box-shadow: inset 0 -1px 0 0 var(--d2l-color-gypsum);
				border-radius: 0;
			}
			:host([skeleton]) slot {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.loading = false;
	}

	render() {
		return html`
			<div class="d2l-skeletize"><slot></slot></div>
		`;
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('loading')) {
			this.skeleton = this.loading;
		}
	}

}

customElements.define('d2l-card-loading-shimmer', CardLoadingShimmer);

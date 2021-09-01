import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class CountBadge extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * The number to be displayed on the badge. If badge-type is "notification", the number will be truncated to three digits ("99+").
			 */
			number: {
				type: Number,
				reflect: true,
				attribute: 'number'
			},
			/**
			 * The size of the badge. Valid options are "small" and "large". Defaults to "small".
			 */
			badgeSize: {
				type: String,
				reflect: true,
				attribute: 'badge-size'
			},
			/**
			 * The type of the badge. Valid options are "notification" and "count". Defaults to "count".
			 */
			badgeType: {
				type: String,
				reflect: true,
				attribute: 'badge-type'
			},
		};
	}

	static get styles() {
		return [ css`
		.d2l-count-badge-number {
			font-weight: bold;
		}

		:host([badge-type="notification"]) .d2l-count-badge-number {
			color: white;
		}

		:host([badge-type="count"]) .d2l-count-badge-number {
			color: var(--d2l-color-tungsten);
		}

		:host([badge-size="small"]) .d2l-count-badge-number {
			font-size: 0.6rem;
			line-height: 0.9rem;
			padding-left: 0.3rem;
			padding-right: 0.3rem;
		}

		:host([badge-size="large"]) .d2l-count-badge-number {
			font-size: 0.8rem;
			line-height: 1.2rem;
			padding-left: 0.4rem;
			padding-right: 0.4rem;
		}

		.d2l-count-badge-background {
			border: 2px white;
			display: inline-block;
			min-width: 0.9rem;
		}

		:host([badge-size="small"]) .d2l-count-badge-background {
			border-radius: 0.45rem;
		}

		:host([badge-size="large"]) .d2l-count-badge-background {
			border-radius: 0.6rem;
		}

		:host([badge-type="notification"]) .d2l-count-badge-background {
			background: var(--d2l-color-carnelian-minus-1);
		}

		:host([badge-type="count"]) .d2l-count-badge-background {
			background: var(--d2l-color-gypsum);
		}
		`];
	}

	constructor() {
		super();
		this.number = null;
		this.type = 'count';
		this.badgeSize = 'small';
	}

	render() {
		let numberString = `${this.number}`;
		if (this.badgeType === 'notification' && this.number > 99) {
			// truncate to 2 digits for notification type only
			numberString = '99+';
		}
		return html`
		<div class="d2l-count-badge-background">
        	<div class="d2l-count-badge-number">
				${numberString}
			</div>
		<div>`;
	}
}

customElements.define('d2l-count-badge', CountBadge);

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
			size: {
				type: String,
				reflect: true,
				attribute: 'size'
			},
			/**
			 * The type of the badge. Valid options are "notification" and "count". Defaults to "count".
			 */
			type: {
				type: String,
				reflect: true,
				attribute: 'type'
			},
			/**
			 * For "count" type badge, optionally specify a digit limit, after which numbers are truncated. Defaults to no limit.
			 */
			digitLimit: {
				type: Number,
				reflect: true,
				attribute: 'digit-limit'
			},
			/**
			 * Optionally choose to not render the count badge when the number is zero. Defaults to false.
			 */
			noRenderZero: {
				type: Boolean,
				reflect: true,
				attribute: 'no-render-zero'
			},
		};
	}

	static get styles() {
		return [ css`
		.d2l-count-badge-number {
			font-weight: bold;
		}

		:host([type="notification"]) .d2l-count-badge-number {
			color: white;
		}

		:host([type="count"]) .d2l-count-badge-number {
			color: var(--d2l-color-tungsten);
		}

		:host([size="small"]) .d2l-count-badge-number {
			font-size: 0.6rem;
			line-height: 0.9rem;
			padding-left: 0.3rem;
			padding-right: 0.3rem;
		}

		:host([size="large"]) .d2l-count-badge-number {
			font-size: 0.8rem;
			line-height: 1.2rem;
			padding-left: 0.4rem;
			padding-right: 0.4rem;
		}

		:host {
			border: 2px white;
			display: inline-block;
			min-width: 0.9rem;
		}

		:host([size="small"]) {
			border-radius: 0.45rem;
		}

		:host([size="large"]) {
			border-radius: 0.6rem;
		}

		:host([type="notification"]) {
			background-color: var(--d2l-color-carnelian-minus-1);
		}

		:host([type="count"]) {
			background-color: var(--d2l-color-gypsum);
		}
		`];
	}

	constructor() {
		super();
		this.type = 'count';
		this.size = 'small';
		this.noRenderZero = false;
	}

	render() {
		let numberString = `${this.number}`;
		if (this.noRenderZero && this.number === 0) {
			numberString = '';
		}
		if (this.type === 'notification' && this.number > 99) {
			// truncate to 2 digits for notification type only
			numberString = '99+';
		} else if (this.type === 'count' && this.digitLimit && this.number.toString().length > this.digitLimit) {
			// truncate to digitLimit if provided for count type only
			numberString = `${'9'.repeat(this.digitLimit)}+`;
		}
		return html`
        	<div class="d2l-count-badge-number">${numberString}</div>`;
	}
}

customElements.define('d2l-count-badge', CountBadge);

import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class CountBadge extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * The number to be displayed on the badge. Must be a positive integer.
			 * @type {number}
			 */
			number: {
				type: Number,
				reflect: true,
				attribute: 'number'
			},
			/**
			 * The size of the badge. Defaults to "small".
			 * @type {'small'|'large'}
			 */
			size: {
				type: String,
				reflect: true,
				attribute: 'size'
			},
			/**
			 * The type of the badge. Defaults to "count".
			 * @type {'count'|'notification'}
			 */
			type: {
				type: String,
				reflect: true,
				attribute: 'type'
			},
			/**
			 * Optionally specify a digit limit, after which numbers are truncated. Defaults to two for "notification" type and no limit for "count" type.
			 * @type {number}
			 */
			maxDigits: {
				type: Number,
				reflect: true,
				attribute: 'max-digits'
			},
			/**
			 * Optionally choose to not render the count badge when the number is zero. Defaults to false.
			 * @type {boolean}
			 */
			hideZero: {
				type: Boolean,
				reflect: true,
				attribute: 'hide-zero'
			},
			/**
			 * Optionally add a description that will show as an aria-label on the badge.
			 * @type {string}
			 */
			description: {
				type: String,
				reflect: true,
				attribute: 'description'
			},
			/**
			 * Optionally choose to add a tab stop to the badge. Defaults to false.
			 * @type {boolean}
			 */
			tabStop: {
				type: Boolean,
				reflect: true,
				attribute: 'tab-stop'
			},
		};
	}

	static get styles() {
		return [ css`
		:host([hidden]) {
			display: none;
		}

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
		this.hideZero = false;
		this.description = '';
		this.tabStop = false;
	}

	connectedCallback() {
		super.connectedCallback();
		if (!this.maxDigits && this.type === 'notification') {
			// default to two digits for notification type
			this.maxDigits = 2;
		}
	}

	render() {
		let numberString = `${this.number}`;
		if (this.hideZero && this.number === 0) {
			numberString = '';
		}
		if (this.maxDigits && this.number.toString().length > this.maxDigits) {
			numberString = `${'9'.repeat(this.maxDigits)}+`;
		}
		return html`
        	<div class="d2l-count-badge-number" tabindex="${this.tabStop ? '0' : '-1'}"  aria-live="polite" aria-label="${this.description}">${numberString}</div>`;
	}
}

customElements.define('d2l-count-badge', CountBadge);

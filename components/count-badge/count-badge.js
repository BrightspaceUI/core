import '../colors/colors.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class CountBadge extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Optionally choose to announce changes to the badge with an aria-live region. If the number property is changed, the text will be read by screenreaders. Defaults to false.
			 * @type {boolean}
			 */
			announceChanges: {
				type: Boolean,
				attribute: 'announce-changes'
			},
			/**
			 * Optionally add a tooltip on the badge. Defaults to false.
			 * @type {boolean}
			 */
			hasTooltip: {
				type: Boolean,
				attribute: 'has-tooltip'
			},
			/**
			 * Optionally choose to not render the count badge when the number is zero. Defaults to false.
			 * @type {boolean}
			 */
			hideZero: {
				type: Boolean,
				attribute: 'hide-zero'
			},
			/**
			 * Optionally specify an icon string to appear with the badge.
			 * @type {string}
			 */
			icon: {
				type: String,
				reflect: true
			},
			/**
			 * Optionally specify a size for the height/width of the icon.
			 * @type {string}
			 */
			iconSize: {
				type: Number,
				attribute: 'icon-size'
			},
			/**
			 * Optionally specify a digit limit, after which numbers are truncated. Defaults to two for "notification" type and no limit for "count" type.
			 * @type {number}
			 */
			maxDigits: {
				type: Number,
				attribute: 'max-digits'
			},
			/**
			 * The number to be displayed on the badge. Must be a positive integer.
			 * @type {number}
			 */
			number: {
				type: Number,
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
			 * Optionally choose to add a tab stop to the badge. Defaults to false.
			 * @type {boolean}
			 */
			tabStop: {
				type: Boolean,
				attribute: 'tab-stop'
			},
			/**
			 * * Descriptive text for the badge which will act as an accessible label and tooltip text when tooltips are enabled.
			 * @type {string}
			 */
			text: {
				type: String
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
			_forceTooltipOn: {
				type: Boolean,
				attribute: 'tooltip-on'
			}
		};
	}

	static get styles() {
		return [offscreenStyles, css`
		:host([hidden]) {
			display: none;
		}
		.d2l-count-badge-number {
			font-weight: bold;
		}
		:host([type="notification"]) .d2l-count-badge-number {
			background-color: var(--d2l-color-carnelian-minus-1);
			color: white;
		}
		:host([type="count"]) .d2l-count-badge-number {
			background-color: var(--d2l-color-gypsum);
			color: var(--d2l-color-tungsten);
		}
		:host([size="small"]) .d2l-count-badge-number {
			border-radius: 0.55rem;
			font-size: 0.6rem;
			line-height: 0.9rem;
			padding-left: 0.3rem;
			padding-right: 0.3rem;
		}
		:host([size="large"]) .d2l-count-badge-number {
			border-radius: 0.7rem;
			font-size: 0.8rem;
			line-height: 1.2rem;
			padding-left: 0.4rem;
			padding-right: 0.4rem;
		}
		:host .d2l-count-badge-number {
			border: 2px solid white;
		}
		:host {
			display: inline-block;
			min-width: 0.9rem;
		}
		:host([icon]) d2l-icon {
			margin-top: -1.4rem;
		}
		:host([size="small"]) .d2l-count-badge-wrapper {
			border-radius: 0.65rem;
			outline: none;
		}
		:host([size="large"]) .d2l-count-badge-wrapper {
			border-radius: 0.8rem;
			outline: none;
		}
		:host(.focus-visible) .d2l-count-badge-wrapper,
		.d2l-count-badge-wrapper.focus-visible {
			box-shadow: 0 0 0 2px var(--d2l-color-celestine);
		}
		:host(.focus-visible[icon]) .d2l-count-badge-wrapper,
		:host([icon]) .d2l-count-badge-wrapper.focus-visible {
			box-shadow: none;
		}
		:host(.focus-visible[icon]) d2l-icon,
		.d2l-count-badge-wrapper.focus-visible d2l-icon {
			color: var(--d2l-color-celestine);
		}
		:host([icon]) .d2l-count-badge-wrapper {
			padding-left: 2px;
			padding-right: 14px;
		}
		:host([icon]) d2l-tooltip[_open-dir="top"] {
			margin-top: -0.6rem;
		}
		:host([size="small"][icon^="tier1"]) .d2l-count-badge-wrapper {
			max-height: 1.7rem;
		}
		:host([size="small"][icon^="tier2"]) .d2l-count-badge-wrapper {
			max-height: 1.8rem;
		}
		:host([size="small"][icon^="tier3"]) .d2l-count-badge-wrapper {
			max-height: 2rem;
		}
		:host([size="large"][icon^="tier1"]) .d2l-count-badge-wrapper {
			max-height: 2.1rem;
		}
		:host([size="large"][icon^="tier2"]) .d2l-count-badge-wrapper {
			max-height: 2.2rem;
		}
		:host([size="large"][icon^="tier3"]) .d2l-count-badge-wrapper {
			max-height: 2.4rem;
		}
		:host([icon]) .d2l-count-badge-number {
			left: 0.6rem;
			position: relative;
		}
		:host([icon-highlight]) d2l-icon {
			color: var(--d2l-color-celestine);
		}
		`];
	}

	constructor() {
		super();
		this.announceChanges = false;
		this.hasTooltip = false;
		this.hideZero = false;
		this.size = 'small';
		this.tabStop = false;
		this.text = '';
		this.type = 'count';

		this._badgeId = getUniqueId();
		this._forceTooltipOn = false;
		this._textId = getUniqueId();
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
		const iconSizeStyle = {};
		if (this.icon && this.iconSize) {
			iconSizeStyle.height = `${this.iconSize}px`;
			iconSizeStyle.width = `${this.iconSize}px`;
		}
		return html`
		<div class="d2l-count-badge-wrapper"
		@blur="${this._onBlur}"
		@focus="${this._onFocus}"
		id="${ifDefined(this.icon ? undefined : this._badgeId)}"
		aria-labelledby="${ifDefined(this.hasTooltip ? undefined : this._textId)}"
		tabindex="${ifDefined(this.tabStop || this.hasTooltip ? '0' : undefined)}" >
        	<div class="d2l-count-badge-number">
					<div aria-hidden="true">${numberString}</div>		
			</div>
			${this.icon ? html`<div class="d2l-icon-wrapper"><d2l-icon role="presentation" id="${this._badgeId}" icon="${ifDefined(this.icon)}" class="d2l-button-icon" style=${styleMap(iconSizeStyle)}></d2l-icon></div>` : null }
			${this.hasTooltip ? html`<d2l-tooltip id="${this._textId}" ?force-show="${this._forceTooltipOn}" aria-live="${this.announceChanges ? 'polite' : 'off'}" for="${this._badgeId}">${this.text}</d2l-tooltip>` :  html`<span id="${this._textId}" aria-live="${this.announceChanges ? 'polite' : 'off'}" class="d2l-offscreen">"${this.text}"</span>`}
			${this.icon ? html`</div>` : null }
		<div>
			`;
	}

	_onBlur() {
		this._forceTooltipOn = false;
	}

	_onFocus() {
		this._forceTooltipOn = true;
	}
}

customElements.define('d2l-count-badge', CountBadge);

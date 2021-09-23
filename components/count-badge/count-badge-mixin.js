import '../colors/colors.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map';

export const countBadgeStyles = css`
:host([hidden]) {
	display: none;
}

:host {
	display: inline-block;
	min-width: 0.9rem;
}

.d2l-count-badge-number {
	border: 2px solid white;
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

:host([size="small"]) .d2l-count-badge-wrapper {
	border-radius: 0.65rem;
	outline: none;
}

:host([size="large"]) .d2l-count-badge-wrapper {
	border-radius: 0.8rem;
	outline: none;
}
`;

export const CountBadgeMixin = superclass => class extends RtlMixin(superclass) {

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
			}
		};
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
		this._textId = getUniqueId();
	}

	connectedCallback() {
		super.connectedCallback();
		if (!this.maxDigits && this.type === 'notification') {
			// default to two digits for notification type
			this.maxDigits = 2;
		}
	}

	renderCount(tooltipElement, forceTooltipOn) {
		let numberString = `${this.number}`;
		const hideNumber = this.hideZero && this.number === 0;
		if (hideNumber) {
			numberString = '';
		}
		const wrapperVisibility = {
			visibility: hideNumber && !tooltipElement ? 'hidden' : 'visible'
		};
		const numberVisibility = {
			visibility: hideNumber ? 'hidden' : 'visible'
		};
		if (this.maxDigits && this.number.toString().length > this.maxDigits) {
			numberString = `${'9'.repeat(this.maxDigits)}+`;
		}
		const tooltipShowing = this.hasTooltip && (this.shadowRoot.querySelector('d2l-tooltip')?.showing || forceTooltipOn);
		return html`
			<div 
			class="d2l-count-badge-wrapper"
			style=${styleMap(wrapperVisibility)}
			id="${ifDefined(tooltipElement ? undefined : this._badgeId)}"
			tabindex="${ifDefined(this.tabStop || this.hasTooltip ? '0' : undefined)}" 
			aria-labelledby="${ifDefined(this.hasTooltip ? undefined : this._textId)}">
				<div class="d2l-count-badge-number"
				style=${styleMap(numberVisibility)}>
						<div aria-hidden="true">${numberString}</div>		
				</div>
				${tooltipElement}
				${ifDefined(this.hasTooltip  ?
		html`<d2l-tooltip id="${this._textId}" ?force-show="${forceTooltipOn}" aria-live="${this.announceChanges ? 'polite' : 'off'}" for="${this._badgeId}">${this.text}</d2l-tooltip>`
		: undefined) } 
		${ ifDefined(!tooltipShowing ? html`<span id="${this._textId}" aria-live="${this.announceChanges ? 'polite' : 'off'}" class="d2l-offscreen">"${this.text}"</span>` : undefined)}
			</div>
			`;
	}
};

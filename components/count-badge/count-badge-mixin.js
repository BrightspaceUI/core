import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html } from 'lit';
import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const maxBadgeDigits = 5;

/**
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} LitElementConstructor
 * @typedef {LitElementConstructor & Pick<typeof import('lit').LitElement, keyof typeof import('lit').LitElement>} LitElementClassType
 */

/**
 * @template {LitElementClassType} S
 * @param {S} superclass
 */
export const CountBadgeMixin = superclass => class extends LocalizeCoreElement(SkeletonMixin(RtlMixin(superclass))) {

	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: When `true`, changes to the badge will be announced to screen reader users
			 * @type {boolean}
			 */
			announceChanges: {
				type: Boolean,
				attribute: 'announce-changes'
			},
			/**
			 * Forces the focus ring around the badge
			 * @type {boolean}
			 */
			forceFocusRing: {
				type: Boolean,
				attribute: 'focus-ring',
				reflect: true
			},
			/**
			 * ACCESSIBILITY: Adds a tooltip on the badge, which will be visible on hover and keyboard interaction
			 * @type {boolean}
			 */
			hasTooltip: {
				type: Boolean,
				attribute: 'has-tooltip'
			},
			/**
			 * Hides the count badge when `number` is zero
			 * @type {boolean}
			 */
			hideZero: {
				type: Boolean,
				attribute: 'hide-zero'
			},
			/**
			 * Specifies a digit limit, after which numbers are truncated. Defaults to two for "notification" type and five for "count" type.
			 * @type {number}
			 */
			maxDigits: {
				type: Number,
				attribute: 'max-digits'
			},
			/**
			 * REQUIRED: The number to be displayed on the badge; must be a positive integer
			 * @type {number}
			 */
			number: {
				type: Number,
				attribute: 'number'
			},
			/**
			 * The size of the badge
			 * @type {'small'|'large'}
			 */
			size: {
				type: String,
				reflect: true,
				attribute: 'size'
			},
			/**
			 * ACCESSIBILITY: Adds a tab stop to the badge, which allows screen reader and keyboard users to easily tab to the badge
			 * @type {boolean}
			 */
			tabStop: {
				type: Boolean,
				attribute: 'tab-stop'
			},
			/**
			 * ACCESSIBILITY: REQUIRED: Descriptive text for the badge which will act as an accessible label and tooltip text when tooltips are enabled
			 * @type {string}
			 */
			text: {
				type: String
			},
			/**
			 * The type of the badge
			 * @type {'count'|'notification'}
			 */
			type: {
				type: String,
				reflect: true,
				attribute: 'type'
			}
		};
	}

	static get styles() {
		return [super.styles, offscreenStyles, css`
			:host([hidden]) {
				display: none;
			}

			:host {
				display: inline-block;
				min-width: 0.9rem;
			}

			.d2l-count-badge-number {
				font-weight: bold;
			}

			:host([type="notification"]) .d2l-count-badge-number {
				background-color: var(--d2l-color-carnelian-minus-1);
				color: white;
			}

			:host([type="count"]) .d2l-count-badge-number {
				background-color: var(--d2l-count-badge-background-color, var(--d2l-color-gypsum));
				color: var(--d2l-count-badge-foreground-color, var(--d2l-color-ferrite));
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
		`];
	}

	constructor(...args) {
		super(...args);
		this.announceChanges = false;
		this.forceFocusRing = false;
		this.hasTooltip = false;
		this.hideZero = false;
		this.size = 'small';
		this.tabStop = false;
		this.text = '';
		this.type = 'count';
		this._labelId = getUniqueId();
	}

	connectedCallback() {
		super.connectedCallback();
		if (!this.maxDigits) {
			// default to two digits for notification type, 5 for count
			this.maxDigits = this.type === 'notification' ? 2 : maxBadgeDigits;
		} else if (this.maxDigits > maxBadgeDigits) {
			// limit all badges to 5 digits
			this.maxDigits = maxBadgeDigits;
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.get('maxDigits') && this.maxDigits > maxBadgeDigits) {
			// impose a 5 digit maximum to prevent overflows
			this.maxDigits = maxBadgeDigits;
		}
	}

	getAriaLabelId() {
		return this.hasTooltip ? undefined : this._labelId;
	}

	getNumberString() {
		let numberString = `${this.number}`;
		if (this.maxDigits && this.number.toString().length > this.maxDigits) {
			numberString = `${'9'.repeat(this.maxDigits)}`;
			numberString = formatNumber(parseInt(numberString));
			numberString = this.localize('components.count-badge.plus', { number: numberString });
		} else {
			numberString = formatNumber(numberString);
		}

		return numberString;
	}

	renderCount(numberStyles) {
		const hideNumber = this.hideZero && this.number === 0;
		if (!numberStyles || numberStyles.visibility !== 'hidden') {
			numberStyles = {
				...numberStyles,
				visibility: hideNumber ? 'hidden' : 'visible'
			};
		}
		return html`
			<div class="d2l-count-badge-number" style=${styleMap(numberStyles)}>
					<div aria-hidden="true">${this.getNumberString()}</div>
			</div>
		`;
	}

	renderTooltips(innerHtml, badgeId) {
		return html`
		<div id="${this._labelId}"
			aria-label="${this.text}"
			aria-atomic="true"
			aria-live="${this.announceChanges ? 'polite' : 'off'}">
			${innerHtml}
		</div>
		${this.hasTooltip && !this.skeleton ? html`<d2l-tooltip class="vdiff-target" for="${badgeId}" for-type="label">${this.text}</d2l-tooltip>` : null}
		`;
	}
};

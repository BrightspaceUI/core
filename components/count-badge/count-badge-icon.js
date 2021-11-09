import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { CountBadgeMixin } from './count-badge-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

class CountBadgeIcon extends CountBadgeMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Preset icon key (e.g. "tier1:gear")
			 * @type {string}
			 */
			icon: {
				type: String,
				reflect: true
			}
		};
	}

	static get styles() {
		return [super.styles, css`
		:host(.focus-visible) d2l-icon,
		:host([focus-ring]) d2l-icon,
		d2l-icon.focus-visible {
			box-shadow: 0 0 0 2px var(--d2l-color-celestine);
			outline: none;
		}

		.d2l-count-badge-wrapper {
			display: inline-block;
		}

		.d2l-count-badge-number-wrapper {
			position: absolute;
			width: max-content;
		}

		:host {
			display: inline-block;
			position: relative;
			padding-left: 0.5rem;
			padding-right: var(--d2l-count-badge-icon-horizontal-padding);
		}

		:host([dir="rtl"]) {
			padding-left: var(--d2l-count-badge-icon-horizontal-padding);
			padding-right: 0.5rem;
		}

		:host([size="large"]) {
			--d2l-count-badge-icon-padding: calc(var(--d2l-count-badge-icon-height) - 0.7rem);
			margin-top: -0.7rem;
			padding-top: 0.7rem;
			padding-bottom: 0.7rem;
		}

		:host([size="small"]) {
			--d2l-count-badge-icon-padding: calc(var(--d2l-count-badge-icon-height) - 0.55rem);
			margin-top: -0.55rem;
			padding-top: 0.35rem;
			padding-bottom: 0.35rem;
		}

		:host([icon*="tier1:"]) {
			--d2l-count-badge-icon-height: 18px;
		}
		:host([icon*="tier2:"]) {
			--d2l-count-badge-icon-height: 24px;
		}
		:host([icon*="tier3:"]) {
			--d2l-count-badge-icon-height: 30px;
		}

		d2l-tooltip[_open-dir="top"] {
			margin-top: -0.6rem;
		}

		d2l-icon {
			border: 2px solid transparent;
			border-radius: 6px;
		}
		`];
	}

	constructor() {
		super();
		this._badgeId = getUniqueId();
	}

	render() {
		const numberPadding = this.size === 'small' ? '-0.65rem' : '-0.7rem';
		const numberStyles = {
			border: '2px solid white',
			position: 'relative',
			left: this.dir === 'rtl' ? 0 : 'var(--d2l-count-badge-icon-padding)',
			right: this.dir === 'rtl' ? 'var(--d2l-count-badge-icon-padding)' : 0,
			top: numberPadding,
			visibility: this.skeleton ? 'hidden' : undefined,
			display: 'inline-block'
		};

		let horizontalPadding = '0.5rem';
		const excessDigits = this.getNumberString().length - 4;
		// large number strings could overflow onto the next badge,
		// update padding in this case
		if (excessDigits >= 0) {
			const extraRem = excessDigits / 2;
			horizontalPadding = `calc(0.5rem + ${extraRem}rem)`;
		}
		this.style.setProperty('--d2l-count-badge-icon-horizontal-padding', `${horizontalPadding}`);
		const tabbable = (this.tabStop || this.hasTooltip) && !this.skeleton;
		const innerHtml = html`
			<div class="d2l-count-badge-number-wrapper">
				${this.renderCount(numberStyles)}
			</div>
			<div class="d2l-skeletize d2l-count-badge-wrapper">
				<d2l-icon id="${this._badgeId}"
					icon="${this.icon}" 
					tabindex="${ifDefined(tabbable ? '0' : undefined)}" 
					aria-labelledby="${ifDefined(this.getAriaLabelId())}"
					role="img">
				</d2l-icon>
			</div>
		`;
		return this.renderTooltips(innerHtml, this._badgeId);
	}
}

customElements.define('d2l-count-badge-icon', CountBadgeIcon);

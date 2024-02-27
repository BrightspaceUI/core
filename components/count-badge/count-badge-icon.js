import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { CountBadgeMixin } from './count-badge-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';

class CountBadgeIcon extends FocusMixin(CountBadgeMixin(LitElement)) {

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
		:host([focus-ring]) d2l-icon,
		:host(:${unsafeCSS(getFocusPseudoClass())}) d2l-icon,
		d2l-icon:${unsafeCSS(getFocusPseudoClass())} {
			box-shadow: 0 0 0 2px var(--d2l-color-celestine);
			outline: none;
		}

		:host {
			/* for long numbers, center the number on the icon */
			--d2l-count-badge-icon-padding: calc(-50% + (var(--d2l-count-badge-icon-height) / 2) + 2px);
			display: inline-block;
			/* symmetrical padding to prevent overflows for most numbers */
			padding-left: 0.5rem;
			padding-right: 0.5rem;
			position: relative;
		}

		:host([size="large"]) {
			--d2l-count-badge-icon-padding-top: 0.7rem;
			padding-top: var(--d2l-count-badge-icon-padding-top);
		}

		:host([size="small"]) {
			--d2l-count-badge-icon-padding-top: 0.55rem;
			padding-top: var(--d2l-count-badge-icon-padding-top);
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
			margin-top: calc(0px - var(--d2l-count-badge-icon-padding-top));
		}

		d2l-icon {
			border: 2px solid transparent;
			border-radius: 6px;
			position: relative;
		}
		`];
	}

	constructor() {
		super();
		this._badgeId = getUniqueId();
	}

	static get focusElementSelector() {
		return 'd2l-icon';
	}

	render() {
		let numberStyles = {
			border: '2px solid white',
			position: 'absolute',
			visibility: this.skeleton ? 'hidden' : undefined,
		};

		// center long number strings to prevent overflow
		const centerNumber = this.getNumberString().length >= 4;

		if (centerNumber) {
			const xPadding = 'var(--d2l-count-badge-icon-padding)';
			numberStyles = {
				... numberStyles,
				transform: this.dir === 'rtl'
					? `translateY(-50%) translateX(calc(0px - ${xPadding}))`
					: `translateY(-50%) translateX(${xPadding})`
			};
		} else {
			numberStyles = {
				... numberStyles,
				[this.dir === 'rtl' ? 'left' : 'right'] : '-0.1rem',
				transform: 'translateY(-50%)'
			};
		}
		const tabbable = (this.tabStop || this.hasTooltip) && !this.skeleton;
		const innerHtml = html`
			${this.renderCount(numberStyles)}
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

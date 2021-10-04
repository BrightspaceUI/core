import '../colors/colors.js';
import '../icons/icon.js';
import { CountBadgeMixin, countBadgeStyles } from './count-badge-mixin.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
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
		return [countBadgeStyles, css`
		:host(.focus-visible) d2l-icon,
		d2l-icon.focus-visible {
			box-shadow: 0 0 0 2px var(--d2l-color-celestine);
			outline: none;
		}

		:host {
			padding-right: var(--d2l-count-badge-icon-padding);
		}

		:host([dir="rtl"]) {
			padding-left: var(--d2l-count-badge-icon-padding);
			padding-right: 0;
		}

		:host([size="large"]) {
			--d2l-count-badge-icon-padding: calc(var(--d2l-count-badge-icon-height) - 0.7rem);
			margin-top: -0.7rem;
		}

		:host([size="small"]) {
			--d2l-count-badge-icon-padding: calc(var(--d2l-count-badge-icon-height) - 0.55rem);
			margin-top: -0.55rem;
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
		const numberPadding = this.size === 'small' ? '0.55rem' : '0.7rem';
		const numberStyles = {
			position: 'relative',
			left: this.dir === 'rtl' ? 0 : 'var(--d2l-count-badge-icon-padding)',
			right: this.dir === 'rtl' ? 'var(--d2l-count-badge-icon-padding)' : 0,
			top: numberPadding
		};
		return html`
			${this.renderCount(numberStyles)}
			${this.renderTooltips(this._badgeId)}
			<d2l-icon 
				id="${this._badgeId}"
				icon="${this.icon}" 
				tabindex="${ifDefined((this.tabStop || this.hasTooltip) ? '0' : undefined)}" 
				aria-labelledby="${ifDefined(this.getOffscreenId())}"
				role="img">
			</d2l-icon>`;
	}
}

customElements.define('d2l-count-badge-icon', CountBadgeIcon);

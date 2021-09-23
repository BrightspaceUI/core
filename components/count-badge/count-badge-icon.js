import '../colors/colors.js';
import '../icons/icon.js';
import { CountBadgeMixin, countBadgeStyles } from './count-badge-mixin.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map';

class CountBadgeIcon extends CountBadgeMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * The icon string to appear with the badge.
			 * @type {string}
			 */
			icon: {
				type: String,
				reflect: true
			},
			forceTooltipOn: {
				type: Boolean
			},
		};
	}

	static get styles() {
		return [offscreenStyles, countBadgeStyles, css`
		:host(.focus-visible) d2l-icon,
		.d2l-count-badge-wrapper.focus-visible d2l-icon {
			color: var(--d2l-color-celestine);
		}

		.d2l-count-badge-number {
			position: relative;
		}

		.d2l-count-badge-wrapper {
			padding-left: 2px;
			padding-right: 14px;
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

		:host([size="small"][icon^="tier1"]) .d2l-count-badge-number {
			left: 0.35rem;
		}
		:host([size="small"][icon^="tier2"]) .d2l-count-badge-number {
			left: 0.65rem;
		}
		:host([size="small"][icon^="tier3"]) .d2l-count-badge-number {
			left: 0.95rem;
		}
		:host([size="large"][icon^="tier1"]) .d2l-count-badge-number {
			left: 0.2rem;
		}
		:host([size="large"][icon^="tier2"]) .d2l-count-badge-number {
			left: 0.5rem;
		}
		:host([size="large"][icon^="tier3"]) .d2l-count-badge-number {
			left: 0.8rem;
		}

		:host([size="small"][icon^="tier1"]) d2l-icon {
			margin-top: -1.8rem;
		}
		:host([size="small"][icon^="tier2"]) d2l-icon {
			margin-top: -1.5rem;
		}
		:host([size="small"][icon^="tier3"]) d2l-icon {
			margin-top: -1.2rem;
		}
		:host([size="large"][icon^="tier1"]) d2l-icon {
			margin-top: -2.1rem;
		}
		:host([size="large"][icon^="tier2"]) d2l-icon {
			margin-top: -1.9rem;
		}
		:host([size="large"][icon^="tier3"]) d2l-icon {
			margin-top: -1.6rem;
		}
		d2l-tooltip[_open-dir="top"] {
			margin-top: -0.6rem;
		}
		`];
	}

	constructor() {
		super();
		this.forceTooltipOn = false;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('blur', this._onBlur);
		this.removeEventListener('focus', this._onFocus);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('blur', this._onBlur);
		this.addEventListener('focus', this._onFocus);
	}

	render() {
		const iconStyle = {
			visibility: 'visible'
		};
		const icon = html`<d2l-icon id="${this._badgeId}" icon="${this.icon}" class="d2l-button-icon" style=${styleMap(iconStyle)}></d2l-icon>`;
		return this.renderCount(icon, this.forceTooltipOn);
	}

	_onBlur() {
		this.forceTooltipOn = false;
	}

	async _onFocus() {
		this.forceTooltipOn = true;
	}
}

customElements.define('d2l-count-badge-icon', CountBadgeIcon);

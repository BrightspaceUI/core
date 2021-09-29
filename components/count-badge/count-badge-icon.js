import '../colors/colors.js';
import '../icons/icon.js';
import { CountBadgeMixin, countBadgeStyles } from './count-badge-mixin.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
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
			_forceTooltipOn: {
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

		:host([size="small"]) .d2l-count-badge-number {
			left: calc(var(--d2l-count-badge-icon-height) - 0.55rem);
			top: 0.55rem;
		}
		:host([size="large"]) .d2l-count-badge-number {
			left: calc(var(--d2l-count-badge-icon-height) - 0.7rem);
			top: 0.7rem;
		}
		:host([icon^="tier1:"]) {
			--d2l-count-badge-icon-height: 18px;
		}
		:host([icon^="tier2:"]) {
			--d2l-count-badge-icon-height: 24px;
		}
		:host([icon^="tier3:"]) {
			--d2l-count-badge-icon-height: 30px;
		}
		:host([icon]) d2l-tooltip[_open-dir="top"] {
			margin-top: -0.6rem;
		}
		`];
	}

	constructor() {
		super();
		this._forceTooltipOn = false;
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
		const icon = html`
			<d2l-icon 
				id="${this._badgeId}"
				icon="${this.icon}" 
				class="d2l-button-icon"
				role="${ifDefined(this.hasTooltip ? 'img' : undefined)}">
			</d2l-icon>`;
		return this.renderCount(icon, this._forceTooltipOn);
	}

	_onBlur() {
		this._forceTooltipOn = false;
	}

	_onFocus() {
		this._forceTooltipOn = true;
	}
}

customElements.define('d2l-count-badge-icon', CountBadgeIcon);

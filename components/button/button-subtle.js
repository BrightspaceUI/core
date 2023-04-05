import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { ButtonMixin } from './button-mixin.js';
import { buttonStyles } from './button-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { labelStyles } from '../typography/styles.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * A button component that can be used just like the native button, but for advanced or de-emphasized actions.
 * @slot - Default content placed inside of the button
 */
class ButtonSubtle extends ButtonMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * A description to be added to the button for accessibility when text on button does not provide enough context
			 * @type {string}
			 */
			description: { type: String },

			/**
			 * Aligns the leading edge of text if value is set to "text"
			 * @type {'text'|''}
			 */
			hAlign: { type: String, reflect: true, attribute: 'h-align' },

			/**
			 * Preset icon key (e.g. "tier1:gear")
			 * @type {string}
			 */
			icon: { type: String, reflect: true },

			/**
			 * Indicates that the icon should be rendered on right
			 * @type {boolean}
			 */
			iconRight: { type: Boolean, reflect: true, attribute: 'icon-right' },

			/**
			 * Whether to render the slimmer version of the button
			 * @type {boolean}
			 */
			slim: { type: Boolean, reflect: true },

			/**
			 * REQUIRED: Text for the button
			 * @type {string}
			 */
			text: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [ labelStyles, buttonStyles,
			css`
				:host {
					display: inline-block;
				}
				:host([hidden]) {
					display: none;
				}

				button {
					--d2l-button-subtle-padding-inline-start: 0.6rem;
					--d2l-button-subtle-padding-inline-end: 0.6rem;
					background-color: transparent;
					border-color: transparent;
					font-family: inherit;
					padding: 0 var(--d2l-button-subtle-padding-inline-end) 0 var(--d2l-button-subtle-padding-inline-start);
					position: relative;
				}

				:host([dir="rtl"]) button {
					padding: 0 var(--d2l-button-subtle-padding-inline-start) 0 var(--d2l-button-subtle-padding-inline-end);
				}

				:host([slim]) button {
					--d2l-button-subtle-padding-inline-start: 0.5rem;
					--d2l-button-subtle-padding-inline-end: 0.5rem;
					min-height: 1.5rem;
				}

				:host([slim][icon]) button {
					--d2l-button-subtle-padding-inline-start: 0.4rem;
					--d2l-button-subtle-padding-inline-end: 0.5rem;
				}

				:host([slim][icon][icon-right]) button {
					--d2l-button-subtle-padding-inline-start: 0.5rem;
					--d2l-button-subtle-padding-inline-end: 0.4rem;
				}

				:host([h-align="text"]) button {
					left: calc(var(--d2l-button-subtle-padding-inline-start) * -1);
				}
				:host([dir="rtl"][h-align="text"]) button {
					left: 0;
					right: calc(var(--d2l-button-subtle-padding-inline-start) * -1);
				}

				/* Firefox includes a hidden border which messes up button dimensions */
				button::-moz-focus-inner {
					border: 0;
				}
				button[disabled]:hover,
				button[disabled]:focus,
				:host([active]) button[disabled] {
					background-color: transparent;
				}
				button:hover,
				button:focus,
				:host([active]) button {
					background-color: var(--d2l-color-gypsum);
				}

				.d2l-button-subtle-content {
					color: var(--d2l-color-celestine);
				}
				button:hover:not([disabled]) .d2l-button-subtle-content,
				button:focus:not([disabled]) .d2l-button-subtle-content,
				:host([active]:not([disabled])) button .d2l-button-subtle-content {
					color: var(--d2l-color-celestine-minus-1);
				}
				:host([icon]) .d2l-button-subtle-content,
				:host([dir="rtl"][icon][icon-right]) .d2l-button-subtle-content {
					padding-left: 1.2rem;
					padding-right: 0;
				}
				:host([dir="rtl"][icon]) .d2l-button-subtle-content,
				:host([icon][icon-right]) .d2l-button-subtle-content {
					padding-left: 0;
					padding-right: 1.2rem;
				}

				d2l-icon.d2l-button-subtle-icon {
					color: var(--d2l-color-celestine);
					display: none;
					height: 0.9rem;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 0.9rem;
				}

				button:hover:not([disabled]) d2l-icon.d2l-button-subtle-icon,
				button:focus:not([disabled]) d2l-icon.d2l-button-subtle-icon,
				:host([active]:not([disabled])) button d2l-icon.d2l-button-subtle-icon {
					color: var(--d2l-color-celestine-minus-1);
				}

				:host([icon]) d2l-icon.d2l-button-subtle-icon {
					display: inline-block;
				}
				:host([icon][icon-right]) d2l-icon.d2l-button-subtle-icon {
					right: var(--d2l-button-subtle-padding-inline-end);
				}
				:host([dir="rtl"][icon][icon-right]) d2l-icon.d2l-button-subtle-icon {
					left: var(--d2l-button-subtle-padding-inline-end);
					right: auto;
				}

				:host([disabled]) button {
					cursor: default;
					opacity: 0.5;
				}
			`
		];
	}

	constructor() {
		super();
		this.iconRight = false;
		this.slim = false;

		/** @internal */
		this._buttonId = getUniqueId();
		/** @internal */
		this._describedById = getUniqueId();
	}

	render() {
		const icon = this.icon ?
			html`<d2l-icon icon="${this.icon}" class="d2l-button-subtle-icon"></d2l-icon>` : '';
		return html`
			<button
				aria-describedby="${ifDefined(this.description ? this._describedById : undefined)}"
				aria-disabled="${ifDefined(this.disabled && this.disabledTooltip ? 'true' : undefined)}"
				aria-expanded="${ifDefined(this.ariaExpanded)}"
				aria-haspopup="${ifDefined(this.ariaHaspopup)}"
				aria-label="${ifDefined(this.ariaLabel)}"
				?autofocus="${this.autofocus}"
				class="d2l-label-text"
				?disabled="${this.disabled && !this.disabledTooltip}"
				form="${ifDefined(this.form)}"
				formaction="${ifDefined(this.formaction)}"
				formenctype="${ifDefined(this.formenctype)}"
				formmethod="${ifDefined(this.formmethod)}"
				?formnovalidate="${this.formnovalidate}"
				formtarget="${ifDefined(this.formtarget)}"
				id="${this._buttonId}"
				name="${ifDefined(this.name)}"
				type="${this._getType()}">
				${icon}
				<span class="d2l-button-subtle-content">${this.text}</span>
				<slot></slot>
			</button>
			${this.description ? html`<span id="${this._describedById}" hidden>${this.description}</span>` : null}
			${this.disabled && this.disabledTooltip ? html`<d2l-tooltip for="${this._buttonId}">${this.disabledTooltip}</d2l-tooltip>` : ''}
		`;
	}

}

customElements.define('d2l-button-subtle', ButtonSubtle);

import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { ButtonMixin } from './button-mixin.js';
import { buttonStyles } from './button-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { labelStyles } from '../typography/styles.js';

/**
 * A button component that can be used just like the native button element.
 * @slot - Default content placed inside of the button
 */
class Button extends ButtonMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * A description to be added to the button for accessibility when text on button does not provide enough context
			 * @type {string}
			 */
			description: { type: String },

			/**
			 * Styles the button as a primary button
			 * @type {boolean}
			 */
			primary: { type: Boolean, reflect: true }
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
					font-family: inherit;
					padding: 0.55rem 1.5rem;
					width: 100%;
				}

				/* Firefox includes a hidden border which messes up button dimensions */
				button::-moz-focus-inner {
					border: 0;
				}

				button,
				button[disabled]:hover,
				button[disabled]:focus,
				:host([active]) button[disabled] {
					background-color: var(--d2l-color-gypsum);
					color: var(--d2l-color-ferrite);
				}

				button:hover,
				button:focus,
				:host([active]) button {
					background-color: var(--d2l-color-mica);
				}

				:host([disabled]) button {
					cursor: default;
					opacity: 0.5;
				}
				:host([primary]) button,
				:host([primary]) button[disabled]:hover,
				:host([primary]) button[disabled]:focus,
				:host([primary][active]) button[disabled] {
					background-color: var(--d2l-color-tourmaline);
					color: #ffffff;
				}
				:host([primary]) button:hover,
				:host([primary]) button:focus,
				:host([primary][active]) button {
					background-color: var(--d2l-color-tourmaline-minus-1);
				}
			`
		];
	}

	constructor() {
		super();
		this.primary = false;

		/** @internal */
		this._buttonId = getUniqueId();
		/** @internal */
		this._describedById = getUniqueId();
	}

	render() {
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
				<slot></slot>
			</button>
			${this.description ? html`<span id="${this._describedById}" hidden>${this.description}</span>` : null}
			${this.disabled && this.disabledTooltip ? html`<d2l-tooltip for="${this._buttonId}">${this.disabledTooltip}</d2l-tooltip>` : ''}
		`;
	}
}
customElements.define('d2l-button', Button);

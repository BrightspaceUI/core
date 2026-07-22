import '../colors/colors.js';
import '../tooltip/tooltip.js';
import {
	_generateButtonStyles,
	_generateMozillaButtonBorderStyles,
	buttonStyles
} from './button-styles.js';
import { css, html, LitElement } from 'lit';
import { ButtonMixin } from './button-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { labelStyles } from '../typography/styles.js';

/**
 * A button component that can be used just like the native button element.
 * @slot - Default content placed inside of the button
 */
class Button extends ButtonMixin(LitElement) {

	static properties = {
		/**
		 * ACCESSIBILITY: A description to be added to the button for accessibility when text on button does not provide enough context
		 * @type {string}
		 */
		description: { type: String },

		/**
		 * Styles the button as a primary button
		 * @type {boolean}
		 */
		primary: { type: Boolean, reflect: true }
	};

	static styles = [labelStyles, buttonStyles,
		css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}

			${_generateButtonStyles('button')}

			button {
				width: 100%;
			}

			${_generateMozillaButtonBorderStyles('button')}

			button,
			button[disabled]:hover,
			button[disabled]:focus,
			:host([active]) button[disabled] {
				background-color: var(--d2l-theme-background-color-interactive-secondary-default);
				color: var(--d2l-theme-text-color-static-standard);
			}

			button:hover,
			button:focus,
			:host([active]) button {
				background-color: var(--d2l-theme-background-color-interactive-secondary-hover);
			}

			:host([disabled]) button {
				cursor: default;
				position: relative;
			}
			:host([disabled]) button::before {
				background-color: var(--d2l-theme-background-color-base);
				border-radius: inherit;
				content: "";
				inset: 0;
				opacity: var(--d2l-theme-opacity-disabled-control);
				position: absolute;
			}

			:host([primary]) button,
			:host([primary]) button[disabled]:hover,
			:host([primary]) button[disabled]:focus,
			:host([primary][active]) button[disabled] {
				background-color: var(--d2l-theme-background-color-interactive-primary-default);
				color: var(--d2l-theme-text-color-static-inverted);
			}
			:host([primary]) button:hover,
			:host([primary]) button:focus,
			:host([primary][active]) button {
				background-color: var(--d2l-theme-background-color-interactive-primary-hover);
			}
		`
	];

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
				aria-expanded="${ifDefined(this.expanded)}"
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
			${this.disabled && this.disabledTooltip ? html`<d2l-tooltip class="vdiff-target" for="${this._buttonId}">${this.disabledTooltip}</d2l-tooltip>` : ''}
		`;
	}
}
customElements.define('d2l-button', Button);

import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { ButtonMixin } from './button-mixin.js';
import { buttonStyles } from './button-styles.js';
import { disabledTooltipMaskStyles } from '../../mixins/disabled-tooltip/disabled-tooltip-mixin.js';
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

	static styles = [labelStyles, buttonStyles, disabledTooltipMaskStyles,
		css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}

			button {
				font-family: inherit;
				padding-block-end: 0;
				padding-block-start: 0;
				padding-inline-end: var(--d2l-button-padding-inline-end, 1.5rem);
				padding-inline-start: var(--d2l-button-padding-inline-start, 1.5rem);
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
		this._describedById = getUniqueId();
	}

	render() {
		return html`
			<button
				aria-describedby="${ifDefined(this.description ? this._describedById : undefined)}"
				aria-disabled="${this._ariaDisabledAttribute}"
				aria-expanded="${ifDefined(this.expanded)}"
				aria-haspopup="${ifDefined(this.ariaHaspopup)}"
				aria-label="${ifDefined(this.ariaLabel)}"
				?autofocus="${this.autofocus}"
				class="d2l-label-text d2l-disabled-tooltip"
				?disabled="${this._disabled}"
				form="${ifDefined(this.form)}"
				formaction="${ifDefined(this.formaction)}"
				formenctype="${ifDefined(this.formenctype)}"
				formmethod="${ifDefined(this.formmethod)}"
				?formnovalidate="${this.formnovalidate}"
				formtarget="${ifDefined(this.formtarget)}"
				id="${this.#buttonId}"
				name="${ifDefined(this.name)}"
				type="${this._getType()}">
				<slot></slot>
			</button>
			${this.description ? html`<span id="${this._describedById}" hidden>${this.description}</span>` : null}
			${this._renderDisabledTooltip(this.#buttonId)}
		`;
	}

	#buttonId = getUniqueId();
}
customElements.define('d2l-button', Button);

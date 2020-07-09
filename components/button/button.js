import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ButtonMixin } from './button-mixin.js';
import { buttonStyles } from './button-styles.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
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
			 */
			description: { type: String }
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

				button[disabled] {
					cursor: default;
					opacity: 0.5;
				}
				:host([primary]) button,
				:host([primary]) button[disabled]:hover,
				:host([primary]) button[disabled]:focus,
				:host([primary][active]) button[disabled] {
					background-color: var(--d2l-color-celestine);
					color: #ffffff;
				}
				:host([primary]) button:hover,
				:host([primary]) button:focus,
				:host([primary][active]) button {
					background-color: var(--d2l-color-celestine-minus-1);
				}
			`
		];
	}

	render() {
		return html`
			<button
				aria-expanded="${ifDefined(this.ariaExpanded)}"
				aria-haspopup="${ifDefined(this.ariaHaspopup)}"
				aria-label="${ifDefined(this.description || this.ariaLabel)}"
				?autofocus="${this.autofocus}"
				class="d2l-label-text"
				?disabled="${this.disabled}"
				form="${ifDefined(this.form)}"
				formaction="${ifDefined(this.formaction)}"
				formenctype="${ifDefined(this.formenctype)}"
				formmethod="${ifDefined(this.formmethod)}"
				?formnovalidate="${this.formnovalidate}"
				formtarget="${ifDefined(this.formtarget)}"
				name="${ifDefined(this.name)}"
				type="${this._getType()}">
				<slot></slot>
			</button>
		`;
	}
}
customElements.define('d2l-button', Button);

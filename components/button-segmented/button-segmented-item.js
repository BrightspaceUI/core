import '../button/button.js';
import '../colors/colors.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { ButtonMixin } from '../button/button-mixin.js';
import { buttonStyles } from '../button/button-styles.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { labelStyles } from '../typography/styles.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

/**
 * A segmented button item component used with JS handlers.
 * @fires d2l-button-segmented-item-select - Dispatched when the item is selected
 */
class ButtonSegmentedItem extends PropertyRequiredMixin(ButtonMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Key of the action
			 * @type {string}
			 */
			key: { type: String, required: true },
			/**
			 * REQUIRED: Button text
			 * @type {string}
			 */
			text: { type: String, required: true },
			/**
			 * Indicates if the item is selected
			 * @type {boolean}
			 */
			selected: { type: Boolean, reflect: true },
			_focusable: { status: true }
		};
	}

	static get styles() {
		return [labelStyles, buttonStyles, css`
			/* Firefox includes a hidden border which messes up button dimensions */
			button::-moz-focus-inner {
				border: 0;
			}

			button {
				background-color: transparent;
				border-radius: 0.2rem;
				font-family: inherit;
				min-height: auto;
				padding-block: 0.3rem;
				padding-inline: 1rem;
			}
			:host(:first-of-type) button {
				margin-inline-start: 0.3rem;
			}
			:host(:last-of-type) button {
				margin-inline-end: 0.3rem;
			}

			button:hover {
				background-color: var(--d2l-color-mica);
			}

			button:${unsafeCSS(getFocusPseudoClass())} {
				box-shadow: 0 0 0 2px #ffffff;
			}

			:host([selected]) button {
				background-color: var(--d2l-color-tungsten);
				color: #ffffff;
			}
		`];
	}

	constructor() {
		super();
		this.selected = false;
		this._focusable = false;
	}

	render() {
		return html`
			<button
				tabindex="${this._focusable ? '0' : '-1'}"
				class="d2l-label-text"
				@click="${this.#handleClick}">
				${this.text}
			</button>
		`;
	}

	async #handleClick() {
		if (this.disabled || this.selected) return;
		this.selected = true;
		this.dispatchEvent(new CustomEvent('d2l-button-segmented-item-select', {
			detail: { key: this.key },
			bubbles: true,
			composed: true
		}));

		this.focusable = true;
		await this.updateComplete;
		this.shadowRoot.querySelector('button').focus();
	}

}

customElements.define('d2l-button-segmented-item', ButtonSegmentedItem);

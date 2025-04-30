import './button.js';
import '../colors/colors.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../icons/icon.js';
import '../menu/menu.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

/**
 * A split button that provides a main action button and slot for a menu.
 */
class ButtonSplit extends FocusMixin(PropertyRequiredMixin(LocalizeCoreElement(LitElement))) {

	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: A description to be added to the main action button for accessibility when text does not provide enough context
			 * @type {string}
			 */
			description: { type: String },
			/**
			 * Disables the main action and dropdown opener buttons
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Tooltip text when disabled
			 * @type {string}
			 */
			disabledTooltip: { type: String, attribute: 'disabled-tooltip' },
			/**
			 * REQUIRED: Key of the main action
			 * @type {string}
			 */
			key: { type: String, required: true },
			/**
			 * Styles the buttons as a primary buttons
			 * @type {boolean}
			 */
			primary: { type: Boolean, reflect: true },
			/**
			 * ACCESSIBILITY: REQUIRED: Accessible text for the main action button
			 * @type {string}
			 */
			text: { type: String, reflect: true, required: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.container {
				display: flex;
				gap: 6px;
			}
			.main-action {
				--d2l-button-start-end-radius: 0;
				--d2l-button-end-end-radius: 0;
			}
			.d2l-dropdown-opener {
				--d2l-button-start-start-radius: 0;
				--d2l-button-end-start-radius: 0;
				--d2l-button-padding-inline-end: 0.6rem;
				--d2l-button-padding-inline-start: 0.6rem;
			}
			.d2l-dropdown-opener[primary] > d2l-icon {
				color: #ffffff;
			}
			::slotted(:not(d2l-button-split-item)) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.disabled = false;
		this.primary = false;
	}

	static get focusElementSelector() {
		return '.main-action';
	}

	render() {
		return html`
			<div class="container" @click="${this.#suppressClick}">
				<d2l-button
					class="main-action"
					@click="${this.#handleMainActionClick}"
					description="${ifDefined(this.description)}"
					?disabled="${this.disabled}"
					disabled-tooltip="${ifDefined(this.disabledTooltip)}"
					?primary="${this.primary}">
					${this.text}
				</d2l-button>
				<d2l-dropdown>
					<d2l-button
						aria-label="${this.localize('components.button-split.otherOptions')}"
						class="d2l-dropdown-opener"
						?disabled="${this.disabled}"
						?primary="${this.primary}">
						<d2l-icon icon="tier1:chevron-down"></d2l-icon>
					</d2l-button>
					<d2l-dropdown-menu>
						<d2l-menu label="${this.localize('components.button-split.otherOptions')}" @d2l-menu-item-select="${this.#handleMenuItemSelect}">
							<slot></slot>
						</d2l-menu>
					</d2l-dropdown-menu>
				</d2l-dropdown>
			</div>
		`;
	}

	#dispatchClick(key) {
		/** Dispatched when a split button is clicked. The `key` is provided on the event detail. */
		this.dispatchEvent(new CustomEvent('click', { detail: { key } }));
	}

	#handleMainActionClick() {
		this.#dispatchClick(this.key);
	}

	#handleMenuItemSelect(e) {
		this.#dispatchClick(e.target.key);
	}

	#suppressClick(e) {
		e.stopPropagation();
	}

}

customElements.define('d2l-button-split', ButtonSplit);

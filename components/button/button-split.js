import './button.js';
import '../colors/colors.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * A button container component for split buttons.
 */
class ButtonSplit extends FocusMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			autofocus: { type: Boolean, reflect: true },
			/**
			 * ACCESSIBILITY: A description to be added to the main action button for accessibility when text does not provide enough context
			 * @type {string}
			 */
			description: { type: String },
			/**
			 * Disables the main action and menu opener buttons
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Tooltip text when disabled
			 * @type {string}
			 */
			disabledTooltip: { type: String, attribute: 'disabled-tooltip' },
			/**
			 * @ignore
			 */
			form: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			formaction: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			formenctype: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			formmethod: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			formnovalidate: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			formtarget: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			name: { type: String, reflect: true },
			/**
			 * Styles the buttons as a primary buttons
			 * @type {boolean}
			 */
			primary: { type: Boolean, reflect: true },
			/**
			 * ACCESSIBILITY: REQUIRED: Accessible text for the main action button
			 * @type {string}
			 */
			text: { type: String, reflect: true, required: true },
			/**
			 * @ignore
			 */
			type: { type: String, reflect: true }
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
			.menu-opener {
				--d2l-button-start-start-radius: 0;
				--d2l-button-end-start-radius: 0;
				--d2l-button-padding: 0 0.6rem;
			}
			.menu-opener[primary] > d2l-icon {
				color: #ffffff;
			}
			::slotted(:not(d2l-menu)) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		/** @ignore */
		this.autofocus = false;
		this.disabled = false;
		this.primary = false;
	}

	static get focusElementSelector() {
		return '.main-action';
	}

	render() {
		return html`
			<div class="container">
				<d2l-button
					?autofocus="${this.autofocus}"
					class="main-action"
					@click="${this.#handleMainActionClick}"
					description="${ifDefined(this.description)}"
					?disabled="${this.disabled}"
					disabled-tooltip="${ifDefined(this.disabledTooltip)}"
					form="${ifDefined(this.form)}"
					formaction="${ifDefined(this.formaction)}"
					formenctype="${ifDefined(this.formenctype)}"
					formmethod="${ifDefined(this.formmethod)}"
					?formnovalidate="${this.formnovalidate}"
					formtarget="${ifDefined(this.formtarget)}"
					name="${ifDefined(this.name)}"
					?primary="${this.primary}"
					type="${ifDefined(this.type)}">
					${this.text}
				</d2l-button>
				<d2l-dropdown>
					<d2l-button
						aria-label="Other Actions"
						class="d2l-dropdown-opener menu-opener"
						?disabled="${this.disabled}"
						?primary="${this.primary}">
						<d2l-icon icon="tier1:chevron-down"></d2l-icon>
					</d2l-button>
					<d2l-dropdown-menu>
						<slot name="menu"></slot>
					</d2l-dropdown-menu>
				</d2l-dropdown>
			</div>
		`;
	}

	#handleMainActionClick(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('d2l-button-split-click'));
	}

}

customElements.define('d2l-button-split', ButtonSplit);

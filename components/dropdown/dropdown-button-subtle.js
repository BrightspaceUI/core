import '../button/button-subtle.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { DropdownOpenerMixin } from './dropdown-opener-mixin.js';
import { dropdownOpenerStyles } from './dropdown-opener-styles.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

/**
 * A "d2l-button-subtle" opener for dropdown content.
 * @slot - Dropdown content (e.g., "d2l-dropdown-content", "d2l-dropdown-menu" or "d2l-dropdown-tabs")
 */
class DropdownButtonSubtle extends DropdownOpenerMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * A description to be added to the opener button for accessibility when text on button does not provide enough context
			 */
			description: { type: String },
			/**
			 * REQUIRED: Text for the button
			 */
			text: {
				type: String
			}
		};
	}

	static get styles() {
		return dropdownOpenerStyles;
	}

	render() {
		return html`
			<d2l-button-subtle description="${ifDefined(this.description)}" text=${this.text} icon="tier1:chevron-down" icon-right ?disabled=${this.disabled}></d2l-button-subtle>
			<slot></slot>
		`;
	}

	/**
	 * Gets the opener element with class "d2l-dropdown-opener" (required by dropdown-opener-mixin).
	 * @return {HTMLElement}
	 */
	getOpenerElement() {
		return this.shadowRoot.querySelector('d2l-button-subtle');
	}

}
customElements.define('d2l-dropdown-button-subtle', DropdownButtonSubtle);

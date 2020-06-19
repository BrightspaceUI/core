import { html, LitElement } from 'lit-element/lit-element.js';
import { DropdownOpenerMixin } from './dropdown-opener-mixin.js';
import { dropdownOpenerStyles } from './dropdown-opener-styles.js';

/**
 * "d2l-dropdown" is a generic opener for dropdown content ("d2l-dropdown-content", "d2l-dropdown-menu" or "d2l-dropdown-tabs") enabling alternate opener implementation using existing elements/components. Provide and indicate your own opener element with the class attribute value "d2l-dropdown-opener".  Wire-up is automatic.
 * @slot - Dropdown content (e.g., "d2l-dropdown-content", "d2l-dropdown-menu" or "d2l-dropdown-tabs")
 */
class Dropdown extends DropdownOpenerMixin(LitElement) {

	static get styles() {
		return dropdownOpenerStyles;
	}

	render() {
		return html`<slot></slot>`;
	}

	/**
	 * Gets the opener element with class "d2l-dropdown-opener" (required by dropdown-opener-mixin).
	 * @return {HTMLElement}
	 */
	getOpenerElement() {
		return this.shadowRoot.querySelector('slot')
			.assignedNodes()
			.filter(node => node.classList && node.classList.contains('d2l-dropdown-opener'))[0];
	}

}
customElements.define('d2l-dropdown', Dropdown);

import { html, LitElement } from 'lit';
import { DropdownOpenerMixin } from './dropdown-opener-mixin-fixed.js';
import { dropdownOpenerStyles } from './dropdown-opener-styles-fixed.js';

/**
 * A generic opener for dropdown content, enabling alternate opener implementation using existing elements/components. Provide and indicate your own opener element with the class attribute value "d2l-dropdown-opener".  Wire-up is automatic.
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
		if (!this.shadowRoot) return undefined;

		const nodes = this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true });
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].nodeType !== Node.ELEMENT_NODE) continue;
			if (nodes[i].classList.contains('d2l-dropdown-opener')) return nodes[i];
			if (nodes[i]._dropdownContent) continue;
			const nestedOpener = nodes[i].querySelector('.d2l-dropdown-opener');
			if (nestedOpener) return nestedOpener;
		}
	}

}
customElements.define('d2l-dropdown-fixed', Dropdown);

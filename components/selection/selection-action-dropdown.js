import '../button/button-subtle.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { DropdownOpenerMixin } from '../dropdown/dropdown-opener-mixin.js';
import { dropdownOpenerStyles } from '../dropdown/dropdown-opener-styles.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { SelectionActionMixin } from './selection-action-mixin.js';

/**
 * A dropdown opener associated with a selection component.
 * @slot - Dropdown content (e.g., "d2l-dropdown-content", "d2l-dropdown-menu" or "d2l-dropdown-tabs")
 */
class ActionDropdown extends LocalizeCoreElement(SelectionActionMixin(DropdownOpenerMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Text for the dropdown opener button
			 * @type {string}
			 */
			text: { type: String }
		};
	}

	static get styles() {
		return dropdownOpenerStyles;
	}

	render() {
		return html`
			<d2l-button-subtle
				?disabled=${this.disabled}
				disabled-tooltip="${ifDefined(this.disabled ? this.localize('components.selection.action-hint') : undefined)}"
				icon="tier1:chevron-down"
				icon-right
				text=${this.text}></d2l-button-subtle>
			<slot></slot>
		`;
	}

	focus() {
		const elem = this.shadowRoot && this.shadowRoot.querySelector('d2l-button-subtle');
		if (elem) elem.focus();
	}

	/**
	 * Gets the opener element with class "d2l-dropdown-opener" (required by dropdown-opener-mixin).
	 * @return {HTMLElement}
	 */
	getOpenerElement() {
		return this.shadowRoot && this.shadowRoot.querySelector('d2l-button-subtle');
	}

}
customElements.define('d2l-selection-action-dropdown', ActionDropdown);

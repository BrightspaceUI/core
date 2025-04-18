import { DropdownPopoverMixin, usePopoverMixin } from './dropdown-popover-mixin.js';
import { DropdownContentMixin } from './dropdown-content-mixin.js';
import { dropdownContentStyles } from './dropdown-content-styles.js';
import { LitElement } from 'lit';

if (usePopoverMixin) {

	/**
	 * A generic container for dropdown content. It provides behavior such as sizing,  positioning, and managing focus gain/loss.
	 * @slot - Anything inside of "d2l-dropdown-content" that isn't in the "header" or "footer" slots appears as regular content
	 * @slot header - Sticky container at the top of the dropdown
	 * @slot footer - Sticky container at the bottom of the dropdown
	 * @fires d2l-dropdown-open - Dispatched when the dropdown is opened
	 */
	class DropdownContent extends DropdownPopoverMixin(LitElement) { }
	customElements.define('d2l-dropdown-content', DropdownContent);

} else {

	/**
	 * A generic container for dropdown content. It provides behavior such as sizing,  positioning, and managing focus gain/loss.
	 * @slot - Anything inside of "d2l-dropdown-content" that isn't in the "header" or "footer" slots appears as regular content
	 * @slot header - Sticky container at the top of the dropdown
	 * @slot footer - Sticky container at the bottom of the dropdown
	 * @fires d2l-dropdown-open - Dispatched when the dropdown is opened
	 */
	class DropdownContent extends DropdownContentMixin(LitElement) {

		static get styles() {
			return dropdownContentStyles;
		}

		render() {
			return this._renderContent();
		}

	}
	customElements.define('d2l-dropdown-content', DropdownContent);

}

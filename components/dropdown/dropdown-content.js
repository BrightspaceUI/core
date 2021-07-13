import { html, LitElement } from 'lit-element/lit-element.js';
import { DropdownContentMixin } from './dropdown-content-mixin.js';
import { dropdownContentStyles } from './dropdown-content-styles.js';

/**
 * A generic container for dropdown content.  It provides behavior such as sizing,  positioning, and managing focus gain/loss.
 * @slot - Anything inside of "d2l-dropdown-content" that isn't in the "header" or "footer" slots appears as regular content
 * @slot header - Sticky container at the top of the dropdown
 * @slot footer - Sticky container at the bottom of the dropdown
 * @fires d2l-dropdown-open - Dispatched when the dropdown is opened
 * @fires d2l-dropdown-close - Dispatched when the dropdown is closed
 * @fires d2l-dropdown-position - Dispatched when the dropdown position finishes adjusting
 */
class DropdownContent extends DropdownContentMixin(LitElement) {

	static get styles() {
		return dropdownContentStyles;
	}

	render() {
		return html`
			${this._renderContent()}
			<div class="d2l-dropdown-content-pointer">
				<div></div>
			</div>
		`;
	}

}
customElements.define('d2l-dropdown-content', DropdownContent);

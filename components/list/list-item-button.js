import { ListItemButtonMixin } from './list-item-button-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';

/**
 * A component for a "listitem" child within a list. It provides semantics, basic layout, breakpoints for responsiveness, a link for navigation, and selection.
 * @slot - Default content placed inside of the component
 * @slot illustration - Image associated with the list item located at the left of the item
 * @slot actions - Actions (e.g., button icons) associated with the listen item located at the right of the item
 */
class ListItemButton extends ListItemButtonMixin(LitElement) {

	render() {
		return this._renderListItem();
	}

}

customElements.define('d2l-list-item-button', ListItemButton);

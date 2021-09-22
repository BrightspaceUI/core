import { ListItemButtonMixin } from './list-item-button-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';

/**
 * A component for a "listitem" child within a list. It provides semantics, basic layout, breakpoints for responsiveness, a link for navigation, and selection.
 * @slot - Default content placed inside of the component
 * @slot illustration - Image associated with the list item located at the left of the item
 * @slot actions - Actions (e.g., button icons) associated with the listen item located at the right of the item
 * @fires d2l-list-item-button-click - Dispatched when the item's primary button action is clicked
 * @fires d2l-list-item-position-change - Dispatched when a draggable list item's position changes in the list. See [Event Details: d2l-list-item-position-change](#event-details%3A-d2l-list-item-position-change).
 * @fires d2l-list-item-selected - Dispatched when the component item is selected
 */
class ListItemButton extends ListItemButtonMixin(LitElement) {

	render() {
		return this._renderListItem();
	}

}

customElements.define('d2l-list-item-button', ListItemButton);

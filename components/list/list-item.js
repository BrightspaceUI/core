import { ListItemLinkMixin } from './list-item-link-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';

/**
 * A component for a "listitem" child within a list. It provides semantics, basic layout, breakpoints for responsiveness, a link for navigation, and selection.
 * @slot - Default content placed inside of the component
 * @slot illustration - Image associated with the list item located at the left of the item
 * @slot actions - Actions (e.g., button icons) associated with the listen item located at the right of the item
 * @fires d2l-list-item-link-click - Dispatched when the item's primary link action is clicked
 * @fires d2l-list-item-position-change - Dispatched when a draggable list item's position changes in the list. See [Event Details: d2l-list-item-position-change](#event-details%3A-d2l-list-item-position-change).
 * @fires d2l-list-item-selected - Dispatched when the component item is selected
 */
class ListItem extends ListItemLinkMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Address of item link if navigable
			 * @type {string}
			 */
			href: { type: String }
		};
	}

	get href() {
		return this.actionHref;
	}

	set href(value) {
		this.actionHref = value;
	}

	render() {
		return this._renderListItem();
	}

}

customElements.define('d2l-list-item', ListItem);

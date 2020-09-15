import { ListItemMixin } from './list-item-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';

/**
 * A component for a "listitem" child within a list. It provides semantics, basic layout, breakpoints for responsiveness, a link for navigation, and selection.
 * @slot - Default content placed inside of the component
 * @slot illustration - Image associated with the list item located at the left of the item
 * @slot actions - Actions (e.g., button icons) associated with the listen item located at the right of the item
 * @fires d2l-list-item-selected - Dispatched when the component item is selected
 */
class ListItem extends ListItemMixin(LitElement) {
	static get properties() {
		return {
			/**
			 * Address of item link if navigable
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

import { MenuItemMixin } from './menu-item-mixin.js';

export const MenuItemSelectableMixin = superclass => class extends MenuItemMixin(superclass) {

	static get properties() {
		return {
			/**
			 * This will set the item to be selected by default
			 * @type {boolean}
			 */
			selected: { type: Boolean, reflect: true },
			/**
			 * REQUIRED: The selectable item's value
			 * @type {string}
			 */
			value: { type: String }
		};
	}

	constructor() {
		super();
		this.selected = false;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'selected') {
				this.__onSelectedChanged(this.selected);
			}
		});
	}

	__onSelect(e) {
		e.preventDefault();
		e.stopPropagation();
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: {
				value: this.value,
				selected: this.selected
			}
		};
		/** Dispatched when the selected menu item changes */
		this.dispatchEvent(new CustomEvent('d2l-menu-item-change', eventDetails));
	}

	__onSelectedChanged(selected) {
		selected ? this.setAttribute('aria-checked', 'true') : this.setAttribute('aria-checked', 'false');
	}

};

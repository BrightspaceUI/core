import { MenuItemMixin } from './menu-item-mixin.js';

export const MenuItemSelectableMixin = superclass => class extends MenuItemMixin(superclass) {

	static get properties() {
		return {
			/**
			 * This will set the item to be selected by default
			 */
			selected: { type: Boolean, reflect: true },
			/**
			 * The selectable item's value
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
		this.dispatchEvent(new CustomEvent('d2l-menu-item-change', eventDetails));
	}

	__onSelectedChanged(selected) {
		selected ? this.setAttribute('aria-checked', 'true') : this.removeAttribute('aria-checked');
	}

};

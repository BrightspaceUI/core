import { MenuItemMixin } from './menu-item-mixin.js';

export const MenuItemSelectableMixin = superclass => class extends MenuItemMixin(superclass) {

	static get properties() {
		return {
			selected: { type: Boolean, reflect: true },
			value: { type: String }
		};
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
		selected ? this.setAttribute('aria-checked', true) : this.removeAttribute('aria-checked');
	}

};

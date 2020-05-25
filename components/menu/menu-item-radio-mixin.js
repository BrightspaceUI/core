import { MenuItemSelectableMixin } from './menu-item-selectable-mixin.js';

export const MenuItemRadioMixin = superclass => class extends MenuItemSelectableMixin(superclass) {

	constructor() {
		super();
		this.role = 'menuitemradio';
	}

	firstUpdated() {
		super.firstUpdated();
		this.addEventListener('d2l-menu-item-change', this._onChange);
		this.addEventListener('d2l-menu-item-select', this._onSelectRadio);
	}

	_onChange(e) {
		const items = this.parentNode.querySelectorAll('[role="menuitemradio"]');
		for (let i = 0; i < items.length; i++) {
			items[i].selected = items[i].value === e.detail.value;
		}
	}

	_onSelectRadio(e) {
		this.selected = true;
		this.__onSelect(e);
	}

};

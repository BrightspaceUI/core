import { MenuItemSelectableMixin } from './menu-item-selectable-mixin.js';

/**
 * @template {ReactiveElementClassType} S
 * @param {S} superclass
 */
export const MenuItemRadioMixin = superclass => class extends MenuItemSelectableMixin(superclass) {

	constructor(...args) {
		super(...args);
		/** @ignore */
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

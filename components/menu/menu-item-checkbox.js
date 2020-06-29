import '../icons/icon.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemSelectableMixin } from './menu-item-selectable-mixin.js';
import { menuItemSelectableStyles } from './menu-item-selectable-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A menu item component used for selection. Multiple checkboxes can be selected at once.
 * @fires click - Dispatched when the link is clicked
 * @fires d2l-menu-item-change - Dispatched when the selected menu item changes
 * @fires d2l-menu-item-select - Dispatched when the menu item is selected
 * @fires d2l-menu-item-visibility-change - Dispatched when the visibility of the menu item changes
 */
class MenuItemCheckbox extends RtlMixin(MenuItemSelectableMixin(LitElement)) {

	static get styles() {
		return menuItemSelectableStyles;
	}

	constructor() {
		super();
		this.role = 'menuitemcheckbox';
	}

	firstUpdated() {
		super.firstUpdated();
		this.addEventListener('d2l-menu-item-select', this._onSelectCheckbox);
	}

	render() {
		return html`
			<d2l-icon icon="tier1:check"></d2l-icon>
			<span>${this.text}</span>
		`;
	}

	_onSelectCheckbox(e) {
		this.selected = !this.selected;
		this.__onSelect(e);
	}
}

customElements.define('d2l-menu-item-checkbox', MenuItemCheckbox);

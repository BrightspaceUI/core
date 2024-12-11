import '../icons/icon.js';
import { html, LitElement } from 'lit';
import { MenuItemRadioMixin } from '../menu/menu-item-radio-mixin.js';
import { menuItemSelectableStyles } from '../menu/menu-item-selectable-styles.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * A radio menu item to be used within the d2l-table-col-sort-button component for a multi-faceted sort.
 * @fires d2l-menu-item-change - Internal event
 * @fires d2l-menu-item-select - Internal event
 * @fires d2l-menu-item-visibility-change - Internal event
 * @typedef {TableColSortButtonItem} TableColSortButtonItemExported
 */
class TableColSortButtonItem extends RtlMixin(MenuItemRadioMixin(LitElement)) {

	static get styles() {
		return menuItemSelectableStyles;
	}

	firstUpdated() {
		super.firstUpdated();
		this.addEventListener('d2l-menu-item-change', this._onChangeOption);
	}

	render() {
		return html`
			<d2l-icon icon="tier1:check"></d2l-icon>
			<div class="d2l-menu-item-text">${this.text}</div>
		`;
	}

	_onChangeOption() {
		/** Dispatched when the selected multi-faceted sort option changes */
		this.dispatchEvent(new CustomEvent('d2l-table-col-sort-button-item-change', { bubbles: true, composed: true }));
	}
}

customElements.define('d2l-table-col-sort-button-item', TableColSortButtonItem);

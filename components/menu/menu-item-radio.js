import '../icons/icon.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemRadioMixin } from './menu-item-radio-mixin.js';
import { menuItemSelectableStyles } from './menu-item-selectable-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A menu item component used for radio selection. Only one radio item in a given d2l-menu may be selected at once (i.e., selecting one option will deselect the other selected "d2l-menu-item-radio" item).
 * @fires d2l-menu-item-change - Dispatched when the selected menu item changes
 * @fires d2l-menu-item-select - Dispatched when a menu item is selected
 * @fires d2l-menu-item-visibility-change - Dispatched when the visibility of the menu item changes
 */
class MenuItemRadio extends RtlMixin(MenuItemRadioMixin(LitElement)) {

	static get styles() {
		return menuItemSelectableStyles;
	}

	render() {
		return html`
			<d2l-icon icon="tier1:check"></d2l-icon>
			<span>${this.text}</span>
		`;
	}
}

customElements.define('d2l-menu-item-radio', MenuItemRadio);

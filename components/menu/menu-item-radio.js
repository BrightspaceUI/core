import '../icons/icon.js';
import { html, LitElement } from 'lit';
import { MenuItemRadioMixin } from './menu-item-radio-mixin.js';
import { menuItemSelectableStyles } from './menu-item-selectable-styles.js';

/**
 * A menu item component used for radio selection. Only one radio item in a given d2l-menu may be selected at once (i.e., selecting one option will deselect the other selected "d2l-menu-item-radio" item).
 * @slot supporting - Allows supporting information to be displayed on the right-most side of the menu item
 */
export class MenuItemRadio extends MenuItemRadioMixin(LitElement) {

	static get styles() {
		return menuItemSelectableStyles;
	}

	render() {
		return html`
			<d2l-icon icon="tier1:check"></d2l-icon>
			<div class="d2l-menu-item-text">${this.text}</div>
			<div class="d2l-menu-item-supporting"><slot name="supporting"></slot></div>
		`;
	}
}

customElements.define('d2l-menu-item-radio', MenuItemRadio);

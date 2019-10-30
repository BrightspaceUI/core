import '../icons/icon.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemRadioMixin } from './menu-item-radio-mixin.js';
import { menuItemSelectableStyles } from './menu-item-selectable-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

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

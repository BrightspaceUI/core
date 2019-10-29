import '../icons/icon.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemSelectableMixin } from './menu-item-selectable-mixin.js';
import { menuItemSelectableStyles } from './menu-item-selectable-styles.js';

class MenuItemCheckbox extends MenuItemSelectableMixin(LitElement) {

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
			<d2l-icon icon="tier1:check" aria-hidden="true"></d2l-icon>
			<span>${this.text}</span>
		`;
	}

	_onSelectCheckbox(e) {
		this.selected = !this.selected;
		this.__onSelect(e);
	}
}

customElements.define('d2l-menu-item-checkbox', MenuItemCheckbox);

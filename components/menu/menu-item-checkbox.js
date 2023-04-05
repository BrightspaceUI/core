import '../icons/icon.js';
import { html, LitElement } from 'lit';
import { MenuItemSelectableMixin } from './menu-item-selectable-mixin.js';
import { menuItemSelectableStyles } from './menu-item-selectable-styles.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * A menu item component used for selection. Multiple checkboxes can be selected at once.
 */
class MenuItemCheckbox extends RtlMixin(MenuItemSelectableMixin(LitElement)) {

	static get styles() {
		return menuItemSelectableStyles;
	}

	constructor() {
		super();
		/** @ignore */
		this.role = 'menuitemcheckbox';
	}

	firstUpdated() {
		super.firstUpdated();
		this.addEventListener('d2l-menu-item-select', this._onSelectCheckbox);
	}

	render() {
		return html`
			<d2l-icon icon="tier1:check"></d2l-icon>
	<div class="d2l-menu-item-text">${this.text}</div>
			<div class="d2l-menu-item-supporting"><slot name="supporting"></slot></div>
		`;
	}

	_onSelectCheckbox(e) {
		this.selected = !this.selected;
		this.__onSelect(e);
	}
}

customElements.define('d2l-menu-item-checkbox', MenuItemCheckbox);

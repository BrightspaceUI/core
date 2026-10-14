import '../icons/icon.js';
import { css, html, LitElement, nothing } from 'lit';
import { toolbarMenuItemIconStyles, toolbarMenuItemStyles, toolbarMenuItemTextStyles } from './toolbar-menu-item-styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { MenuItemMixin } from '../menu/menu-item-mixin.js';
import { menuItemStyles } from '../menu/menu-item-styles.js';
import { SlottedIconMixin } from '../icons/slotted-icon-mixin.js';

/**
 * A toolbar menu-item that performs an action
 */
class ToolbarMenuItem extends MenuItemMixin(SlottedIconMixin(LitElement)) {

	static get styles() {
		return [menuItemStyles, toolbarMenuItemStyles, toolbarMenuItemIconStyles, toolbarMenuItemTextStyles, css`
			.nested-icon {
				flex: none;
			}
		`];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('d2l-menu-item-select', this.#handleMenuItemSelect);
	}

	render() {
		const itemIconClasses = {
			'item-icon-container': true,
			'item-icon-hidden': !this.hasIcon()
		};
		return html`
			<div class="${classMap(itemIconClasses)}">${this._renderIcon()}</div>
			<div class="d2l-menu-item-text"><slot name="text">${this.text}</slot></div>
			${this.hasChildView ? html`<d2l-icon class="nested-icon" icon="tier1:chevron-right"></d2l-icon>` : nothing}
			<slot></slot>
		`;

	}

	#handleMenuItemSelect = e => {
		e.stopPropagation();

		// ignore if target is not this item (nested menu case)
		if (e.target !== this) return;

		this.dispatchEvent(new CustomEvent('d2l-toolbar-menu-item-select'));
	};

}

customElements.define('d2l-toolbar-menu-item', ToolbarMenuItem);

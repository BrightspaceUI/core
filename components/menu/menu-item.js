import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { MenuItemMixin } from './menu-item-mixin.js';
import { menuItemStyles } from './menu-item-styles.js';

/**
 * A menu item component used with JS handlers.
 * @slot - Default content placed inside of the component
 * @slot supporting - Allows supporting information to be displayed on the right-most side of the menu item
 * @typedef {MenuItem} MenuItemExported
 */
class MenuItem extends MenuItemMixin(LitElement) {

	static get styles() {
		return [ menuItemStyles,
			css`
				:host {
					align-items: center;
					display: flex;
					padding: 0.75rem 1rem;
				}

				d2l-icon {
					flex: none;
					margin-left: 6px;
				}
				:host([dir="rtl"]) d2l-icon {
					margin-left: 0;
					margin-right: 6px;
				}
			`
		];
	}

	render() {
		const icon = this.hasChildView ?
			html`<d2l-icon icon="tier1:chevron-right"></d2l-icon>` : null;

		return html`
			<div class="d2l-menu-item-text">${this.text}</div>
			<div class="d2l-menu-item-supporting"><slot name="supporting"></slot></div>
			${icon}
			<slot></slot>
		`;
	}
}

customElements.define('d2l-menu-item', MenuItem);

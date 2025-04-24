import { css, html, LitElement } from 'lit';
import { MenuItemMixin } from '../menu/menu-item-mixin.js';
import { menuItemStyles } from '../menu/menu-item-styles.js';

/**
 * An split button item component used with JS handlers.
 */
class ButtonSplitItem extends MenuItemMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Key of the item
			 * @type {boolean}
			 */
			key: { type: String }
		};
	}

	static get styles() {
		return [ menuItemStyles,
			css`
				:host {
					align-items: center;
					display: flex;
					padding: 0.75rem 1rem;
				}
			`
		];
	}

	render() {
		return html`
			<div class="d2l-menu-item-text">${this.text}</div>
		`;
	}
}

customElements.define('d2l-button-split-item', ButtonSplitItem);

import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemMixin } from './menu-item-mixin.js';
import { menuItemStyles } from './menu-item-styles.js';

class MenuItem extends MenuItemMixin(LitElement) {

	static get styles() {
		return [ menuItemStyles,
			css`
				:host {
					display: flex;
					padding: 0.75rem 1rem;
				}

				:host > span {
					flex: auto;
					line-height: 1rem;
					overflow-x: hidden;
					overflow-y: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				:host > d2l-icon {
					flex: none;
					margin-top: 0.1rem;
				}
			`
		];
	}

	render() {
		const icon = this.hasChildView ?
			html`<d2l-icon icon="tier1:chevron-right"></d2l-icon>` : '';

		return html`
			<span>${this.text}</span>
			${icon}
			<slot></slot>
		`;
	}
}

customElements.define('d2l-menu-item', MenuItem);

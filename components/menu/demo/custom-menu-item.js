import { css, html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemMixin } from '../menu-item-mixin.js';
import { menuItemStyles } from '../menu-item-styles.js';

class CustomMenuItem extends MenuItemMixin(LitElement) {

	static get properties() {
		return {
			text: { type: String }
		};
	}

	static get styles() {
		return [ menuItemStyles,
			css`
				:host {
					padding: 0.75rem 1.5rem;
				}
				:host(:hover) .d2l-menu-item-text,
				:host(:focus) .d2l-menu-item-text {
					-webkit-transform: rotateY(360deg);
					transform: rotateY(360deg);
					transition: transform 2s;
				}
			`
		];
	}

	render() {
		return html`
			<div class="d2l-menu-item-text">${this.text}</div>
			<slot></slot>
		`;
	}
}

customElements.define('d2l-custom-menu-item', CustomMenuItem);

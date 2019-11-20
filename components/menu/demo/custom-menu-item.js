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
					display: block;
					padding: 0.75rem 1.5rem;
				}
				:host span {
					line-height: 1rem;
					overflow-x: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				:host(:hover) span,
				:host(:focus) span {
					display: inline-block;
					-webkit-transform: rotateY(360deg);
					transform: rotateY(360deg);
					transition: transform 2s;
				}
			`
		];
	}

	render() {
		return html`
			<span>${this.text}</span>
			<slot></slot>
		`;
	}
}

customElements.define('d2l-custom-menu-item', CustomMenuItem);

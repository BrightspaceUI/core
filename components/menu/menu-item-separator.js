import '../colors/colors.js';
import { css, LitElement } from 'lit-element/lit-element.js';

class MenuItemSeparator extends LitElement {

	static get properties() {
		return {
			role: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				border-top: 1px solid var(--d2l-color-corundum);
				display: block;
				margin-top: -1px;
				position: relative;
				z-index: 1;
			}
		`;
	}

	constructor() {
		super();

		this.role = 'separator';
	}
}

customElements.define('d2l-menu-item-separator', MenuItemSeparator);

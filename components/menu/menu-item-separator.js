import '../colors/colors.js';
import { css, LitElement } from 'lit-element/lit-element.js';

/**
 * A component for displaying a more distinct separator between menu items.
 */
class MenuItemSeparator extends LitElement {

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

	firstUpdated() {
		super.firstUpdated();

		this.setAttribute('role', 'separator');
	}
}

customElements.define('d2l-menu-item-separator', MenuItemSeparator);

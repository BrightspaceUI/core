import { css, LitElement } from 'lit';

/**
 * A component for displaying a more distinct separator between menu items.
 */
class MenuItemSeparator extends LitElement {

	static get styles() {
		return css`
			:host {
				border-top: 1px solid var(--d2l-menu-separator-color);
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

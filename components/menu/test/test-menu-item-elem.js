import { html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemMixin } from '../menu-item-mixin.js';

class TestMenuItemElem extends MenuItemMixin(LitElement) {
	render() {
		return html`
			<div id="my-menu-item" text="Lorem ipsum dolor sit amet."></div>
		`;
	}
}

customElements.define('test-menu-item-elem', TestMenuItemElem);

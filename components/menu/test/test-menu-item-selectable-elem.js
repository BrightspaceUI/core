import { html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemSelectableMixin } from '../menu-item-selectable-mixin.js';

class TestMenuItemSelectableElem extends MenuItemSelectableMixin(LitElement) {
	render() {
		return html`
			<div text="Lorem ipsum dolor sit amet."></div>
		`;
	}
}

customElements.define('test-menu-item-selectable-elem', TestMenuItemSelectableElem);

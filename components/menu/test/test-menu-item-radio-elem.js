import { html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemRadioMixin } from '../menu-item-radio-mixin.js';

class TestMenuItemRadioElem extends MenuItemRadioMixin(LitElement) {
	render() {
		return html`
			<div text="Lorem ipsum dolor sit amet."></div>
		`;
	}
}

customElements.define('test-menu-item-radio-elem', TestMenuItemRadioElem);

import '../menu/menu-item-checkbox.js';
import { html, LitElement } from 'lit-element/lit-element.js';

class FilterDimensionMenuItem extends LitElement {

	static get properties() {
		return {
			selected: { type: Boolean, reflect: true },
			text: { type: String }
		};
	}

	constructor() {
		super();
		this.selected = false;
	}

	render() {
		return html`
			<d2l-menu-item-checkbox @d2l-menu-item-select="${this._onMenuItemSelect}" text="${this.text}" value="${this.text}" ?selected="${this.selected}"></d2l-menu-item-checkbox>
		`;
	}

	giveMeMenuItem() {
		return this.shadowRoot.querySelector('d2l-menu-item-checkbox');
	}

	_onMenuItemSelect() {
		this.selected = !this.selected;
	}

}

customElements.define('d2l-filter-dimension-menu-item', FilterDimensionMenuItem);

import '../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemMixin } from '../menu/menu-item-mixin.js';
import { menuItemStyles } from '../menu/menu-item-styles.js';

class FilterDimensionMenuItem extends MenuItemMixin(LitElement) {

	static get properties() {
		return {
			checked: { type: Boolean, reflect: true },
			text: { type: String }
		};
	}

	static get styles() {
		return [menuItemStyles, css`
			:host {
				align-items: center;
				display: flex;
				padding: 0.75rem 1rem;
			}
			d2l-input-checkbox {
				margin-bottom: 0;
				pointer-events: none;
			}
		`];
	}

	constructor() {
		super();
		this.checked = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-menu-item-select', this._onMenuItemSelect);
	}

	render() {
		return html`
			<d2l-input-checkbox tabindex="-1" ?checked="${this.checked}">${this.text}</d2l-input-checkbox>
		`;
	}

	_onMenuItemSelect() {
		this.checked = !this.checked;
	}

}

customElements.define('d2l-filter-dimension-menu-item', FilterDimensionMenuItem);

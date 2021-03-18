import '../list/list.js';
import '../list/list-item.js';
import '../hierarchical-view/hierarchical-view.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemMixin } from '../menu/menu-item-mixin.js';
import { menuItemStyles } from '../menu/menu-item-styles.js';

class FilterDimensionList extends MenuItemMixin(LitElement) {

	static get properties() {
		return {
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
			d2l-icon {
				flex: none;
				margin-left: 6px;
			}
			:host([dir="rtl"]) d2l-icon {
				margin-left: 0;
				margin-right: 6px;
			}
		`];
	}

	render() {
		const icon = html`<d2l-icon icon="tier1:chevron-right"></d2l-icon>`;

		return html`
			<div class="d2l-menu-item-text">${this.text}</div>
			<div class="d2l-menu-item-supporting"><slot name="supporting"></slot></div>
			${icon}
			<d2l-hierarchical-view id="${this.text}">
				<d2l-list grid label="${this.text}">
					<slot></slot>
				</d2l-list>
			</d2l-hierarchical-view>
		`;
	}

}

customElements.define('d2l-filter-dimension-list', FilterDimensionList);

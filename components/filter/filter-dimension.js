import '../icons/icon.js';
import '../hierarchical-view/hierarchical-view.js';
import '../menu/demo/custom-view.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemMixin } from '../menu/menu-item-mixin.js';
import { menuItemStyles } from '../menu/menu-item-styles.js';

class FilterDimension extends MenuItemMixin(LitElement) {

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
			<slot>
				<d2l-custom-view>
					There will be another menu in here, eventually.
				</d2l-custom-view>
			</slot>
		`;
	}

}

customElements.define('d2l-filter-dimension', FilterDimension);

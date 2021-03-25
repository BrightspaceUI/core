import '../menu/menu.js';
import '../menu/menu-item.js';
import { html, LitElement } from 'lit-element/lit-element.js';

class FilterDimensionMenu extends LitElement {

	static get properties() {
		return {
			name: { type: String }
		};
	}

	render() {
		return html`
			<d2l-menu-item text="${this.name}">
				<d2l-menu @d2l-hierarchical-view-show-start="${this._show}" id="${this.name}" label="${this.name}" no-return-items>
					<slot></slot>
				</d2l-menu>
			</d2l-menu-item>
		`;

	}

	giveMeMenuItem() {
		return this.shadowRoot.querySelector('d2l-menu-item');
	}

	hide() {
		this.shadowRoot.querySelector('d2l-menu').hide();
	}

	_show() {
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-show', { detail: { dimension: this }, bubbles: true, composed: false }));
	}

}

customElements.define('d2l-filter-dimension-menu', FilterDimensionMenu);

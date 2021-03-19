import '../menu/menu-item-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class FilterDimensionMenuItem extends LitElement {

	static get properties() {
		return {
			selected: { type: Boolean, reflect: true },
			text: { type: String }
		};
	}

	static get styles() {
		return [css`
			d2l-input-checkbox {
				margin-bottom: 0;
				pointer-events: none;
			}
		`];
	}

	constructor() {
		super();
		this.selected = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-menu-item-select', this._onMenuItemSelect);
	}

	render() {
		return null;
	}

	renderItem() {
		return html`
			<style>
				:host {
					align-items: center;
					display: flex;
					padding: 0.75rem 1rem;
				}
				d2l-input-checkbox {
					margin-bottom: 0;
					pointer-events: none;
				}
			</style>
			<d2l-menu-item-checkbox text="${this.text}" value="${this.text}" ?selected="${this.selected}"></d2l-menu-item-checkbox>
		`;
	}

	_onMenuItemSelect() {
		this.selected = !this.selected;
	}

}

customElements.define('d2l-filter-dimension-menu-item', FilterDimensionMenuItem);

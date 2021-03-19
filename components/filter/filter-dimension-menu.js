import '../button/button-icon.js';
import '../button/button-subtle.js';
import '../inputs/input-search.js';
import '../menu/menu.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyStandardStyles } from '../typography/styles.js';

class FilterDimensionMenu extends LitElement {

	static get properties() {
		return {
			name: { type: String },
			_items: { type: Array }
		};
	}

	static get styles() {
		return [bodyStandardStyles, css`
			d2l-input-search {
				padding-right: 12px;
			}
			.back {
				display: flex;
				padding-bottom: 18px;
			}
			.header {
				display: flex;
				width: 100%;
				align-self: center;
				justify-content: center;
    			padding-right: 42px;
			}
			.header-container {
				display: flex;
			}
			.header-container d2l-button-subtle {
				padding-right: 6px;;
			}
		`];
	}

	firstUpdated() {
		super.firstUpdated();

		this._hide = this._hide.bind(this);
		this._show = this._show.bind(this);

		this._itemSlot = this.shadowRoot.querySelector('slot');
	}

	render() {
		return html`
			<slot @slotchange="${this._handleSlotChange}"></slot>
		`;

	}

	renderHeader() {
		return html`
			<style>
				d2l-input-search {
					padding-right: 12px;
				}
				.back {
					display: flex;
					padding-bottom: 18px;
				}
				.header {
					display: flex;
					width: 100%;
					align-self: center;
					justify-content: center;
					padding-right: 42px;
				}
				.header-container {
					display: flex;
				}
				.header-container d2l-button-subtle {
					padding-right: 6px;;
				}
			</style>
			<div class="back">
				<d2l-button-icon @click="${this._hide}" icon="tier1:chevron-left" text="Back"></d2l-button-icon>
				<div class="header d2l-body-standard">${this.name}</div>
			</div>
			<div class="header-container">
				<d2l-button-subtle text="Clear"></d2l-button-subtle>
				<d2l-input-search label="Search" placeholder="Search ${this.name}"></d2l-input-search>
			</div>
		`;
	}

	renderItems() {
		return html`
			<d2l-menu @d2l-hierarchical-view-show-start="${this._show}" id="${this.name}" label="${this.name}" no-return-items>
				${this._getItems()}
			</d2l-menu>
		`;
	}

	_getItems() {
		return this._items.map(item => {
			return html`${item.renderItem()}`;
		});
	}

	_getSlotItems() {
		const nodes = this._itemSlot.assignedNodes();
		const filteredNodes = nodes.filter((node) => {
			const isNode = node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'template';
			return isNode;
		});

		return filteredNodes;
	}

	_handleSlotChange() {
		this._items = this._getSlotItems();
	}

	_hide() {
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-hide', { detail: { dimension: this }, bubbles: true, composed: false }));
	}

	_show() {
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-show', { detail: { dimension: this }, bubbles: true, composed: false }));
	}

}

customElements.define('d2l-filter-dimension-menu', FilterDimensionMenu);

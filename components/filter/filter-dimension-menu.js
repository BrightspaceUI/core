import '../menu/menu.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class FilterDimensionMenu extends LitElement {

	static get properties() {
		return {
			name: { type: String },
			_items: { type: Array }
		};
	}

	static get styles() {
		return [css`
			slot {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this._items = [];
	}

	firstUpdated() {
		super.firstUpdated();

		this._show = this._show.bind(this);

		this._itemSlot = this.shadowRoot.querySelector('slot');
	}

	render() {

		const items = this._getItems();

		return html`
			<d2l-menu @d2l-hierarchical-view-show-start="${this._show}" id="${this.name}" label="${this.name}" no-return-items>
				<slot @slotchange="${this._handleSlotChange}"></slot>
				${items}
			</d2l-menu>
		`;

	}

	_getItems() {
		return this._items.map(item => {
			return html`${item.shadowRoot}`; // This is empty for some reason
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
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-change', { bubbles: true, composed: false }));
	}

	_show() {
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-show', { detail: { dimension: this }, bubbles: true, composed: false }));
	}

}

customElements.define('d2l-filter-dimension-menu', FilterDimensionMenu);

import { html, LitElement } from 'lit-element/lit-element.js';

class FilterDimensionMenu extends LitElement {

	static get properties() {
		return {
			name: { type: String },
			disableSearch: { type: Boolean, attribute: 'disable-search' }
		};
	}

	constructor() {
		super();
		this.disableSearch = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._itemSlot = this.shadowRoot.querySelector('slot');
	}

	render() {
		return html`<slot @slotchange="${this._handleSlotChange}"></slot>`;

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
		console.log('ITEM SLOT CHANGE');
		const items = this._getSlotItems();
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-change', { bubbles: true, composed: false }));
	}

}

customElements.define('d2l-filter-dimension-menu', FilterDimensionMenu);

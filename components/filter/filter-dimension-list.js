import { html, LitElement } from 'lit-element/lit-element.js';

class FilterDimensionList extends LitElement {

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

	render() {
		return html`<slot @slotchange="${this._handleSlotChange}"></slot>`;

	}

	_handleSlotChange() {
		console.log('firing change');
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-change', { bubbles: true, composed: false }));
	}

}

customElements.define('d2l-filter-dimension-list', FilterDimensionList);

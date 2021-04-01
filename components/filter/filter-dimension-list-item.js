import { LitElement } from 'lit-element/lit-element.js';

class FilterDimensionListItem extends LitElement {

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

	updated(changedProperties) {
		super.updated(changedProperties);
		//console.log(changedProperties);
		changedProperties.forEach((_, prop) => {
			if (prop === 'selected'  && changedProperties.get('selected') !== undefined) {
				console.log('selected', this.selected);
				this.dispatchEvent(new CustomEvent('d2l-filter-dimension-list-item-change', { detail: { selected: this.selected }, bubbles: true, composed: false }));
			} else if (prop === 'text' && changedProperties.get('text') !== undefined) {
				console.log('text');
			}
		});
	}

}

customElements.define('d2l-filter-dimension-list-item', FilterDimensionListItem);

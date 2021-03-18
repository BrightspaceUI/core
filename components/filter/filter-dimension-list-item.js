import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ListItemMixin } from '../list/list-item-mixin.js';

class FilterDimensionListItem extends ListItemMixin(LitElement) {

	static get properties() {
		return {
			text: { type: String }
		};
	}

	static get styles() {
		return [super.styles, css`
			input[type="checkbox"].d2l-input-checkbox {
				margin: 0;
			}
			[slot="control"] {
				margin-left: 18px;
			}
			d2l-list-item-generic-layout {
				align-items: center;
			}
		`];
	}

	constructor() {
		super();
		this.selectable = true;

	}

	render() {
		return this._renderListItem({
			illustration: null,
			content: html`<div>${this.text}</div>`,
			actions: null
		});
	}

}

customElements.define('d2l-filter-dimension-list-item', FilterDimensionListItem);

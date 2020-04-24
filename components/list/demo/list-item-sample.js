import '../list-item-generic.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
//import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';
//import { ListItemDragMixin } from '../list-item-drag-mixin.js';

class ListItemSample extends LitElement {
	static get properties() {
		return {
			breakpoints: { type: Array },
			disabled: {type: Boolean },
			href: { type: String },
			key: { type: String, reflect: true },
			role: { type: String, reflect: true },
			_breakpoint: { type: Number }
		}
	}

	static get styles() {
		return [ (super.styles ? super.styles : css``)];
	}

	render() {
		return html`
			<d2l-list-item-generic>
				${ this._renderDragHandle ? this._renderDragHandle() : '' }
				${ this._renderCheckbox ? this._renderCheckbox() : '' }
				<div slot="outside-control-area">=</div>
				<div slot="control-area">[ ]</div>
				<div slot="content-area"></div>
				<div slot="actions-area">Actions</div>
			</d2l-list-item-generic>
		`;
	};
}

customElements.define('d2l-list-item-sample', ListItemSample);

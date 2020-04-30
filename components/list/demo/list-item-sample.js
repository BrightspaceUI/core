import '../list-item-generic.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';
//import { ListItemDragMixin } from '../list-item-drag-mixin.js';

class ListItemSample extends ListItemCheckboxMixin(LitElement) {
	// TODO: Role and breakpoints to live elsewhere
	static get properties() {
		return {
			href: { type: String }
		};
	}

	// TODO: Placeholder grid styles to be replaced with list-item-generic
	static get styles() {
		return [ (super.styles ? super.styles : css``)];
	}

	render() {
		return html`
			<d2l-list-item-generic>
				${ this._renderDragHandle ? this._renderDragHandle() : html`
				<div slot="outside-control">=</div>
				` }
				${ this._renderCheckbox() }
				<div slot="content">
					<slot></slot>
				</div>
				<div slot="actions">
					<slot name="actions">Actions</slot>
				</div>
			</d2l-list-item-generic>
		`;
	}
}

customElements.define('d2l-list-item-sample', ListItemSample);

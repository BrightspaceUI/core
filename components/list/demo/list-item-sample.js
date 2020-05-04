import '../list-item-generic-layout.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';
//import { ListItemDragMixin } from '../list-item-drag-mixin.js';
import { nothing } from 'lit-html';

class ListItemSample extends ListItemCheckboxMixin(LitElement) {
	// TODO: Role and breakpoints to live elsewhere
	// TODO: draggable should be part of the ListItemDragMixin and removed here
	static get properties() {
		return {
			href: { type: String },
			draggable: { type: Boolean }
		};
	}

	static get styles() {
		return [ super.styles, css`
			[slot="control"] {
				width: 40px;
			}
		`];
	}

	render() {
		return html`
			<d2l-list-item-generic-layout>
				${ this.draggable ? html`
				<div slot="outside-control">${ this._renderDragHandle ? this._renderDragHandle() : '=' }</div>
				` : nothing }
				${this.selectable ? html`
				<div slot="control">${ this._renderCheckbox() }</div>
				<div slot="control-action">${ this._renderCheckboxAction() }</div>
				` : nothing }
				<div slot="content">
					<slot></slot>
				</div>
				<div slot="actions">
					<slot name="actions"></slot>
				</div>
			</d2l-list-item-generic-layout>
		`;
	}
}

customElements.define('d2l-list-item-sample', ListItemSample);

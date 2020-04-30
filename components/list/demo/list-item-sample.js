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
		return [ (super.styles ? super.styles : css``), css`
			.list-grid {
				display: grid;
				grid-template-columns:
					[start outside-control-start] 40px
					[control-start outside-control-end] 40px
					[control-end content-start] auto
					[content-end actions-start] auto
					[end actions-end];
			}
			[slot="content"]{
				grid-column: content-start / content-end;
				grid-row: 1 / 2;
			}
			::slotted([slot="actions"]) {
				grid-column: actions-start / actions-end;
				grid-row: 1 / 2;
				z-index: 4;
			}
		`];
	}
	render() {
		return html`
			<div class="list-grid">
				${ this._renderDragHandle ? this._renderDragHandle() : html`
					<div>=</div>
				` }
				${ this._renderCheckbox() }
				<div slot="content">
					<slot></slot>
				</div>
				<slot name="actions"></slot>
			</div>
		`;
	}
}

customElements.define('d2l-list-item-sample', ListItemSample);

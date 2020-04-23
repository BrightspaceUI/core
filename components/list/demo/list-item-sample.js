import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';
//import { ListItemDragMixin } from '../list-item-drag-mixin.js';

class ListItemSample extends ListItemCheckboxMixin(LitElement) {
	static get properties() {
		return {
			href: { type: String }
		};
	}

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
			.d2l-list-item-content {
				grid-column: content-start / content-end;
				grid-row: 1 / 2;
			}
			.d2l-list-item-actions {
				grid-column: actions-start / actions-end;
				grid-row: 1 / 2;
			}
		`];
	}
	render() {
		return html`
			<div class="list-grid">
				${ this._renderDragHandle ? this._renderDragHandle() : '' }
				${ this._renderCheckbox() }
				<div class="d2l-list-item-content"></div>
				<div class="d2l-list-item-actions"></div>
			</div>
		`;
	}
}

customElements.define('d2l-list-item-sample', ListItemSample);

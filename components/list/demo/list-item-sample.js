import '../list-item-generic-layout.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../../helpers/uniqueId.js';
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
			a[href].d2l-list-item-link {
				width: 100%;
				height: 100%;
			}
			:host([href]) {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			.d2l-list-item-content[hover],
			.d2l-list-item-content[focus] {
				--d2l-list-item-content-text-decoration: underline;
			}
			:host([href]) .d2l-list-item-link:focus {
				outline: none;
			}
		`];
	}

	constructor() {
		super();
		this._contentId = getUniqueId();
	}

	render() {
		return html`
			<d2l-list-item-generic-layout>
				${ this.draggable ? html`
				<div slot="outside-control">${ this._renderDragHandle ? this._renderDragHandle() : '=' }</div>
				` : nothing }
				${this.selectable ? html`
				<div slot="control">${ this._renderCheckbox() }</div>
				<div slot="control-action" aria-labelledby="${this._contentId}">${ this._renderCheckboxAction() }</div>
				` : nothing }
				${ this.href ? html`
				<a slot="content-action"
					class="d2l-list-item-link"
					href="${this.href}"
					aria-labelledby="${this._contentId}"
					@mouseover="${this._anchorEventHandler}"
					@mouseout="${this._anchorEventHandler}"
					@focus="${this._anchorEventHandler}"
					@blur="${this._anchorEventHandler}"></a>
				` : nothing }
				<div slot="content" id="${this._contentId}" class="d2l-list-item-content">
					<slot></slot>
				</div>

				<div slot="actions">
					<slot name="actions"></slot>
				</div>
			</d2l-list-item-generic-layout>
		`;
	}

	_anchorEventHandler(event) {
		const content = this.shadowRoot.querySelector(`#${this._contentId}`);
		switch (event.type) {
			case 'mouseover':
				content.setAttribute('hover', '');
				break;
			case 'mouseout':
				content.removeAttribute('hover');
				break;
			case 'focus':
				content.setAttribute('focus', '');
				break;
			case 'blur':
				content.removeAttribute('focus', '');
				break;
		}
	}
}

customElements.define('d2l-list-item-sample', ListItemSample);

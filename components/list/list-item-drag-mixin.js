import { getUniqueId } from '../../helpers/uniqueId.js';
import { html } from 'lit-element/lit-element.js';
import { nothing } from 'lit-html';

export const ListItemDragMixin = superclass => class extends superclass {

	static get properties() {
		return {
			draggable: {type: Boolean, reflect: true },
			key: { type: String, reflect: true }
		};
	}

	constructor() {
		super();
		this._itemDragId = getUniqueId();
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.key === undefined) {
			this.draggable = undefined;
		}
	}

	_dispatchDragEvent(detail) {
		this.dispatchEvent(new CustomEvent('d2l-list-item-position', {
			detail,
			bubbles: true
		}));
	}

	keyboardMode(isEnabled) {
		if (isEnabled) {
			this.dispatchEvent(new CustomEvent('d2l-list-item-drag-keyboard-mode', {
				detail: null,
				bubbles: true
			}));
		}
	}

	_renderDragHandle() {
		return this.draggable ? html`
			<div
				id="${this._itemDragId}"
				class="d2l-list-item-drag"
				?draggable="${this.draggable}"
				@change="${this._handleDragChange}"
			></div>
		` : nothing;
	}

	_renderDragAction(inner) {
		return this.draggable ? html`
			<div @click="${this._handleDragActionClick}" class="d2l-list-item-drag-action">${inner}</div>
			` : nothing;
	}

	_handleDragActionClick() {
		if (!this.draggable) {
			return;
		}
		this._dragStartHanlders();
	}

	_handleDragChange() {
		this._dragStartHanlders();
		this._dragEnter();
		this._dragStopHanlders();
	}

	moveBefore(itemKey) {
		if (itemKey === undefined) {
			return;
		}
		if (itemKey === null) {
			this._dispatchDragEvent(null);
		}
	}

	moveAfter(itemKey) {
		if (itemKey === undefined) {
			return;
		}
		if (itemKey === null) {
			this._dispatchDragEvent(null);
		}
	}

	// TODO
	_copy() {

	}

	// TODO
	_removeCopy() {
	}

	_dropHandlers() {
		this._dispatchDragEvent(null);
	}

	_dragOverHandlers() {
		this._dispatchDragEvent(null);
	}

	_dragExit() {
		this._dispatchDragEvent(null);
		this._dragStopHanlders();
	}
	_dragEnter() {
		this._dragStartHanlders();
	}
	_dragStartHandlers() {
		this.moveBefore();
	}
	_dragStopHanlders() {
		this.moveAfter();
	}
};

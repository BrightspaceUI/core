import { announce } from '@brightspace-ui/core/helpers/announce.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { html } from 'lit-element/lit-element.js';
import { nothing } from 'lit-html';

export const ListItemDragMixin = superclass => class extends superclass {

	static get properties() {
		return {
			draggable: { type: Boolean, reflect: true },
			key: { type: String, reflect: true }
		};
	}

	constructor() {
		super();
		this._itemDragId = getUniqueId();
	}

	connectedCallback() {
		super.connectedCallback();
		if (!this.key) {
			this.draggable = false;
		}
	}

	keyboardMode(isEnabled) {
		if (isEnabled) {
			this.dispatchEvent(new CustomEvent('d2l-list-item-drag-keyboard-mode', {
				detail: null,
				bubbles: true
			}));
		}
	}

	moveAfter(itemKey) {
		if (itemKey === undefined) {
			return;
		}
		this._dispatchDragEvent(itemKey);
	}

	moveBefore(itemKey) {
		if (itemKey === undefined) {
			return;
		}

		this._dispatchDragEvent(itemKey);
	}

	// TODO
	_copy() {

	}

	_dispatchDragEvent(detail) {
		this.dispatchEvent(new CustomEvent('d2l-list-item-position', {
			detail: detail,
			bubbles: true
		}));
	}

	_dragEnter() {
		this._dragStartHandler();
	}

	_dragExit() {
		this._dispatchDragEvent(null);
	}

	_dragStartHandler() {
		this.moveBefore(null);
		this._dispatchDragEvent(null);
	}

	_dragStopHandler() {
		this._dispatchDragEvent(null);
		this.moveafter(null);
	}

	// TODO
	_removeCopy() {

	}

	_renderDragAction(inner) {
		return this.draggable ? html`
			<div @click="${this._handleDragActionClick}" class="d2l-list-item-drag-action">${inner}</div>
			` : nothing;
	}
	_renderDragHandle() {
		return this.draggable ? html`
			<div
				id="${this._itemDragId}"
				class="d2l-list-item-drag"
				@dragenter="${this._dragEnter}"
				@dragleave="${this._dragExit}"
			></div>
		` : nothing;
	}
};

export class NewPositionEventDetails {
	constructor(object) {
		this.node = object.node;
		this.oldPosition = object.oldPosition;
		this.position = object.position;
		this.temporaryMovement = object.tempMovement;
	}

	/**
	 * Reorders an array in place with the current event information
	 * @param { Array } list The array to reorder
	 * @param { function(any, Number): String } [announceCallback] Callback function that returns the announcement text
	 *        Takes the item in the array and the index as arguments. Should return the text to announce.
	 *        This optional callback will be passed to announceMove if given.
	 */
	reorder(list, announceCallback = null) {
		if (this.position === undefined || this.position === this.oldPosition) return;

		if (list[this.position] === undefined || list[this.oldPosition] === undefined ) {
			throw new Error('Reorder failed. Position does not exist in list.');
		}

		// move the item in the list to a new position in place
		const item = list[this.oldPosition];
		// now that we have a reference to the item, shove everything between the
		// new position to the oldPosition over one
		if (this.oldPosition > this.position) {
			// shove to the right ♪┗ ( ･o･) ┓♪
			for (let i = this.oldPosition; i > this.position; i--) {
				list[i] = list[i - 1];
			}
		} else {
			// shove to the left ♪┏(・o･)┛♪
			for (let i = this.oldPosition; i < this.position; i++) {
				list[i] = list[i + 1];
			}
		}
		// there is now a copy of the left or rightmost item where the new
		// position is; stick the item in this spot.
		list[this.position] = item;

		if (announceCallback) {
			this.announceMove(list, announceCallback);
		}
	}

	/**
	 * Announces a move to screen readers on an array
	 * @param { Array } list The array to announce the move on.
	 * @param { function(any, Number): String } announceCallback Callback function that returns the announcement text
	 *        Takes the item in the array and the index as arguments. Should return the text to announce.
	 */
	announceMove(list, announceCallback) {
		const item = list[this.position];
		if (!item) throw new Error('Item to announce move not found in given array.');
		const message = announceCallback(item, this.position);
		if (message) announce(message);
	}
}

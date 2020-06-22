import { announce } from '../../helpers/announce.js';
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
	/**
	 * @param { Object } object An simple object with the position event properties
	 * @param { String } object.targetKey The item key of the list-item that is moving
	 * @param { String } object.destinationKey The item key of the list-item in the position we are moving to
	 * @param { String } object.temporaryMovement Information on whether the item is entering or exiting temporary movement
	 */
	constructor(object) {
		this.targetKey = object.targetKey;
		this.destinationKey = object.destinationKey;
		this.temporaryMovement = object.temporaryMovement;
	}

	/**
	 * Announces a move to screen readers on an array
	 * @param { Array<Node> } list The array to announce the move on.
	 * @param { function(any, Number): String } announceCallback Callback function that returns the announcement text
	 *        Takes the item in the array and the index as arguments. Should return the text to announce.
	 */
	announceMove(list, announceCallback) {
		const index = this.fetchPosition(list, this.targetKey);
		if (index === null) throw new Error('Item to announce move not found in given array.');
		const item = list[index];
		const message = announceCallback(item, index);
		if (message) announce(message);
	}

	/**
	 * Fetches an index position within a list given an item key
	 * @param { Array<Node> } list Array of nodes
	 * @param { String } key Item key to fetch position of
	 */
	fetchPosition(list, key) {
		const index = list.findIndex(x => x.key === key);
		return index === -1 ? null : index;
	}

	/**
	 * Reorders an array in place with the current event information
	 * The item will be moved to the position of the destinationKey. Array elements shift
	 * forward one to make room.
	 * @param { Array<Node> } list The array to reorder
	 * @param { function(any, Number): String } [announceCallback] Callback function that returns the announcement text
	 *        Takes the item in the array and the index as arguments. Should return the text to announce.
	 *        This optional callback will be passed to announceMove if given.
	 */
	reorder(list, announceCallback = null) {
		if (this.destinationKey === undefined || this.destinationKey === this.targetKey) return;

		const origin = this.fetchPosition(list, this.targetKey);
		const destination = this.fetchPosition(list, this.destinationKey);

		if (origin === null || destination === null) {
			throw new Error('Reorder failed. Position does not exist in list.');
		}

		// move the item in the list to a new position in place
		const item = list[origin];
		// now that we have a reference to the item, shove everything between the
		// destination to the origin over one
		if (origin > destination) {
			// shove to the right ♪┗ ( ･o･) ┓♪
			for (let i = origin; i > destination; i--) {
				list[i] = list[i - 1];
			}
		} else {
			// shove to the left ♪┏(・o･)┛♪
			for (let i = origin; i < destination; i++) {
				list[i] = list[i + 1];
			}
		}
		// there is now a copy of the left or rightmost item where the new
		// position is; stick the item in this spot.
		list[destination] = item;

		if (announceCallback) {
			this.announceMove(list, announceCallback);
		}
	}
}

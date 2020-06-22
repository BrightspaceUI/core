import { css, html } from 'lit-element/lit-element.js';
import { announce } from '../../helpers/announce.js';
import { dragActions } from './list-item-drag-handle.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { nothing } from 'lit-html';

export const ListItemDragMixin = superclass => class extends superclass {

	static get properties() {
		return {
			draggable: { type: Boolean, reflect: true },
			key: { type: String, reflect: true },
			_keyboardMode: { type: Boolean }
		};
	}

	static get styles() {
		const styles = [ css`
			:host {
				display: block;
				position: relative;
			}
			:host[hidden] {
				display: none;
			}
			.d2l-list-item-drag-area {
				height: 100%;
				cursor: grab;
			}
			.d2l-list-item-drag-drop-grid {
				display: grid;
				grid-template-columns: 100%;
				grid-template-rows: 0.3rem 1fr 1fr 0.3rem;
				height: 100%;
				left: 0;
				pointer-events: none;
				position: absolute;
				top: 0;
				width: 100%;
				z-index: 100;

			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
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

	_handleDragAreaClick(e) {
		this.shadowRoot.querySelector(`#${this._itemDragId}`).activateKeyboardMode();
		e.preventDefault();
	}

	_handleDragHandleActions(e) {
		if (e.detail.action === dragActions.active) {
			this._keyboardMode = true;
		} else if (e.detail.action === dragActions.cancel || e.detail.action === dragActions.save) {
			this._keyboardMode = false;
		}
	}

	_renderDraggableArea(templateMethod) {
		templateMethod = templateMethod || (dragArea => dragArea);
		return this.draggable && !this._keyboardMode ? templateMethod(html`
			<div
				class="d2l-list-item-drag-area"
				@click="${this._handleDragAreaClick}"
				@dragstart="${this._handleDragStart}"
				@dragend="${this._handleDragEnd}"
				>
			</div>
		`) : nothing;
	}

	_renderDragHandle(templateMethod) {
		templateMethod = templateMethod || (dragHandle => dragHandle);
		return this.draggable ? templateMethod(html`
			<d2l-list-item-drag-handle id="${this._itemDragId}" @d2l-list-item-drag-handle-action="${this._handleDragHandleActions}"></d2l-list-item-drag-handle>
		`) : nothing;
	}

	_renderDropArea(templateMethod) {
		templateMethod = templateMethod || (dropArea => dropArea);
		return this.draggable && !this._keyboardMode ? templateMethod(html`
			<div class="d2l-list-item-drag-drop-grid" @drop="${this._dropHandler}" @dragover="${this._dragOverHandler}">
				<div @dragenter="${this._dragTopEnter}" @dragleave="${this._dragTopLeave}"></div>
				<div @dragenter="${this._dragUpperEnter}" @dragleave="${this._dragUpperLeave}"></div>
				<div @dragenter="${this._dragLowerEnter}" @dragleave="${this._dragLowerLeave}"></div>
				<div @dragenter="${this._dragBottomEnter}" @dragleave="${this._dragBottomLeave}"></div>
			</div>
		`) : nothing;
	}
};

export class NewPositionEventDetails {
	/**
	 * @param { Object } object An simple object with the position event properties
	 * @param { String } object.targetKey The item key of the list-item that is moving
	 * @param { String } object.destinationKey The item key of the list-item in the position we are moving to
	 * @param { String } object.temporaryMovement Information on whether the item is entering or exiting temporary movement
	 */
	constructor({targetKey, destinationKey, temporaryMovement}) {
		if (!targetKey || !destinationKey) {
			throw new Error(`NewPositionEventDetails must have a targetKey and destinationKey\nGiven: ${targetKey} and ${destinationKey}`);
		}
		this.targetKey = targetKey;
		this.destinationKey = destinationKey;
		this.temporaryMovement = temporaryMovement;
	}

	/**
	 * Announces a move to screen readers on an array
	 * @param { Array<Node> } list The array to announce the move on.
	 * @param { Object } obj Object containing callback functions
	 * @param { function(any, Number): String } obj.announceFn Callback function that returns the announcement text
	 *        Takes the item in the array and the index as arguments. Should return the text to announce.
	 * @param { function(Node): String } obj.keyFn Callback function that returns a key given a listitem
	 */
	announceMove(list, {announceFn, keyFn}) {
		const targetIndex = this.fetchPosition(list, this.targetKey, keyFn);
		const destinationIndex = this.fetchPosition(list, this.destinationKey, keyFn);
		if (targetIndex === null) throw new Error(`Target "${this.targetKey}" not found in array`);
		if (destinationIndex === null) throw new Error(`Destination "${this.destinationKey}" not found in array`);

		const message = announceFn(list[targetIndex], destinationIndex);
		if (message) announce(message);
	}

	/**
	 * Fetches an index position within a list given an item key
	 * @param { Array<Node> } list Array of nodes
	 * @param { String } key Item key to fetch position of
	 * @param { function(Node): String } keyFn Function that returns the key from a list item
	 */
	fetchPosition(list, key, keyFn) {
		const index = list.findIndex(x => keyFn(x) === key);
		return index === -1 ? null : index;
	}

	/**
	 * Reorders an array in place with the current event information
	 * The item will be moved to the position of the destinationKey. Array elements shift
	 * forward one to make room.
	 * @param { Array<Node> } list The array to reorder
	 * @param { Object } obj An object containing callback functions
	 * @param { function(any, Number): String } obj.announceFn (Optional) Callback function that returns the announcement text
	 *        Takes the item in the array and the index as arguments. Should return the text to announce.
	 *        This optional callback will be passed to announceMove if given.
	 * @param { function(Node): String } obj.keyFn Callback function that returns the key for the item.
	 */
	reorder(list, {announceFn, keyFn}) {
		if (this.destinationKey === undefined || this.destinationKey === this.targetKey) return;

		const origin = this.fetchPosition(list, this.targetKey, keyFn);
		const destination = this.fetchPosition(list, this.destinationKey, keyFn);

		if (origin === null || destination === null) {
			throw new Error(`Position not found in list:\n\torigin: ${this.targetKey} at ${origin}\n\tdestination: ${this.destinationKey} at ${destination}`);
		}

		// move the item in the list to a new position in place
		const item = list[origin];
		// now that we have a reference to the item, shove everything between the
		// destination to the origin over one
		if (origin > destination) {
			for (let i = origin; i > destination; i--) {
				list[i] = list[i - 1];
			}
		} else {
			for (let i = origin; i < destination; i++) {
				list[i] = list[i + 1];
			}
		}
		// there is now a copy of the left or rightmost item where the new
		// position is; stick the item in this spot.
		list[destination] = item;

		if (announceFn) {
			this.announceMove(list, announceFn);
		}
	}
}

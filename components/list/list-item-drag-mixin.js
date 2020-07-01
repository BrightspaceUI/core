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
			beingDragged: { type: Boolean, reflect: true, attribute: 'being-dragged' },
			_bottomPlacementMarker: { type: Boolean },
			_dragTarget: { type: Boolean },
			_keyboardMode: { type: Boolean },
			_topPlacementMarker: { type: Boolean }
		};
	}

	static get styles() {
		const styles = [ css`
			:host {
				display: block;
				position: relative;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-list-item-drag-bottom-marker,
			.d2l-list-item-drag-top-marker {
				position: absolute;
				width: 100%;
				z-index: 1;
			}
			.d2l-list-item-drag-bottom-marker {
				bottom: -6px;
			}
			.d2l-list-item-drag-top-marker {
				top: -6px;
			}
			.d2l-list-item-drag-area {
				height: 100%;
			}
			.d2l-list-item-drag-drop-grid {
				display: grid;
				gap: 1px;
				grid-template-columns: 100%;
				grid-template-rows: 0.3rem 1fr 1fr 0.3rem;
				height: 100%;
				left: 0;
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
		this.beingDragged = false;
	}

	connectedCallback() {
		super.connectedCallback();
		if (!this.key) {
			this.draggable = false;
		}
	}

	firstUpdated(changedProperties) {
		this.addEventListener('dragenter', this._hostDragEnter);
		this.addEventListener('dragleave', this._hostDragLeave);
		super.firstUpdated(changedProperties);
	}

	keyboardMode(isEnabled) {
		if (isEnabled) {
			this.dispatchEvent(new CustomEvent('d2l-list-item-drag-keyboard-mode', {
				detail: null,
				bubbles: true
			}));
		}
	}

	moveItemAfterMe(itemKey) {
		if (itemKey === undefined) {
			return;
		}
		this._moveItem(itemKey, this.key);
	}

	moveItemBeforeMe(itemKey) {
		if (itemKey === undefined) {
			return;
		}

		this._moveItem(itemKey, this.previousElementSibling && this.previousElementSibling.key);
	}

	_dragAreaClick(e) {
		this.shadowRoot.querySelector(`#${this._itemDragId}`).activateKeyboardMode();
		e.preventDefault();
	}

	_dragBottomEnter(e) {
		this._inBottomArea = true;
		e.dataTransfer.dropEffect = 'move';
		this._bottomPlacementMarker = true;
		this._topPlacementMarker = false;
	}

	_dragBottomLeave() {
		this._inBottomArea = false;
		setTimeout(() => this._bottomPlacementMarker = false);
	}

	_dragEnd() {
		this.beingDragged = false;
		this.tilt = false;
	}

	_dragHandleActions(e) {
		let destinationKey;
		switch (e.detail.action) {
			case dragActions.active:
				this._keyboardMode = true;
				break;
			case dragActions.cancel:
			case dragActions.save:
				this._keyboardMode = false;
				break;
			case dragActions.up:
				destinationKey = this.previousElementSibling && this.previousElementSibling.previousElementSibling && this.previousElementSibling.previousElementSibling.key;
				this._moveItem(this.key, destinationKey);
				break;
			case dragActions.down:
				destinationKey = this.nextElementSibling && this.nextElementSibling.key;
				this._moveItem(this.key, destinationKey);
				break;
			case dragActions.first:
				this._moveItem(this.key, null);
				break;
			case dragActions.last:
				while (this.nextElementSibling) {
					destinationKey = this.nextElementSibling;
				}
				destinationKey = destinationKey && destinationKey.key;
				this._moveItem(this.key, destinationKey);
				break;
			default:
				break;
		}

	}

	_dragLowerEnter(e) {
		e.dataTransfer.dropEffect = 'move';
		if (this._inBottomArea) {
			this._topPlacementMarker = true;
		}
	}

	_dragOver(e) {
		e.preventDefault();
	}

	_dragStart(e) {
		setTimeout(() => {
			this.beingDragged = true;
		});
		e.dataTransfer.setData('text/plain', `${this.key}`);
		e.dataTransfer.effectAllowed = 'move';
		const node = this.shadowRoot.querySelector('.d2l-list-item-drag-image') || this;
		e.dataTransfer.setDragImage(node, 50, 50);
	}

	_dragTopEnter(e) {
		this._inTopArea = true;
		e.dataTransfer.dropEffect = 'move';
		this._topPlacementMarker = true;
		this._bottomPlacementMarker = false;
	}

	_dragTopLeave() {
		this._inTopArea = false;
		setTimeout(() => this._topPlacementMarker = false);
	}

	_dragUpperEnter(e) {
		e.dataTransfer.dropEffect = 'move';
		if (this._inTopArea) {
			this._bottomPlacementMarker = true;
		}
	}

	_drop(e) {
		const originKey = e.dataTransfer.getData('text/plain');

		if (this._topPlacementMarker) {
			this.moveItemBeforeMe(originKey);
		} else if (this._bottomPlacementMarker) {
			this.moveItemAfterMe(originKey);
		}
		this._topPlacementMarker = false;
		this._bottomPlacementMarker = false;
		this._dragTarget = false;
	}

	_hostDragEnter(e) {
		this._dragTarget = true;
		e.dataTransfer.dropEffect = 'move';
	}

	_hostDragLeave() {
		setTimeout(() => {
			this._dragTarget = false;
			this._topPlacementMarker = false;
			this._bottomPlacementMarker = false;
		});
	}

	_moveItem(origin, destination) {
		this.dispatchEvent(new CustomEvent('d2l-list-item-position', {
			detail: {
				origin,
				destination
			},
			bubbles: true
		}));
	}

	_renderBottomPlacementMarker(renderTemplate) {
		return this._bottomPlacementMarker ? html`<div class="d2l-list-item-drag-bottom-marker">${renderTemplate}</div>` : null;
	}

	_renderDraggableArea(templateMethod) {
		templateMethod = templateMethod || (dragArea => dragArea);
		return this.draggable && !this._keyboardMode ? templateMethod(html`
			<div
				class="d2l-list-item-drag-area"
				draggable="true"
				@click="${this._dragAreaClick}"
				@dragstart="${this._dragStart}"
				@dragend="${this._dragEnd}"
				>
			</div>
		`) : nothing;
	}

	_renderDragHandle(templateMethod) {
		templateMethod = templateMethod || (dragHandle => dragHandle);
		return this.draggable ? templateMethod(html`
			<d2l-list-item-drag-handle id="${this._itemDragId}" @d2l-list-item-drag-handle-action="${this._dragHandleActions}"></d2l-list-item-drag-handle>
		`) : nothing;
	}

	_renderDropArea(templateMethod) {
		templateMethod = templateMethod || (dropArea => dropArea);
		return this.draggable && this._dragTarget ? templateMethod(html`
			<div class="d2l-list-item-drag-drop-grid" @drop="${this._drop}" @dragover="${this._dragOver}">
				<div @dragenter="${this._dragTopEnter}" @dragleave="${this._dragTopLeave}"></div>
				<div @dragenter="${this._dragUpperEnter}"></div>
				<div @dragenter="${this._dragLowerEnter}"></div>
				<div @dragenter="${this._dragBottomEnter}" @dragleave="${this._dragBottomLeave}"></div>
			</div>
		`) : nothing;
	}

	_renderTopPlacementMarker(renderTemplate) {
		return this._topPlacementMarker ? html`<div class="d2l-list-item-drag-top-marker">${renderTemplate}</div>` : null;
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

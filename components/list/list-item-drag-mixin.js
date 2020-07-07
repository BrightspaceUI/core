import { css, html } from 'lit-element/lit-element.js';
import { announce } from '../../helpers/announce.js';
import { dragActions } from './list-item-drag-handle.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { nothing } from 'lit-html';

const move = Object.freeze({
	above: true,
	below: false
});

const timeDelayForLeavingTheDropArea = 1000; //ms

export const ListItemDragMixin = superclass => class extends superclass {

	static get properties() {
		return {
			draggable: { type: Boolean, reflect: true },
			dragText: { type: String, attribute: 'drag-text' },
			key: { type: String, reflect: true },
			dragging: { type: Boolean, reflect: true, attribute: 'dragging' },
			_bottomPlacementMarker: { type: Boolean },
			_dropTarget: { type: Boolean },
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
				grid-template-columns: 100%;
				grid-template-rows: 1rem 1fr 1fr 1rem;
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
		this.dragging = false;
	}

	connectedCallback() {
		super.connectedCallback();
		if (!this.key) {
			this.draggable = false;
		}
	}

	firstUpdated(changedProperties) {
		this.addEventListener('dragenter', this._onHostDragEnter);
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

	_moveItem(targetKey, destinationKey, insertBefore = false, temporaryMovement = false) {
		this.dispatchEvent(new CustomEvent('d2l-list-item-position-change', {
			detail: new NewPositionEventDetails({targetKey, destinationKey, insertBefore, temporaryMovement}),
			bubbles: true
		}));
	}

	_onDragAreaClick(e) {
		this.shadowRoot.querySelector(`#${this._itemDragId}`).activateKeyboardMode();
		e.preventDefault();
	}

	_onDragBottomEnter(e) {
		e.dataTransfer.dropEffect = 'move';
		const dropSpots = dropSpotsFactory();
		dropSpots.setDestination(this, move.below);
		this._inBottomArea = true;
	}

	_onDragEnd(e) {
		const dropSpot = dropSpotsFactory();
		this.dragging = false;
		if (dropSpot.shouldDrop(e.timeStamp)) {
			this._moveItem(dropSpot.targetKey, dropSpot.destinationKey, dropSpot.insertBefore);
		}
		dropSpotsBlowUp();
	}

	_onDragHandleActions(e) {
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
				destinationKey = this.previousElementSibling && this.previousElementSibling.key;
				this._moveItem(this.key, destinationKey, move.above);
				break;
			case dragActions.down:
				destinationKey = this.nextElementSibling && this.nextElementSibling.key;
				this._moveItem(this.key, destinationKey, move.below);
				break;
			case dragActions.first:
				while (this.previousElementSibling) {
					destinationKey = this.previousElementSibling;
				}
				this._moveItem(this.key, destinationKey, true);
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

	_onDragLowerEnter(e) {
		e.dataTransfer.dropEffect = 'move';
		if (this._inBottomArea) {
			const dropSpots = dropSpotsFactory();
			dropSpots.setDestination(this, move.above);
			this._inBottomArea = false;
		}
	}

	_onDragOver(e) {
		const dropSpots = dropSpotsFactory();
		dropSpots.updateTime(e.timeStamp);
		e.preventDefault();
	}

	_onDragStart(e) {
		e.dataTransfer.setData('text/plain', `${this.dragText}`);
		e.dataTransfer.effectAllowed = 'move';

		//legacy edge doesn't support setDragImage. Experience is not degraded for legacy edge by doing this fix.
		if (e.dataTransfer.setDragImage) {
			const nodeImage = this.shadowRoot.querySelector('.d2l-list-item-drag-image') || this;
			e.dataTransfer.setDragImage(nodeImage, 50, 50);
		}

		dropSpotsFactory(this);

		setTimeout(() => {
			this.dragging = true;
		});
	}

	_onDragTopEnter(e) {
		e.dataTransfer.dropEffect = 'move';
		const dropSpots = dropSpotsFactory();
		dropSpots.setDestination(this, move.above);
		this._inTopArea = true;
	}

	_onDragUpperEnter(e) {
		e.dataTransfer.dropEffect = 'move';
		if (this._inTopArea) {
			const dropSpots = dropSpotsFactory();
			dropSpots.setDestination(this, move.below);
			this._inTopArea = false;
		}
	}

	_onDrop() {
		const dropSpots = dropSpotsFactory();
		dropSpots.setDestination(this, dropSpots.insertBefore);
	}

	_onHostDragEnter(e) {
		const dropSpots = dropSpotsFactory();
		if (this === dropSpots.target) {
			return;
		}
		dropSpots.addVisitor(this);
		this._dropTarget = true;
		e.dataTransfer.dropEffect = 'move';
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
				@click="${this._onDragAreaClick}"
				@dragstart="${this._onDragStart}"
				@dragend="${this._onDragEnd}"
				>
			</div>
		`) : nothing;
	}

	_renderDragHandle(templateMethod) {
		templateMethod = templateMethod || (dragHandle => dragHandle);
		return this.draggable ? templateMethod(html`
			<d2l-list-item-drag-handle id="${this._itemDragId}" @d2l-list-item-drag-handle-action="${this._onDragHandleActions}"></d2l-list-item-drag-handle>
		`) : nothing;
	}

	_renderDropArea(templateMethod) {
		templateMethod = templateMethod || (dropArea => dropArea);
		return this.draggable && this._dropTarget ? templateMethod(html`
			<div class="d2l-list-item-drag-drop-grid" @drop="${this._onDrop}" @dragover="${this._onDragOver}">
				<div @dragenter="${this._onDragTopEnter}"></div>
				<div @dragenter="${this._onDragUpperEnter}"></div>
				<div @dragenter="${this._onDragLowerEnter}"></div>
				<div @dragenter="${this._onDragBottomEnter}"></div>
			</div>
		`) : nothing;
	}

	_renderTopPlacementMarker(renderTemplate) {
		return this._topPlacementMarker ? html`<div class="d2l-list-item-drag-top-marker">${renderTemplate}</div>` : null;
	}
};

let dropSpots = null;

function dropSpotsFactory(target) {
	if (!dropSpots) dropSpots = new DropSpotsState(target);
	return dropSpots;

}

function dropSpotsBlowUp() {
	if (dropSpots) {
		dropSpots.clear();
	}
	dropSpots = null;
}

class DropSpotsState {
	constructor(target) {
		this._target = target;
		this._destination = null;
		this._visitedDestination = new Map();
		this._insertBefore = false;
		this._time = 0;
	}

	addVisitor(destination) {
		if (destination && !this._visitedDestination.has(destination)) {
			this._visitedDestination.set(destination, null);
		}
	}

	clear() {
		this._cleanUpOnLeave();
		this._visitedDestination.forEach((_, visitedDestination) => visitedDestination._dropTarget = false);
		this._visitedDestination.clear();
	}

	get destination() {
		return this._destination;
	}

	get destinationKey() {
		return this._destination && this._destination.key;
	}

	get insertBefore() {
		return this._insertBefore;
	}

	setDestination(destination, insertBefore) {
		this._insertBefore = insertBefore;
		if (this._destination === destination) {
			this._setPlacementMarkers();
			return;
		}
		this._cleanUpOnLeave();
		this._destination = destination;
		this._setPlacementMarkers();
		this.addVisitor(destination);
	}

	shouldDrop(time) {
		return time - this._time < timeDelayForLeavingTheDropArea;
	}

	get target() {
		return this._target;
	}

	get targetKey() {
		return this._target && this._target.key;
	}

	updateTime(time) {
		this._time = time;
		if (this._timeoutId) clearTimeout(this._timeoutId);
		this._timeoutId = setTimeout(() => {
			this._cleanUpOnLeave();
			this._destination = null;
		}, timeDelayForLeavingTheDropArea);
	}

	_cleanUpOnLeave() {
		if (!this._destination) return;
		this._destination._topPlacementMarker = false;
		this._destination._bottomPlacementMarker = false;
		this._destination._inTopArea = false;
		this._destination._inBottomArea = false;
	}

	_setPlacementMarkers() {
		this._destination._topPlacementMarker = this.insertBefore;
		this._destination._bottomPlacementMarker = !this.insertBefore;
	}
}

export class NewPositionEventDetails {
	/**
	 * @param { Object } object An simple object with the position event properties
	 * @param { String } object.targetKey The item key of the list-item that is moving
	 * @param { String } object.destinationKey The item key of the list-item in the position we are moving to
	 * @param { Boolean } object.insertBefore Whether the target is moved before the destination
	 * @param { String } object.temporaryMovement Information on whether the item is entering or exiting temporary movement
	 */
	constructor({targetKey, destinationKey, insertBefore, temporaryMovement}) {
		if (!targetKey || !destinationKey) {
			throw new Error(`NewPositionEventDetails must have a targetKey and destinationKey\nGiven: ${targetKey} and ${destinationKey}`);
		}
		this.targetKey = targetKey;
		this.destinationKey = destinationKey;
		this.insertBefore = insertBefore;
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
		let destination = this.fetchPosition(list, this.destinationKey, keyFn);

		if (origin === null || destination === null) {
			throw new Error(`Position not found in list:\n\torigin: ${this.targetKey} at ${origin}\n\tdestination: ${this.destinationKey} at ${destination}`);
		}

		// move the item in the list to a new position in place
		const item = list[origin];
		// now that we have a reference to the item, shove everything between the
		// destination to the origin over one
		if (origin > destination) {
			destination = this.insertBefore ? destination : destination + 1;
			for (let i = origin; i > destination; i--) {
				list[i] = list[i - 1];
			}
		} else {
			destination = this.insertBefore ? destination - 1 : destination;
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

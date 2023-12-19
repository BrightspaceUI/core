import './list-item-drag-image.js';
import { css, html, nothing } from 'lit';
import { findComposedAncestor, isComposedAncestor } from '../../helpers/dom.js';
import { announce } from '../../helpers/announce.js';
import { classMap } from 'lit/directives/class-map.js';
import { dragActions } from './list-item-drag-handle.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { SelectionInfo } from '../selection/selection-mixin.js';

export const moveLocations = Object.freeze({
	above: 1,
	below: 2,
	first: 3,
	last: 4,
	shiftDown: 5,
	shiftUp: 6,
	nest: 7,
	void: 0
});

export const dropLocation = moveLocations; // backwards compatibility

const dropTargetLeaveDelay = 1000; // ms
const touchHoldDuration = 400; // length of time user needs to hold down touch before dragging occurs
const scrollSensitivity = 150; // pixels between top/bottom of viewport to scroll for mobile

const createDragEvent = (name) => {
	const event = new Event(name, { bubbles: true });
	event.dataTransfer = {
		setData: () => {}
	};
	return event;
};

// used for disabling certain things on mobile
const isDragSupported = () => {
	const el = document.createElement('div');

	el.setAttribute('ondragenter', 'return;');
	return typeof el.ondragenter === 'function';
};

class DragState {
	constructor(dragTargets) {
		this._dragTargets = dragTargets;
		this._activeDropTarget = null;
		this._dropTargets = new Map();
		this._dropLocation = dropLocation.void;
		this._time = 0;
	}

	get dragTargets() {
		return this._dragTargets;
	}

	get dropLocation() {
		return this._dropLocation;
	}

	get dropTarget() {
		return this._activeDropTarget;
	}

	get dropTargetKey() {
		return this._activeDropTarget && this._activeDropTarget.key;
	}

	addDropTarget(dropTarget) {
		if (dropTarget && !this._dropTargets.has(dropTarget)) {
			this._dropTargets.set(dropTarget, null);
		}
	}

	clear() {
		this._cleanUpOnLeave();
		this._dropTargets.forEach((_, dropTarget) => dropTarget._draggingOver = false);
		this._dropTargets.clear();
	}

	setActiveDropTarget(dropTarget, dropLocation) {
		this._dropLocation = dropLocation;
		if (this._activeDropTarget === dropTarget) {
			this._setPlacementMarkers();
			return;
		}
		this._cleanUpOnLeave();
		this._activeDropTarget = dropTarget;
		this._setPlacementMarkers();
		this.addDropTarget(dropTarget);
	}

	shouldDrop(time) {
		return time - this._time < dropTargetLeaveDelay;
	}

	updateTime(time) {
		this._time = time;
		if (this._timeoutId) clearTimeout(this._timeoutId);
		this._timeoutId = setTimeout(() => {
			this._cleanUpOnLeave();
			this._activeDropTarget = null;
		}, dropTargetLeaveDelay);
	}

	_cleanUpOnLeave() {
		if (!this._activeDropTarget) return;
		this._activeDropTarget._draggingOver = false;
		this._activeDropTarget._dropLocation = dropLocation.void;
		this._activeDropTarget._inTopArea = false;
		this._activeDropTarget._inBottomArea = false;
	}

	_setPlacementMarkers() {
		this._activeDropTarget._dropLocation = this.dropLocation;
	}
}

let dragState = null;

function createDragState(targets) {
	clearDragState();
	dragState = new DragState(targets ? targets : []);
	return dragState;
}

function getDragState() {
	if (!dragState) createDragState();
	return dragState;
}

function clearDragState() {
	if (dragState) {
		dragState.clear();
	}
	dragState = null;
}

export class NewPositionEventDetails {
	/**
	 * @param { Object } object An simple object with the position event properties
	 * @param { String } object.dragTargetKey The item key of the list-item that is moving
	 * @param { String } object.dropTargetKey The item key of the list-item in the position we are moving to
	 * @param { Boolean } object.dropLocation Whether the target is moved before the destination
	 */
	constructor({ dragTargetKey, dropTargetKey, dropLocation }) {
		if (!dragTargetKey) {
			throw new Error(`NewPositionEventDetails must have a targetKey and destinationKey\nGiven: ${dragTargetKey}`);
		}
		this.dragTargetKey = dragTargetKey;
		this.dropTargetKey = dropTargetKey;
		this.dropLocation = dropLocation;
	}

	/**
	 * Announces a move to screen readers on an array
	 * @param { Array<Node> } list The array to announce the move on.
	 * @param { Object } obj Object containing callback functions
	 * @param { function(any, Number): String } obj.announceFn Callback function that returns the announcement text
	 *        Takes the item in the array and the index as arguments. Should return the text to announce.
	 * @param { function(Node): String } obj.keyFn Callback function that returns a key given a listitem
	 */
	announceMove(list, { announceFn, keyFn }) {
		const origin = this.fetchPosition(list, this.dragTargetKey, keyFn);
		if (origin === null) throw new Error(`Target "${this.dragTargetKey}" not found in array`);
		const destination = this._fetchDropTargetPosition(list, origin, keyFn);
		if (destination === null) throw new Error(`Destination "${this.dropTargetKey}" not found in array`);

		const message = announceFn(list[origin], destination);
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
	 * The item will be moved to the position of the dropTargetKey. Array elements shift
	 * forward one to make room.
	 * @param { Array<Node> } list The array to reorder
	 * @param { Object } obj An object containing callback functions
	 * @param { function(any, Number): String } obj.announceFn (Optional) Callback function that returns the announcement text
	 *        Takes the item in the array and the index as arguments. Should return the text to announce.
	 *        This optional callback will be passed to announceMove if given.
	 * @param { function(Node): String } obj.keyFn Callback function that returns the key for the item.
	 */
	reorder(list, { announceFn, keyFn }) {
		if (this.dropTargetKey === undefined || this.dropTargetKey === this.dragTargetKey) return;

		if (announceFn) {
			this.announceMove(list, { announceFn, keyFn });
		}

		const origin = this.fetchPosition(list, this.dragTargetKey, keyFn);

		if (origin === null) {
			throw new Error(`Position not found in list:\n\torigin: ${this.dragTargetKey} at ${origin}`);
		}

		let destination = this._fetchDropTargetPosition(list, origin, keyFn);

		if (destination === null) {
			throw new Error(`Position not found in list:\n\tdestination: ${this.dropTargetKey} at ${destination}`);
		}

		const item = list[origin];
		if (origin > destination) {
			destination = this.dropLocation === dropLocation.below ? Math.min(destination + 1, list.length - 1) : destination;
			for (let i = origin; i > destination; i--) {
				list[i] = list[i - 1];
			}
		} else {
			destination = this.dropLocation === dropLocation.above ? Math.max(destination - 1, 0) : destination;
			for (let i = origin; i < destination; i++) {
				list[i] = list[i + 1];
			}
		}
		list[destination] = item;
	}

	_fetchDropTargetPosition(list, originPosition, keyFn) {
		if (this.dropTargetKey) {
			return this.fetchPosition(list, this.dropTargetKey, keyFn);
		}

		switch (this.dropLocation) {
			case dropLocation.shiftUp:
				return Math.max(0, originPosition - 1);
			case dropLocation.shiftDown:
				return Math.min(list.length - 1, originPosition + 1);
			case dropLocation.first:
				return 0;
			case dropLocation.last:
				return list.length - 1;
		}

		return null;
	}
}

export const ListItemDragDropMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * **Drag & drop:** Whether the item is draggable
			 * @type {boolean}
			 */
			// eslint-disable-next-line lit/no-native-attributes
			draggable: { type: Boolean, reflect: true },
			/**
			 * @ignore
			 */
			dragging: { type: Boolean, reflect: true },
			/**
			 * **Drag & drop:** The drag-handle label for assistive technology. If implementing drag & drop, you should change this to dynamically announce what the drag-handle is moving for assistive technology in keyboard mode.
			 * @type {string}
			 */
			dragHandleText: { type: String, attribute: 'drag-handle-text' },
			/**
			 * **Drag & drop:** Whether nested items can be dropped on this item
			 * @type {boolean}
			 */
			dropNested: { type: Boolean, attribute: 'drop-nested' },
			/**
			 * **Drag & drop:** Text to drag and drop
			 * @type {string}
			 */
			dropText: { type: String, attribute: 'drop-text' },
			/**
			 * Value to identify item if selectable
			 * @type {string}
			 */
			key: { type: String, reflect: true },
			_draggingOver: { type: Boolean },
			_dropLocation: { type: Number, reflect: true, attribute: '_drop-location' },
			_focusingDragHandle: { type: Boolean },
			_hovering: { type: Boolean },
			_keyboardActive: { type: Boolean },
			_keyboardTextInfo: { type: Object }
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
				pointer-events: none;
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
				cursor: move;
				height: 100%;
			}
			.d2l-list-item-drag-drop-grid {
				display: grid;
				grid-template-columns: 100%;
				grid-template-rows: 1rem 1fr 1fr 1rem;
			}
			:host([_drop-location="7"]) {
				z-index: 1; /* drop target border must render on top of next adjacent border */
			}
			:host([_drop-location="7"]) [slot="outside-control-container"] {
				border: 2px solid var(--d2l-color-celestine);
				border-radius: 6px;
			}
			:host([_drop-location="7"]) [slot="control-container"]::after {
				border-color: transparent;
			}

			@media only screen and (hover: hover), only screen and (pointer: fine) {
				d2l-list-item-drag-handle {
					opacity: 0;
				}
				:host([selected]) d2l-list-item-drag-handle,
				d2l-list-item-drag-handle:hover,
				d2l-list-item-drag-handle.d2l-hovering,
				d2l-list-item-drag-handle.d2l-focusing {
					opacity: 1;
				}
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this._itemDragId = getUniqueId();
		this.draggable = false;
		/** @ignore */
		this.dragging = false;
		this.dropNested = false;
	}

	connectedCallback() {
		super.connectedCallback();
		if (!this.key) {
			this.draggable = false;
		}
	}

	firstUpdated(changedProperties) {
		this.addEventListener('dragenter', this._onHostDragEnter.bind(this));
		super.firstUpdated(changedProperties);
	}

	activateDragHandle() {
		if (this.shadowRoot) this.shadowRoot.querySelector(`#${this._itemDragId}`).activateKeyboardMode();
	}

	_annoucePositionChange(dragTargetKey, dropTargetKey, dropLocation) {
		/** Dispatched when a draggable list item's position changes in the list. See [Event Details: d2l-list-item-position-change](#event-details%3A-d2l-list-item-position-change). */
		this.dispatchEvent(new CustomEvent('d2l-list-item-position-change', {
			detail: new NewPositionEventDetails({ dragTargetKey, dropTargetKey, dropLocation }),
			bubbles: true
		}));
	}

	_dispatchListItemsMove(sourceItems, targetItem, moveLocation, keyboardActive) {
		if (!keyboardActive) keyboardActive = false;
		const rootList = this.getRootList();
		/** @ignore */
		rootList.dispatchEvent(new CustomEvent('d2l-list-items-move', {
			detail: {
				keyboardActive: keyboardActive,
				sourceItems: sourceItems,
				target: {
					item: targetItem,
					location: moveLocation
				}
			},
			bubbles: true
		}));
	}

	_dispatchMoveAroundCollapsedItem(listItem, moveAbove) {
		const parentListItem = this._getParentList();
		if (parentListItem) {
			const parentItems = parentListItem.getItems();
			const nextItemIdex = parentItems.indexOf(listItem);
			this._dispatchListItemsMove([this], parentItems[nextItemIdex], moveAbove ? moveLocations.above : moveLocations.below, true);
		} else {
			this._dispatchMoveRootItem(moveAbove);
		}
	}

	_dispatchMoveListItemFirst(moveToRoot) {
		const list = (moveToRoot ? this.getRootList() : findComposedAncestor(this, node => node.tagName === 'D2L-LIST'));
		const items = list.getItems();
		this._dispatchListItemsMove([this], items[0], moveLocations.above, true);
	}

	_dispatchMoveListItemLast(moveToRoot) {
		const list = (moveToRoot ? this.getRootList() : findComposedAncestor(this, node => node.tagName === 'D2L-LIST'));
		const items = list.getItems();
		this._dispatchListItemsMove([this], items[items.length - 1], moveLocations.below, true);
	}

	_dispatchMoveListItemNest() {
		const listItem = this._getPreviousListItemSibling();
		if (listItem) {
			this._expandListItemOnKeyboardMove(listItem);
			this._dispatchListItemsMove([this], listItem, moveLocations.nest, true);
		}
	}

	_dispatchMoveListItemNext() {
		const nextListItemSibling = this._getNextListItemSibling();
		// if next sibling is collapsed - move item below it
		if (nextListItemSibling && nextListItemSibling.expandable && !nextListItemSibling.expanded) {
			this._dispatchMoveAroundCollapsedItem(nextListItemSibling, false);
		} else if (nextListItemSibling) {
			this._expandListItemOnKeyboardMove(nextListItemSibling);
			const nestedList = nextListItemSibling._getNestedList();
			const items = (nestedList ? nestedList.getItems() : []);
			if (items.length > 0) {
				this._dispatchListItemsMove([this], items[0], moveLocations.above, true);
			} else {
				this._dispatchListItemsMove([this], nextListItemSibling, moveLocations.below, true);
			}
		} else {
			const parentListItem = this._getParentListItem();
			if (parentListItem) {
				this._dispatchListItemsMove([this], parentListItem, moveLocations.below, true);
			} else {
				this._dispatchMoveRootItem(false);
			}
		}
	}

	_dispatchMoveListItemPrevious() {
		const previousListItemSibling = this._getPreviousListItemSibling();
		// if previous sibling is collapsed - move item above it
		if (previousListItemSibling && previousListItemSibling.expandable && !previousListItemSibling.expanded) {
			this._dispatchMoveAroundCollapsedItem(previousListItemSibling, true);
		} else if (previousListItemSibling) {
			const nestedList = previousListItemSibling._getNestedList();
			const items = (nestedList ? nestedList.getItems() : []);
			if (items.length > 0) {
				this._dispatchListItemsMove([this], items[items.length - 1], moveLocations.below, true);
			} else {
				this._dispatchListItemsMove([this], previousListItemSibling, moveLocations.above, true);
			}
		} else {
			const parentListItem = this._getParentListItem();
			if (parentListItem) {
				this._dispatchListItemsMove([this], parentListItem, moveLocations.above, true);
			} else {
				this._dispatchMoveRootItem(true);
			}
		}
	}

	_dispatchMoveListItemUnnest() {
		const listItem = this._getParentListItem();
		if (listItem) {
			this._expandListItemOnKeyboardMove(listItem);
			this._dispatchListItemsMove([this], listItem, moveLocations.below, true);
		}
	}

	_dispatchMoveRootItem(moveAbove) {
		const rootList = this.getRootList();
		const items = rootList.getItems();
		const currentIndex = items.indexOf(this);
		if (moveAbove && currentIndex !== 0) {
			this._dispatchListItemsMove([this], items[currentIndex - 1], moveLocations.above, true);
		} else if (!moveAbove && currentIndex !== items.length - 1) {
			this._dispatchListItemsMove([this], items[currentIndex + 1], moveLocations.below, true);
		}
	}

	_expandListItemOnKeyboardMove(listItem) {
		if (this._keyboardActive && listItem.expandable && !listItem.expanded) {
			listItem._toggleExpandCollapse();
		}
	}

	_findListItemFromCoordinates(x, y) {
		const listNode = findComposedAncestor(this.parentNode, (node) => node && node.tagName === 'D2L-LIST');
		return listNode.shadowRoot.elementFromPoint(x, y);
	}

	_getKeyboardText() {
		const parent = this.parentNode;

		this._keyboardTextInfo = JSON.stringify({
			currentPosition: parent.getListItemIndex(this) + 1,
			count: parent.getListItemCount()
		});
	}

	_onContextMenu(e) {
		if (isDragSupported()) return;
		e.preventDefault();
		e.stopPropagation();
	}

	_onDragEnd(e) {

		const dragState = getDragState();
		this.dragging = false;

		// check the dropEffect in case the user cancelled by Escape while dragging ('none' set by browser)
		if (e.dataTransfer.dropEffect !== 'none' && dragState.shouldDrop(e.timeStamp)) {

			const dropTargetList = findComposedAncestor(dragState.dropTarget, node => node.tagName === 'D2L-LIST');
			const shouldDispatchPositionChange = !dragState.dragTargets.find(dragTarget => {
				const dragTargetList = findComposedAncestor(dragTarget, node => node.tagName === 'D2L-LIST');
				return dragTargetList !== dropTargetList;
			});

			if (shouldDispatchPositionChange && dragState.dragTargets.length === 1) {
				this._annoucePositionChange(dragState.dragTargets[0].key, dragState.dropTargetKey, dragState.dropLocation);
			}

			this._dispatchListItemsMove(dragState.dragTargets, dragState.dropTarget, dragState.dropLocation, false);

		}

		clearDragState();
	}

	_onDragHandleActions(e) {
		switch (e.detail.action) {
			case dragActions.active:
				this._keyboardActive = true;
				break;
			case dragActions.cancel:
			case dragActions.save:
				this._keyboardActive = false;
				break;
			case dragActions.up:
				this._annoucePositionChange(this.key, null, dropLocation.shiftUp);
				this._dispatchMoveListItemPrevious();
				break;
			case dragActions.down:
				this._annoucePositionChange(this.key, null, dropLocation.shiftDown);
				this._dispatchMoveListItemNext();
				break;
			case dragActions.nest:
				this._dispatchMoveListItemNest();
				break;
			case dragActions.unnest:
				this._dispatchMoveListItemUnnest();
				break;
			case dragActions.first:
				this._annoucePositionChange(this.key, null, dropLocation.first);
				this._dispatchMoveListItemFirst();
				break;
			case dragActions.rootFirst:
				this._dispatchMoveListItemFirst(true);
				break;
			case dragActions.last:
				this._annoucePositionChange(this.key, null, dropLocation.last);
				this._dispatchMoveListItemLast();
				break;
			case dragActions.rootLast:
				this._dispatchMoveListItemLast(true);
				break;
			default:
				break;
		}
	}

	_onDragOver(e) {
		if (!this.key) return;
		const dragState = getDragState();
		dragState.updateTime(e.timeStamp);
		e.preventDefault();
	}

	_onDragStart(e) {
		e.dataTransfer.effectAllowed = 'move';
		if (e.dataTransfer.setData && this.dropText) {
			e.dataTransfer.setData('text/plain', `${this.dropText}`);
		}

		const getDragImage = (count, includePlusSign) => {
			let dragImage = this.shadowRoot.querySelector('d2l-list-item-drag-image');
			if (!dragImage) {
				dragImage = document.createElement('d2l-list-item-drag-image');
				this.shadowRoot.appendChild(dragImage);
			}
			dragImage.count = count;
			dragImage.includePlusSign = includePlusSign;
			return dragImage;
		};

		const rootList = this.getRootList(this);
		const selectionInfo = rootList.getSelectionInfo(rootList.dragMultiple);
		if (rootList.dragMultiple && selectionInfo.keys.length > 1) {
			const lazyLoadListItems = this._getFlattenedListItems().lazyLoadListItems;
			let includePlus = false;
			if (lazyLoadListItems.size > 0) {
				for (const selectedItemKey of selectionInfo.keys) {
					if (lazyLoadListItems.has(selectedItemKey)) {
						includePlus = true;
						break;
					}
				}
			}
			e.dataTransfer.setDragImage(getDragImage(selectionInfo.keys.length, includePlus), 24, 26);
		} else if (rootList.dragMultiple && this.expandable) {
			const flattenedListItems = this._getFlattenedListItems(this);
			e.dataTransfer.setDragImage(getDragImage(flattenedListItems.listItems.size, flattenedListItems.lazyLoadListItems.size > 0), 24, 26);
		} else {
			if (this.shadowRoot) {
				const nodeImage = this.shadowRoot.querySelector('.d2l-list-item-drag-image') || this;
				e.dataTransfer.setDragImage(nodeImage, 50, 50);
			}
		}

		// getSelectionInfo(false) is fast so we can quickly check the state
		if (!rootList.dragMultiple || selectionInfo.state === SelectionInfo.states.none) {
			createDragState([this]);
		} else {

			// get the seelcted items, but do not include selected items of selected items
			const getDragTargets = list => {
				let dragTargets = [];
				list.getItems().forEach(item => {
					if (item.selected || item === this) {
						dragTargets.push(item);
					} else if (item._selectionProvider) {
						dragTargets = [...dragTargets, ...getDragTargets(item._selectionProvider)];
					}
				});
				return dragTargets;
			};
			const dragTargets = getDragTargets(rootList);

			createDragState(dragTargets);
		}

		setTimeout(() => {
			this.dragging = true;
		});
	}

	_onDragTargetClick(e) {
		if (!this.shadowRoot) return;
		if (this._keyboardActiveOnNextClick) {
			this.shadowRoot.querySelector(`#${this._itemDragId}`).activateKeyboardMode();
		} else {
			this.shadowRoot.querySelector(`#${this._itemDragId}`).focus();
		}

		this._keyboardActiveOnNextClick = false;
		e.preventDefault();
		e.stopPropagation();
	}

	_onDragTargetMouseDown() {
		this._keyboardActiveOnNextClick = this._focusingDragHandle;
	}

	_onDrop() {
		const dragState = getDragState();
		dragState.setActiveDropTarget(this, dragState.dropLocation);
	}

	_onDropTargetBottomDragEnter(e) {
		e.dataTransfer.dropEffect = 'move';
		const dragState = getDragState();
		dragState.setActiveDropTarget(this, dropLocation.below);
		this._inBottomArea = true;
	}

	_onDropTargetLowerDragEnter(e) {
		e.dataTransfer.dropEffect = 'move';
		if (this.dropNested) {
			this._inBottomArea = false;
			const dragState = getDragState();
			dragState.setActiveDropTarget(this, moveLocations.nest);
		} else {
			if (this._inBottomArea) {
				const dragState = getDragState();
				dragState.setActiveDropTarget(this, dropLocation.above);
				this._inBottomArea = false;
			}
		}
	}

	_onDropTargetTopDragEnter(e) {
		e.dataTransfer.dropEffect = 'move';
		const dragState = getDragState();
		dragState.setActiveDropTarget(this, dropLocation.above);
		this._inTopArea = true;
	}

	_onDropTargetUpperDragEnter(e) {
		e.dataTransfer.dropEffect = 'move';
		if (this.dropNested) {
			this._inTopArea = false;
			const dragState = getDragState();
			dragState.setActiveDropTarget(this, moveLocations.nest);
		} else {
			if (this._inTopArea) {
				const dragState = getDragState();
				dragState.setActiveDropTarget(this, dropLocation.below);
				this._inTopArea = false;
			}
		}
	}

	_onFocusinDragHandle() {
		this._focusingDragHandle = true;
		this._getKeyboardText();
	}

	_onFocusoutDragHandle() {
		this._focusingDragHandle = false;
	}

	_onHostDragEnter(e) {
		const dragState = getDragState();

		// check if any of the drag targets are ancestors of the drop target
		const invalidDropTarget = dragState.dragTargets.find(dragTarget => {
			return isComposedAncestor(dragTarget, this);
		});

		if (invalidDropTarget) {
			dragState.clear();
			return;
		}

		// assert that both the source and target are from the same list - may allow this in the future
		const targetRoot = dragState.dragTargets[0] && dragState.dragTargets[0].getRootList();
		if (this.getRootList() !== targetRoot) return;

		dragState.addDropTarget(this);
		this._draggingOver = true;
		e.dataTransfer.dropEffect = 'move';
	}

	_onTouchCancel() {
		if (this._touchTimeoutId) clearTimeout(this._touchTimeoutId);
		this._touchStarted = false;
	}

	/**
	 * Simulate dragend and drop events from touchend
	 */
	_onTouchEnd(e) {
		if (this._touchTimeoutId) clearTimeout(this._touchTimeoutId);
		if (!this._touchStarted) return;
		e.preventDefault();
		this._touchStarted = false;
		this._currentTouchListItem = undefined;
		// simulate drop if over a drop area
		const touch = e.changedTouches[0];
		const listItem = this._findListItemFromCoordinates(touch.clientX, touch.clientY);
		const dropGrid = listItem.shadowRoot.querySelector('.d2l-list-item-drag-drop-grid');
		if (dropGrid) dropGrid.dispatchEvent(createDragEvent('drop'));
		// simulate dragend
		if (this.shadowRoot)
			this.shadowRoot.querySelector('.d2l-list-item-drag-area').dispatchEvent(createDragEvent('dragend'));
	}

	/**
	 * Mobile phone browsers typically don't support drag events, so we simulate them with touch
	 * events instead. Touchmove takes care of most of these.
	 */
	_onTouchMove(e) {
		if (!this._touchStarted) return;
		if (e.cancelable) { // event must be cancelable
			e.preventDefault();
		}
		const touch = e.changedTouches[0];
		const listItem = this._findListItemFromCoordinates(touch.clientX, touch.clientY);
		if (!listItem) return;
		// simulate host dragenter
		if (listItem !== this && this._currentTouchListItem !== listItem) {
			listItem.dispatchEvent(createDragEvent('dragenter'));
			this._currentTouchListItem = listItem;
		}
		// get the drop area
		const dropGrid = listItem.shadowRoot.querySelector('.d2l-list-item-drag-drop-grid');
		if (!dropGrid) return;

		const movingOverElem = listItem.shadowRoot.elementFromPoint(touch.clientX, touch.clientY);
		if (movingOverElem && movingOverElem.parentNode === dropGrid) {
			// simulate dragover
			dropGrid.dispatchEvent(createDragEvent('dragover'));

			// simulate dragenter on drop areas
			if (this._currentTouchDropArea !== movingOverElem) {
				movingOverElem.dispatchEvent(createDragEvent('dragenter'));
				this._currentTouchDropArea = movingOverElem;
			}
		}
		// scroll the viewport if we've reached the end
		if (touch.clientY > window.innerHeight / 2 && window.innerHeight - touch.clientY < scrollSensitivity) {
			// scroll down
			window.scrollBy(0, 10);
		} else if (touch.clientY < window.innerHeight / 2 && touch.clientY < scrollSensitivity) {
			// scroll up
			window.scrollBy(0, -10);
		}
	}

	_onTouchStart() {
		if (this._touchTimeoutId) {
			clearTimeout(this._touchTimeoutId);
		}
		// simulate dragstart for touch and hold
		this._touchTimeoutId = setTimeout(() => {
			this._touchStarted = true;
			if (this.shadowRoot)
				this.shadowRoot.querySelector('.d2l-list-item-drag-area').dispatchEvent(createDragEvent('dragstart'));
		}, touchHoldDuration);
	}

	_renderBottomPlacementMarker(renderTemplate) {
		return this._dropLocation === dropLocation.below ? html`<div class="d2l-list-item-drag-bottom-marker">${renderTemplate}</div>` : null;
	}

	_renderDragHandle(templateMethod) {
		templateMethod = templateMethod || (dragHandle => dragHandle);
		const classes = {
			'd2l-focusing': this._focusingDragHandle,
			'd2l-hovering': this._hovering
		};

		return this.draggable ? templateMethod(html`
			<d2l-list-item-drag-handle
				id="${this._itemDragId}"
				class="${classMap(classes)}"
				text="${ifDefined(this.dragHandleText)}"
				keyboard-text-info="${ifDefined(this._keyboardTextInfo)}"
				@focusin="${this._onFocusinDragHandle}"
				@focusout="${this._onFocusoutDragHandle}"
				@d2l-list-item-drag-handle-action="${this._onDragHandleActions}">
			</d2l-list-item-drag-handle>
		`) : nothing;
	}

	_renderDragTarget(templateMethod) {
		templateMethod = templateMethod || (dragTarget => dragTarget);
		return this.draggable && !this._keyboardActive ? templateMethod.call(this, html`
			<div
				class="d2l-list-item-drag-area"
				draggable="true"
				@click="${this._onDragTargetClick}"
				@contextmenu="${this._onContextMenu}"
				@dragstart="${this._onDragStart}"
				@dragend="${this._onDragEnd}"
				@touchstart="${this._onTouchStart}"
				@touchmove="${this._onTouchMove}"
				@touchend="${this._onTouchEnd}"
				@touchcancel="${this._onTouchCancel}"
				@mousedown="${this._onDragTargetMouseDown}"
				>
			</div>
		`) : nothing;
	}

	_renderDropTarget(templateMethod) {
		templateMethod = templateMethod || (DropTarget => DropTarget);
		return this.draggable && this._draggingOver ? templateMethod(html`
			<div class="d2l-list-item-drag-drop-grid" slot="drop-target" @drop="${this._onDrop}" @dragover="${this._onDragOver}">
				<div @dragenter="${this._onDropTargetTopDragEnter}"></div>
				<div @dragenter="${this._onDropTargetUpperDragEnter}"></div>
				<div @dragenter="${this._onDropTargetLowerDragEnter}"></div>
				<div @dragenter="${this._onDropTargetBottomDragEnter}"></div>
			</div>
		`) : nothing;
	}

	_renderTopPlacementMarker(renderTemplate) {
		return this._dropLocation === dropLocation.above ? html`<div class="d2l-list-item-drag-top-marker">${renderTemplate}</div>` : null;
	}
};

import { css, html, LitElement } from 'lit';
import { getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { SelectionInfo, SelectionMixin } from '../selection/selection-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PageableMixin } from '../paging/pageable-mixin.js';
import ResizeObserver from 'resize-observer-polyfill';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

const keyCodes = {
	TAB: 9
};

export const listSelectionStates = SelectionInfo.states;
const DEFAULT_BREAKPOINTS = [842, 636, 580, 0];
const SLIM_COLOR_BREAKPOINT = 400;

const ro = new ResizeObserver(entries => {
	entries.forEach(entry => {
		if (!entry?.target?.resizedCallback) return;
		entry.target.resizedCallback(entry.contentRect?.width);
	});
});

/**
 * A container for a styled list of items ("d2l-list-item"). It provides the appropriate "list" semantics as well as options for displaying separators, etc.
 * @slot - Slot for list items (ex. `d2l-list-item`, `d2l-list-item-button`, or custom items)
 * @slot controls - Slot for `d2l-list-controls` to be rendered above the list
 * @slot pager - Slot for `d2l-pager-load-more` to be rendered below the list
 * @fires d2l-list-items-move - Dispatched when one or more items are moved. See [Event Details: d2l-list-items-move](#event-details%3A-%40d2l-list-items-move).
 */
class List extends PageableMixin(SelectionMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * When true, show the inline add button after each list item.
			 * @type {boolean}
			 */
			addButton: { type: Boolean, reflect: true, attribute: 'add-button' },
			/**
			 * Text to show in label tooltip on inline add button. Defaults to "Add Item".
			 * @type {string}
			 */
			addButtonText: { type: String, reflect: true, attribute: 'add-button-text' },
			/**
			 * Breakpoints for responsiveness in pixels. There are four different breakpoints and only the four largest breakpoints will be used.
			 * @type {array}
			 */
			breakpoints: { type: Array },
			/**
			 * Whether the user can drag multiple items
			 * @type {boolean}
 			 */
			dragMultiple: { type: Boolean, reflect: true, attribute: 'drag-multiple' },
			/**
			 * Whether to extend the separators beyond the content's edge
			 * @type {boolean}
			 */
			extendSeparators: { type: Boolean, reflect: true, attribute: 'extend-separators' },
			/**
			 * Use grid to manage focus with arrow keys. See [Accessibility](#accessibility).
			 * @type {boolean}
			 */
			grid: { type: Boolean },
			/**
			 * Sets an accessible label. For use when the list context is unclear. This property is only valid on top-level lists and will have no effect on nested lists.
			 * @type {string}
 			 */
			label: { type: String },
			/**
			 * The type of layout for the list items. Valid values are "list" (default) and "tiles". The tile layout is only valid for single level (non-nested) lists.
			 * @type {string}
 			 */
			layout: { type: String, reflect: true, attribute: 'layout' },
			/**
			 * Display separators. Valid values are "all" (default), "between", "none"
			 * @type {'all'|'between'|'none'}
			 * @default "all"
			 */
			separators: { type: String, reflect: true },
			_breakpoint: { type: Number, reflect: true },
			_slimColor: { type: Boolean, reflect: true, attribute: '_slim-color' }
		};
	}

	/*
	Other layout name ideas
	Tiles (as you already have)
	Grid
	Cards
	Mosaic
	Blocks
	Board
	Matrix
	Brick
	*/

	static get styles() {
		return css`
			:host {
				--d2l-list-item-color-border-radius: 6px;
				--d2l-list-item-color-width: 6px;
				--d2l-list-item-illustration-margin-inline-end: 0.9rem;
				--d2l-list-item-illustration-max-height: 2.6rem;
				--d2l-list-item-illustration-max-width: 4.5rem;
				display: block;
			}

			:host([layout="tiles"]) .d2l-list-content {
				/*align-items: start;*/
				display: flex;
				flex-wrap: wrap;
				justify-content: normal;
				gap: 2rem;
			}

			:host(:not([slot="nested"])) > .d2l-list-content {
				padding-bottom: 1px;
			}
			:host([hidden]) {
				display: none;
			}
			slot[name="pager"]::slotted(*) {
				margin-top: 10px;
			}
			:host([extend-separators]) slot[name="pager"]::slotted(*) {
				margin-left: 0.9rem;
				margin-right: 0.9rem;
			}
			:host([_breakpoint="1"]) {
				--d2l-list-item-illustration-margin-inline-end: 1rem;
				--d2l-list-item-illustration-max-height: 3.55rem;
				--d2l-list-item-illustration-max-width: 6rem;
			}
			:host([_breakpoint="2"]) {
				--d2l-list-item-illustration-margin-inline-end: 1rem;
				--d2l-list-item-illustration-max-height: 5.1rem;
				--d2l-list-item-illustration-max-width: 9rem;
			}
			:host([_breakpoint="3"]) {
				--d2l-list-item-illustration-margin-inline-end: 1rem;
				--d2l-list-item-illustration-max-height: 6rem;
				--d2l-list-item-illustration-max-width: 10.8rem;
			}
			:host([_slim-color]) {
				--d2l-list-item-color-border-radius: 3px;
				--d2l-list-item-color-width: 3px;
			}
			:host([add-button]) ::slotted([slot="controls"]) {
				margin-bottom: calc(6px + 0.4rem); /* controls section margin-bottom + spacing for add-button */
			}
		`;
	}

	constructor() {
		super();
		this.addButton = false;
		this.breakpoints = DEFAULT_BREAKPOINTS;
		this.dragMultiple = false;
		this.extendSeparators = false;
		this.grid = false;
		this.layout = 'list';
		this._listItemChanges = [];
		this._childHasColor = false;
		this._childHasExpandCollapseToggle = false;

		this._breakpoint = 0;
		this._slimColor = false;
		this._width = 0;

		this._listChildrenUpdatedSubscribers = new SubscriberRegistryController(this, 'list-child-status', {
			onSubscribe: this._updateActiveSubscriber.bind(this),
			updateSubscribers: this._updateActiveSubscribers.bind(this)
		});
	}

	get breakpoints() {
		return this._breakpoints;
	}

	set breakpoints(value) {
		const oldValue = this._breakpoints;
		if (value !== DEFAULT_BREAKPOINTS) this._breakpoints = value.sort((a, b) => b - a).slice(0, 4);
		else this._breakpoints = DEFAULT_BREAKPOINTS;
		this.requestUpdate('breakpoints', oldValue);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-list-item-showing-count-change', this._handleListItemShowingCountChange);
		this.addEventListener('d2l-list-item-nested-change', (e) => this._handleListItemNestedChange(e));
		this.addEventListener('d2l-list-item-property-change', (e) => this._handleListItemPropertyChange(e));
		this.addEventListener('d2l-list-item-add-button-click', (e) => this._handleListItemAddButtonClick(e));
		ro.observe(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._intersectionObserver) this._intersectionObserver.disconnect();
		ro.unobserve(this);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		// check if list items are expandable on first render so we adjust sibling spacing appropriately
		this._handleListItemNestedChange();
		this.addEventListener('d2l-list-item-selected', e => {

			// batch the changes from select-all and nested lists
			if (this._listItemChanges.length === 0) {
				setTimeout(() => {
					/** Dispatched once for a set of selection state changes (ex. select-all); event detail includes an array of objects where each object contains the `key` and `selected` state for each changed item */
					this.dispatchEvent(new CustomEvent('d2l-list-selection-changes', {
						detail: this._listItemChanges
					}));
					this._listItemChanges = [];
				}, 60);
			}
			this._listItemChanges.push(e.detail);

			setTimeout(() => {
				/** Dispatched when the selection state changes */
				this.dispatchEvent(new CustomEvent('d2l-list-selection-change', {
					bubbles: true,
					composed: true,
					detail: e.detail
				}));
			}, 0);

		});

	}

	render() {
		const role = !this.grid ? 'list' : 'application'; // not using grid role due to Safari+VO: https://bugs.webkit.org/show_bug.cgi?id=291591
		const ariaLabel = this.slot !== 'nested' ? this.label : undefined;
		return html`
			<slot name="controls"></slot>
			<slot name="header"></slot>
			<div role="${role}" aria-label="${ifDefined(ariaLabel)}" class="d2l-list-content">
				<slot @keydown="${this._handleKeyDown}" @slotchange="${this._handleSlotChange}"></slot>
			</div>
			${this._renderPagerContainer()}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('breakpoints') && changedProperties.get('breakpoints') !== undefined) {
			this.resizedCallback(this.offsetWidth, true);
		}
		if (changedProperties.has('add-button') || changedProperties.has('add-button-text')) {
			this._listChildrenUpdatedSubscribers.updateSubscribers();
		}
		if (changedProperties.has('grid') && this.grid) {
			this.selectionNoInputArrowKeyBehaviour = true;
		}
		if (changedProperties.has('layout') && this.layout) {
			this._updateItemLayouts();
		}
	}

	getItems(slot) {
		if (!this.shadowRoot) return;
		if (!slot) slot = this.shadowRoot.querySelector('slot:not([name])');
		if (!slot) return [];
		return slot.assignedNodes({ flatten: true }).filter((node) => {
			return node.nodeType === Node.ELEMENT_NODE && (node.role === 'row' || node.role === 'listitem');
		});
	}

	getListItemByKey(key) {
		const items = this.getItems();
		for (let i = 0; i < items.length; i++) {
			if (items[i].key === key) return items[i];
			if (items[i]._selectionProvider) {
				const tempItem = items[i]._selectionProvider.getListItemByKey(key);
				if (tempItem) return tempItem;
			}
		}
		return null;
	}

	getListItemCount() {
		return this.getItems().length;
	}

	getListItemIndex(item) {
		return this.getItems().indexOf(item);
	}

	getSelectedListItems(includeNested) {
		let selectedItems = [];
		this.getItems().forEach(item => {
			if (item.selected) selectedItems.push(item);
			if (includeNested && item._selectionProvider) {
				selectedItems = [...selectedItems, ...item._selectionProvider.getSelectedListItems(includeNested)];
			}
		});
		return selectedItems;
	}

	getSelectionInfo(includeNested) {
		const selectionInfo = super.getSelectionInfo();
		if (!includeNested) return selectionInfo;

		let state = selectionInfo.state;
		let keys = selectionInfo.keys;

		this.getItems().forEach(item => {
			if (item._selectionProvider) {
				const itemSelectionInfo = item._selectionProvider.getSelectionInfo(true);
				if (state === SelectionInfo.states.notSet) {
					state = itemSelectionInfo.state;
				} else if (state === SelectionInfo.states.none && itemSelectionInfo.state !== SelectionInfo.states.notSet && itemSelectionInfo.state !== SelectionInfo.states.none) {
					state = SelectionInfo.states.some;
				} else if (state === SelectionInfo.states.all && (itemSelectionInfo.state === SelectionInfo.states.some || itemSelectionInfo.state === SelectionInfo.states.none)) {
					state = SelectionInfo.states.some;
				}
				keys = [...keys, ...item._selectionProvider.getSelectionInfo(true).keys];
			}
		});

		return new SelectionInfo(keys, state);
	}

	resizedCallback(width, breakpointsChanged) {
		if (this._width === width && !breakpointsChanged) return;
		this._width = width;

		this._slimColor = (width < SLIM_COLOR_BREAKPOINT);

		const lastBreakpointIndexToCheck = 3;
		this.breakpoints.some((breakpoint, index) => {
			if (width >= breakpoint || index > lastBreakpointIndexToCheck) {
				this._breakpoint = lastBreakpointIndexToCheck - index - (lastBreakpointIndexToCheck - this.breakpoints.length + 1) * index;
				return true;
			}
		});
	}

	setSelectionForAll(selected, selectAllPages) {
		super.setSelectionForAll(selected, selectAllPages);
		// list-specific logic to push selection state deeper into tree - required to support intermediate nested lists with no direct selectables but with their own nested lists containing selectables
		this.getItems().forEach(item => {
			if (!item.selectable && item._selectionProvider) {
				item._selectionProvider.setSelectionForAll(selected, selectAllPages);
			}
		});
	}

	_getItemByIndex(index) {
		const items = this.getItems() || [];
		return items[index];
	}

	_getItemShowingCount() {
		return this.getItems().length;
	}

	_getLazyLoadItems() {
		const items = this.getItems();
		return items.length > 0 ? items[0]._getFlattenedListItems().lazyLoadListItems : new Map();
	}

	_handleKeyDown(e) {
		if (!this.grid || this.slot === 'nested' || e.keyCode !== keyCodes.TAB) return;
		e.preventDefault();
		if (!this.shadowRoot) return;
		const listSlot = this.shadowRoot.querySelector('slot:not([name])');
		const focusable = (e.shiftKey ? getPreviousFocusable(listSlot) : getNextFocusable(listSlot, false, true, true));
		if (focusable) focusable.focus();
	}

	_handleListItemAddButtonClick(e) {
		e.stopPropagation();
		/**
		 * Dispatched when the add button directly before or after the item is clicked. Event detail includes position ('before' or 'after') and key.
		 * The `key` belongs to the list item adjacent to where the new item should be positioned.
		 * The `position` represents where the new item should be positioned relative to the item with that key.
		 * */
		this.dispatchEvent(new CustomEvent('d2l-list-add-button-click', { detail: { key: e.target.key, position: e.detail.position } }));
	}

	_handleListItemNestedChange(e) {
		if (e) {
			e.stopPropagation();
		}
		const items = this.getItems();
		let aChildHasColor = false;
		let aChildHasToggleEnabled = false;
		for (const item of items) {
			if (item.color) aChildHasColor = true;
			if (item.expandable) aChildHasToggleEnabled = true;
			if (aChildHasToggleEnabled && aChildHasColor) break;
		}
		this._childHasColor = aChildHasColor;
		this._childHasExpandCollapseToggle = aChildHasToggleEnabled;
		this._listChildrenUpdatedSubscribers.updateSubscribers();
	}

	_handleListItemPropertyChange(e) {
		if (e.detail.name === 'color') {
			e.stopPropagation();
			if (e.detail.value) {
				this._childHasColor = true;
				this._listChildrenUpdatedSubscribers.updateSubscribers();
			} else {
				// if color has had its value removed then need to loop through all the items to determine if there are still others with colors
				this._handleListItemNestedChange(e);
			}
		} else if (e.detail.name === 'current') {
			if (this.slot === 'nested') return;
			e.stopPropagation();

			if (!e.detail.value) {
				e.target.dispatchSetChildCurrentEvent(false);
				return;
			}

			/**
			 * When a nav item is set to current, do the following:
			 * - If previous current item:
			 *   - Set its current to FALSE
			 *   	- This triggers the d2l-list-item-nav-set-child-current with value of false, causing
			 * 		  the previous current item to set its aria-current to undefined if it is not the current item
			 * - After the reset event has worked its way up OR if there is no previous current item:
			 *   - Trigger the d2l-list-item-nav-set-child-current event with value of true, which sets all parent item aria-current to "location"
			 */
			const currentItems = this.querySelectorAll('[current]');
			// length of 2 is fine as long as one is e.target and the other is the previous current item
			if (currentItems.length > 2) {
				console.warn('d2l-list: More than one list item has been set to current. This is not allowed and will cause unexpected behavior.');
			}
			const target = e.target;

			let prevCurrent = false;
			currentItems.forEach((item) => {
				if (item === target) return;
				prevCurrent = item;
			});

			if (prevCurrent) {
				this.addEventListener('d2l-list-item-nav-set-child-current', (e) => {
					e.stopPropagation();
					target.dispatchSetChildCurrentEvent(true);
				}, { once: true });
				prevCurrent.current = false;
				const firstChild = this.querySelector('[_has-current-parent]');
				if (firstChild) firstChild._hasCurrentParent = false;

				const prevSiblings = this.querySelectorAll('[_next-sibling-current]');
				if (prevSiblings.length > 0) {
					prevSiblings.forEach(sibling => {
						sibling._nextSiblingCurrent = false;
					});
				}
			} else {
				target.dispatchSetChildCurrentEvent(true);
			}
		}
	}

	_handleListItemShowingCountChange() {
		if (this.slot === 'nested') return;

		// debounce the updates for first render case
		if (this._updateItemShowingCountRequested) return;

		this._updateItemShowingCountRequested = true;
		setTimeout(() => {
			this._updateItemShowingCount();
			this._updateItemShowingCountRequested = false;
		}, 0);
	}

	_handleSlotChange() {
		this._updateItemShowingCount();
		const items = this.getItems();
		items.forEach((item, i) => {
			if (items.length === 1) {
				item.first = true;
				item.last = true;
			} else if (i === 0) {
				item.first = true;
				item.last = false;
			} else if (i === items.length - 1) {
				item.first = false;
				item.last = true;
			} else {
				item.first = false;
				item.last = false;
			}
		});

		this._updateItemLayouts(items);

		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-list-item-showing-count-change', {
			bubbles: true,
			composed: true
		}));
	}

	_updateActiveSubscriber(subscriber) {
		subscriber.updateSiblingHasChildren(this._childHasExpandCollapseToggle);
		subscriber.updateSiblingHasColor(this._childHasColor);
		subscriber.updateParentHasAddButon(this.addButton, this.addButtonText);
	}

	_updateActiveSubscribers(subscribers) {
		subscribers.forEach(subscriber => {
			subscriber.updateSiblingHasChildren(this._childHasExpandCollapseToggle);
			subscriber.updateSiblingHasColor(this._childHasColor);
			subscriber.updateParentHasAddButon(this.addButton, this.addButtonText);
		});
	}

	_updateItemLayouts(items) {
		if (!items) items = this.getItems();
		items.forEach(item => item.layout = (this.layout === 'tiles' ? 'tile' : 'normal'));
	}

}

customElements.define('d2l-list', List);

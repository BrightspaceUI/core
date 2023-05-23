import { css, html, LitElement } from 'lit';
import { getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { SelectionInfo, SelectionMixin } from '../selection/selection-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PageableMixin } from '../paging/pageable-mixin.js';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

const keyCodes = {
	TAB: 9
};

export const listSelectionStates = SelectionInfo.states;

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
			 * Display separators. Valid values are "all" (default), "between", "none"
			 * @type {'all'|'between'|'none'}
			 * @default "all"
			 */
			separators: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			slot[name="pager"]::slotted(*) {
				margin-top: 12px;
			}
		`;
	}

	constructor() {
		super();
		this.dragMultiple = false;
		this.extendSeparators = false;
		this.grid = false;
		this.label = undefined;
		this._listItemChanges = [];
		this._childHasExpandCollapseToggle = false;

		this._listChildrenUpdatedSubscribers = new SubscriberRegistryController(this, 'list-child-status', {
			onSubscribe: this._updateActiveSubscriber.bind(this),
			updateSubscribers: this._updateActiveSubscribers.bind(this)
		});
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-list-item-showing-count-change', this._handleListItemShowingCountChange);
		this.addEventListener('d2l-list-item-nested-change', (e) => this._handleListIemNestedChange(e));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._intersectionObserver) this._intersectionObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		// check if list items are expandable on first render so we adjust sibling spacing appropriately
		this._handleListIemNestedChange();
		this.addEventListener('d2l-list-item-selected', e => {

			// batch the changes from select-all and nested lists
			if (this._listItemChanges.length === 0) {
				setTimeout(() => {
					/** Dispatched once for a set of selection state changes (ex. select-all); event detail includes an array of objects where each object contains the `key` and `selected` state for each changed item */
					this.dispatchEvent(new CustomEvent('d2l-list-selection-changes', {
						detail: this._listItemChanges
					}));
					this._listItemChanges = [];
				}, 30);
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
		const role = !this.grid ? 'list' : 'application';
		const ariaLabel = this.slot !== 'nested' ? this.label : undefined;
		return html`
			<slot name="controls"></slot>
			<slot name="header"></slot>
			<div role="${role}" aria-label="${ifDefined(ariaLabel)}">
				<slot @keydown="${this._handleKeyDown}" @slotchange="${this._handleSlotChange}"></slot>
			</div>
			${this._renderPagerContainer()}
		`;
	}

	getItems(slot) {
		if (!this.shadowRoot) return;
		if (!slot) slot = this.shadowRoot.querySelector('slot:not([name])');
		if (!slot) return [];
		return slot.assignedNodes({ flatten: true }).filter((node) => {
			return node.nodeType === Node.ELEMENT_NODE && (node.role === 'rowgroup' || node.role === 'listitem');
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

		let keys = selectionInfo.keys;

		this.getItems().forEach(item => {
			if (item._selectionProvider) {
				keys = [...keys, ...item._selectionProvider.getSelectionInfo(true).keys];
			}
		});

		return new SelectionInfo(keys, selectionInfo.state);
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
		return items.length > 0 ?  items[0]._getFlattenedListItems().lazyLoadListItems : new Map();
	}

	_handleKeyDown(e) {
		if (!this.grid || this.slot === 'nested' || e.keyCode !== keyCodes.TAB) return;
		e.preventDefault();
		if (!this.shadowRoot) return;
		const listSlot = this.shadowRoot.querySelector('slot:not([name])');
		const focusable = (e.shiftKey ? getPreviousFocusable(listSlot) : getNextFocusable(listSlot, false, true, true));
		if (focusable) focusable.focus();
	}

	_handleListIemNestedChange(e) {
		if (e) {
			e.stopPropagation();
		}
		const items = this.getItems();
		let aChildHasToggleEnabled = false;
		for (const item of items) {
			if (item.expandable) {
				aChildHasToggleEnabled = true;
				break;
			}
		}
		this._childHasExpandCollapseToggle = aChildHasToggleEnabled;
		this._listChildrenUpdatedSubscribers.updateSubscribers();
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

		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-list-item-showing-count-change', {
			bubbles: true,
			composed: true
		}));
	}

	_updateActiveSubscriber(subscriber) {
		subscriber.updateSiblingHasChildren(this._childHasExpandCollapseToggle);
	}

	_updateActiveSubscribers(subscribers) {
		subscribers.forEach(subscriber => subscriber.updateSiblingHasChildren(this._childHasExpandCollapseToggle));
	}

}

customElements.define('d2l-list', List);

import { css, html, LitElement } from 'lit';
import { getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { SelectionInfo, SelectionMixin } from '../selection/selection-mixin.js';
import { PageableMixin } from '../paging/pageable-mixin.js';

const keyCodes = {
	TAB: 9
};

export const listSelectionStates = SelectionInfo.states;

/**
 * A container for a styled list of items ("d2l-list-item"). It provides the appropriate "list" semantics as well as options for displaying separators, etc.
 * @slot - Slot for list items (ex. `d2l-list-item`, `d2l-list-item-button`, or custom items)
 * @slot header - Slot for `d2l-list-header` to be rendered above the list
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
		this._itemsShowingCount = 0;
		this._itemsShowingTotalCount = 0;
		this._listItemChanges = [];
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-list-items-showing-count-change', this._handleListItemsShowingCountChange);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._intersectionObserver) this._intersectionObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

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
		return html`
			<div role="${role}" class="d2l-list-container">
				<slot name="header"></slot>
				<slot @keydown="${this._handleKeyDown}" @slotchange="${this._handleSlotChange}"></slot>
				${this._renderPagerContainer()}
			</div>
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
		const items = this.getItems();
		if (index > items.length - 1) return;
		return items[index];
	}

	async _getItemsShowingCount() {
		if (this.slot === 'nested') return this._itemsShowingCount;
		else return this._getListItemsShowingTotalCount(false);
	}

	_getLastItemIndex() {
		return this._itemsShowingCount - 1;
	}

	async _getListItemsShowingTotalCount(refresh) {
		if (refresh) {
			this._itemsShowingTotalCount = await this.getItems().reduce(async(count, item) => {
				await item.updateComplete;
				if (item._selectionProvider) {
					return (await count + await item._selectionProvider._getListItemsShowingTotalCount(true));
				} else {
					return await count;
				}
			}, this._itemsShowingCount);
		}
		return this._itemsShowingTotalCount;
	}

	_handleKeyDown(e) {
		if (!this.grid || this.slot === 'nested' || e.keyCode !== keyCodes.TAB) return;
		e.preventDefault();
		if (!this.shadowRoot) return;
		const focusable = (e.shiftKey ? getPreviousFocusable(this.shadowRoot.querySelector('slot:not([name])'))
			: getNextFocusable(this, false, true, true));
		if (focusable) focusable.focus();
	}

	_handleListItemsShowingCountChange() {
		if (this.slot === 'nested') return;

		// debounce the updates for first render case
		if (this._updateItemsShowingTotalCountRequested) return;

		this._updateItemsShowingTotalCountRequested = true;
		setTimeout(async() => {
			const oldCount = this._itemsShowingTotalCount;
			const newCount = await this._getListItemsShowingTotalCount(true);
			if (oldCount !== newCount) this._updatePagerCount(newCount);
			this._updateItemsShowingTotalCountRequested = false;
		}, 0);
	}

	async _handleSlotChange(e) {
		const items = this.getItems(e.target);
		if (this._itemsShowingCount === items.length) return;
		this._itemsShowingCount = items.length;

		this._updatePagerCount(await this._getListItemsShowingTotalCount(true));

		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-list-items-showing-count-change', {
			bubbles: true,
			composed: true,
			detail: { count: this._itemsShowingCount }
		}));
	}

}

customElements.define('d2l-list', List);

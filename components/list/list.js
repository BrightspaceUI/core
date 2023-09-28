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
const defaultBreakpoints = [842, 636, 580, 0];
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
		`;
	}

	constructor() {
		super();
		this.breakpoints = defaultBreakpoints;
		this.dragMultiple = false;
		this.extendSeparators = false;
		this.grid = false;
		this._listItemChanges = [];
		this._childHasColor = false;
		this._childHasExpandCollapseToggle = false;

		this._breakpoint = 0;
		this._slimColor = false;

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
		if (value !== defaultBreakpoints) this._breakpoints = value.sort((a, b) => b - a).slice(0, 4);
		else this._breakpoints = defaultBreakpoints;
		this.requestUpdate('breakpoints', oldValue);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-list-item-showing-count-change', this._handleListItemShowingCountChange);
		this.addEventListener('d2l-list-item-nested-change', (e) => this._handleListIemNestedChange(e));
		this.addEventListener('d2l-list-item-property-change', (e) => this._handleListItemPropertyChange(e));
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
			<div role="${role}" aria-label="${ifDefined(ariaLabel)}" class="d2l-list-content">
				<slot @keydown="${this._handleKeyDown}" @slotchange="${this._handleSlotChange}"></slot>
			</div>
			${this._renderPagerContainer()}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('breakpoints')) {
			this.resizedCallback(this.offsetWidth);
		}
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

	resizedCallback(width) {
		const oldBreakpoint = this._breakpoint;
		const oldSlimColor = this._slimColor;

		this._slimColor = (width < SLIM_COLOR_BREAKPOINT);

		const lastBreakpointIndexToCheck = 3;
		this.breakpoints.some((breakpoint, index) => {
			if (width >= breakpoint || index > lastBreakpointIndexToCheck) {
				this._breakpoint = lastBreakpointIndexToCheck - index - (lastBreakpointIndexToCheck - this.breakpoints.length + 1) * index;
				return true;
			}
		});

		if (oldSlimColor !== this._slimColor || oldBreakpoint !== this._breakpoint) {
			const items = this.getItems();
			items.forEach((item) => {
				item.breakpoint = this._breakpoint;
				item.slimColor = this._slimColor;
			});
		}
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
		e.stopPropagation();
		if (e.detail.name === 'color') {
			if (e.detail.value) {
				this._childHasColor = true;
				this._listChildrenUpdatedSubscribers.updateSubscribers();
			} else {
				// if color has had its value removed then need to loop through all the items to determine if there are still others with colors
				this._handleListIemNestedChange(e);
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

		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-list-item-showing-count-change', {
			bubbles: true,
			composed: true
		}));
	}

	_updateActiveSubscriber(subscriber) {
		subscriber.updateSiblingHasChildren(this._childHasExpandCollapseToggle);
		subscriber.updateSiblingHasColor(this._childHasColor);
	}

	_updateActiveSubscribers(subscribers) {
		subscribers.forEach(subscriber => {
			subscriber.updateSiblingHasChildren(this._childHasExpandCollapseToggle);
			subscriber.updateSiblingHasColor(this._childHasColor);
		});
	}

}

customElements.define('d2l-list', List);

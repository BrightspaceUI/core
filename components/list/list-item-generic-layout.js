import { css, html, LitElement } from 'lit';
import { findComposedAncestor, isComposedAncestor } from '../../helpers/dom.js';
import { getComposedActiveElement, getFirstFocusableDescendant, getFocusableDescendants, getLastFocusableDescendant, getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { getFlag } from '../../helpers/flags.js';
import { isInteractiveDescendant } from '../../mixins/interactive/interactive-mixin.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

const keyCodes = {
	DOWN: 40,
	END: 35,
	ENTER: 13,
	HOME: 36,
	LEFT: 37,
	PAGEUP: 33,
	PAGEDOWN: 34,
	RIGHT: 39,
	SPACE: 32,
	UP: 38
};

const listItemUpButtonFixFlag = getFlag('GAUD-8229-list-up-button-fix', true);

/**
 * A component for generating a list item's layout with forced focus ordering and grid support.
 * Focusable items placed in the "content" slot will have their focus removed; use the content-action
 * slot for such items.
 * @slot outside-control - Control associated on the far left, e.g., a drag-n-drop handle
 * @slot outside-control-action - An action area associated with the outside control
 * @slot control - Main control beside the outside control, e.g., a checkbox
 * @slot control-action - Action area associated with the main control
 * @slot content - Content of the list item, such as that in a list-item-content component.
 * @slot content-action - Action associated with the content, such as a navigation link
 * @slot actions - Other actions for the list item on the far right, such as a context menu
 * @slot nested - Optional `d2l-list` for creating nested lists
 */
class ListItemGenericLayout extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * How to align content in the nested slot
			 * @type {'content'|'control'}
			 */
			alignNested: { type: String, reflect: true, attribute: 'align-nested' },
			/**
			 * Whether to constrain actions so they do not fill the item. Required if slotted content is interactive.
			 * @type {boolean}
			 */
			noPrimaryAction: { type: Boolean, attribute: 'no-primary-action', reflect: true },
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			role: { type: String, reflect: true },
			/**
			 * Specifies whether the grid is active or not
			 * @type {boolean}
			 */
			gridActive: { type: Boolean, attribute: 'grid-active' },
			/**
			 * Inline start padding (in px) to apply to list item(s) in the nested slot. When used, nested list items will not use the grid start calcuations and will only use this number to determine indentation.
			 * @type {number}
			 */
			indentation: { type: Number, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: grid;
				grid-template-columns:
					[start outside-control-start] minmax(0, min-content)
					[color-start outside-control-end] minmax(0, min-content)
					[expand-collapse-start color-end] minmax(0, min-content)
					[control-start expand-collapse-end] minmax(0, min-content)
					[control-end content-start] minmax(0, auto)
					[content-end actions-start] minmax(0, min-content)
					[end actions-end];
				grid-template-rows:
					[start add-top-start] minmax(0, min-content)
					[add-top-end main-start] minmax(0, min-content)
					[main-end nested-start] minmax(0, min-content)
					[nested-end add-start] minmax(0, min-content)
					[add-end end];
			}

			:host([align-nested="control"]) ::slotted([slot="nested"]) {
				grid-column: control-start / end;
			}

			::slotted([slot="drop-target"]) {
				grid-column: start / end;
			}

			::slotted([slot="outside-control"]),
			::slotted([slot="color-indicator"]),
			::slotted([slot="expand-collapse"]),
			::slotted([slot="control"]),
			::slotted([slot="content"]),
			::slotted([slot="actions"]),
			::slotted([slot="outside-control-action"]),
			::slotted([slot="before-content"]),
			::slotted([slot="control-action"]),
			::slotted([slot="content-action"]),
			::slotted([slot="outside-control-container"]),
			::slotted([slot="control-container"]),
			::slotted([slot="drop-target"]) {
				grid-row: 2 / 3;
			}

			::slotted([slot="outside-control"]) {
				grid-column: outside-control-start / outside-control-end;
			}

			::slotted([slot="outside-control"]:not(.handle-only)) {
				pointer-events: none;
			}

			::slotted([slot="expand-collapse"]) {
				cursor: pointer;
				grid-column: expand-collapse-start / expand-collapse-end;
			}

			::slotted([slot="control"]) {
				grid-column: control-start / control-end;
				pointer-events: none;
				width: 2.2rem;
			}

			::slotted([slot="content"]) {
				grid-column: content-start / content-end;
			}

			::slotted([slot="color-indicator"]) {
				grid-column: color-start / color-end;
			}

			::slotted([slot="before-content"]) {
				grid-column: color-start / content-start;
			}

			::slotted([slot="control-action"]) ~ ::slotted([slot="content"]),
			::slotted([slot="outside-control-action"]) ~ ::slotted([slot="content"]) {
				pointer-events: unset;
			}

			slot[name="actions"] {
				white-space: nowrap;
			}

			::slotted([slot="actions"]) {
				grid-column: actions-start / actions-end;
				justify-self: end;
			}

			::slotted([slot="outside-control-action"]) {
				grid-column: start / end;
			}
			:host([no-primary-action]) ::slotted([slot="outside-control-action"]) {
				grid-column: start / outside-control-end;
			}

			::slotted([slot="content-action"]) {
				grid-column: content-start / content-end;
			}

			:host([no-primary-action]) ::slotted([slot="content-action"]) {
				display: none;
			}

			::slotted([slot="control-action"]) {
				grid-column-start: control-start;
			}

			:host(:not([no-primary-action])) ::slotted([slot="outside-control-action"]) {
				grid-column-end: end;
			}
				
			:host(:not([no-primary-action])) ::slotted([slot="control-action"]) {
				grid-column-end: actions-start;
			}

			::slotted([slot="outside-control-container"]) {
				grid-column: start / end;
			}
			::slotted([slot="control-container"]) {
				grid-column: color-start / end;
			}

			::slotted([slot="nested"]) {
				grid-column: content-start / end;
				grid-row: nested;
			}

			:host([indentation]) ::slotted([slot="nested"]) {
				grid-column-start: start;
				padding-inline-start: var(--d2l-list-item-generic-layout-nested-indentation);
			}

			::slotted([slot="add"]) {
				grid-row: add;
			}
			::slotted([slot="add-top"]) {
				grid-row: add-top;
			}
			::slotted([slot="add-top"]),
			::slotted([slot="add"]) {
				grid-column: color-start / end;
			}
		`;
	}

	constructor() {
		super();
		this.alignNested = 'content';
		this.noPrimaryAction = false;
		this._preventFocus = {
			handleEvent(event) {
				// target content slot only for now - can add others later
				const slot = (event.path || event.composedPath()).find((node) =>
					node.nodeName === 'SLOT' && ['content'].includes(node.name)
				);
				console.warn(`${slot.name} area should not have focusable items in it. Consider using href or creating a custom list-item.`);
			},
			capture: true
		};

	}

	connectedCallback() {
		super.connectedCallback();
		this.role = this.gridActive ? 'gridcell' : undefined;
	}

	firstUpdated() {
		this.addEventListener('keydown', this._onKeydown.bind(this));
	}

	render() {
		return html`
			<slot name="add-top" class="d2l-cell" data-cell-num="10"></slot>

			<slot name="control-container"></slot>
			<slot name="outside-control-container"></slot>
			<slot name="before-content"></slot>

			<slot name="content-action" class="d2l-cell" data-cell-num="6"></slot>
			<slot name="outside-control" class="d2l-cell" data-cell-num="2"></slot>
			<slot name="outside-control-action" class="d2l-cell" data-cell-num="1"></slot>
			<slot name="color-indicator"></slot>
			<slot name="expand-collapse" class="d2l-cell" data-cell-num="4"></slot>
			<slot name="content" class="d2l-cell" data-cell-num="8" @focus="${!this.noPrimaryAction ? this._preventFocus : null}"></slot>
			<slot name="control-action" class="d2l-cell" data-cell-num="3"></slot>
			<slot name="control" class="d2l-cell" data-cell-num="5"></slot>
			<slot name="actions" class="d2l-cell" data-cell-num="7"></slot>

			<slot name="drop-target"></slot>
			<slot name="nested"></slot>
			<slot name="add" class="d2l-cell" data-cell-num="9"></slot>
		`;
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('indentation')) {
			this.style.setProperty('--d2l-list-item-generic-layout-nested-indentation', `${this.indentation}px`);
		}
	}

	_focusCellItem(focusInfo) {
		const cell = this.shadowRoot?.querySelector(`[data-cell-num="${focusInfo.cellNum}"]`);
		if (!cell) return;

		let focusable;
		const focusables = getFocusableDescendants(cell, { deep: true, predicate: elem => !isInteractiveDescendant(elem) });

		if (focusInfo.index <= focusables.length - 1) focusable = focusables[focusInfo.index];
		else if (focusables.length > 0) focusable = focusables[focusables.length - 1];

		if (focusable) focusable.focus();
		return focusable;
	}

	_focusFirstCell() {
		this._focusNextCell(1);
	}

	_focusFirstRow() {
		const list = findComposedAncestor(this, (node) => node.tagName === 'D2L-LIST');
		const row = list.firstElementChild.shadowRoot.querySelector('[role="gridcell"]');
		if (this.dir === 'rtl') {
			row._focusLastCell();
		} else {
			row._focusFirstCell();
		}
	}

	_focusLastCell() {
		let cell = null;
		let focusable = null;
		let num = 1;
		do {
			cell = this.shadowRoot && this.shadowRoot.querySelector(`[data-cell-num="${num++}"]`);
			if (cell) {
				focusable = getLastFocusableDescendant(cell) || focusable;
			}
		} while (cell);
		focusable.focus();
	}

	_focusLastRow() {
		const list = findComposedAncestor(this, (node) => node.tagName === 'D2L-LIST');
		const row = list.lastElementChild.shadowRoot.querySelector('[role="gridcell"]');
		if (this.dir === 'rtl') {
			row._focusFirstCell();
		} else {
			row._focusLastCell();
		}
	}

	_focusNextCell(num, forward = true) {
		let cell = null;
		let focusable = null;

		do {
			cell = this.shadowRoot && this.shadowRoot.querySelector(`[data-cell-num="${num}"]`);
			if (cell) {
				focusable = forward ? getFirstFocusableDescendant(cell) : getLastFocusableDescendant(cell);
			}
			if (focusable) focusable.focus();
			forward ? ++num : --num;
		} while (cell && !focusable);

		if (!cell) {
			// wrap to first/last item
			if (forward) this._focusFirstCell();
			else this._focusLastCell();
		}

		return focusable;
	}

	_focusNextRow(focusInfo, previous = false, num = 1) {

		const curListItem = findComposedAncestor(this, node => node.role === 'row');
		let listItem = curListItem;

		while (num > 0) {
			const tempListItem = (previous ? this._getPreviousFlattenedListItem(listItem) : this._getNextFlattenedListItem(listItem));
			if (tempListItem) listItem = tempListItem;
			else break;
			num--;
		}

		if (!listItem) return;
		const listItemRow = listItem.shadowRoot.querySelector('[role="gridcell"]');
		const focusedCellItem = listItemRow._focusCellItem(focusInfo);

		if (!focusedCellItem) {
			// could not focus on same cell in adjacent list-item so try general focus on item
			if (!listItem._tryFocus()) {
				// ultimate fallback to generic method for getting next/previous focusable
				const nextFocusable = previous ? getPreviousFocusable(listItem) : getNextFocusable(listItem);
				const nextListItem = findComposedAncestor(nextFocusable, (node) => node.role === 'row' || node.role === 'listitem');
				if (nextListItem && this._isContainedInSameRootList(curListItem, nextListItem)) {
					nextFocusable.focus();
				}
			}
		}

	}

	_focusNextWithinRow(focusInfo, focusables) {
		if (focusInfo.index === focusables.length - 1) this._focusNextCell(focusInfo.cellNum + 1);
		else focusables[focusInfo.index + 1].focus();
	}

	_focusPreviousWithinRow(focusInfo, focusables) {
		if (focusInfo.index === 0) this._focusNextCell(focusInfo.cellNum - 1, false);
		else focusables[focusInfo.index - 1].focus();
	}

	_getNextFlattenedListItem(listItem) {

		// check for nested list first; this check needs to account for standard list-items as well as custom
		const nestedList = listItem.querySelector('[slot="nested"]') || listItem.shadowRoot.querySelector('d2l-list');
		if (nestedList && (!listItem.expandable || (listItem.expandable && listItem.expanded))) {
			const nestedListItem = [...nestedList.children].find(node => node.role === 'row');
			if (nestedListItem) return nestedListItem;
		}

		const getNextListItem = listItem => {

			// check for sibling list-item
			let nextElement = listItem.nextElementSibling;
			while (nextElement) {
				if (nextElement.role === 'row') return nextElement;
				nextElement = nextElement.nextElementSibling;
			}

			// no sibling list-item was found so check for sibling of parent list-item if nested, recursively if necessary
			const list = findComposedAncestor(listItem, node => node.tagName === 'D2L-LIST');
			if (list.slot !== 'nested' && !(list.parentNode.tagName === 'SLOT' && list.parentNode.name === 'nested')) return;

			const parentListItem = findComposedAncestor(list, node => node.role === 'row');
			return getNextListItem(parentListItem);

		};

		// check for sibling list-item or ancestors sibling list-items
		return getNextListItem(listItem);

	}

	_getPreviousFlattenedListItem(listItem) {

		let previousElement = listItem.previousElementSibling;

		// try to get the previous list-item in the current list sub-tree including nested
		while (previousElement) {
			if (previousElement.role === 'row') {

				let nestedList;
				do {
					// this check needs to account for standard list-items as well as custom
					nestedList = previousElement.querySelector('[slot="nested"]') || previousElement.shadowRoot.querySelector('d2l-list');
					if (listItemUpButtonFixFlag) {
						// if there is nested list and nested list content is accessible
						if (nestedList && (!previousElement.expandable || (previousElement.expandable && previousElement.expanded))) {
							const nestedListItems = [...nestedList.children].filter(node => node.role === 'row');
							if (nestedListItems.length) {
								previousElement = nestedListItems[nestedListItems.length - 1];
							} else {
								break;
							}
						} else {
							break;
						}
					} else {
						if (nestedList) {
							const nestedListItems = [...nestedList.children].filter(node => node.role === 'row');
							if (nestedListItems.length) {
								previousElement = nestedListItems[nestedListItems.length - 1];
							} else {
								break;
							}
						}
					}
				}	while (nestedList);
				return previousElement;
			}
			previousElement = previousElement.previousElementSibling;
		}

		// no previous list-item was found in the current list sub-tree so get the parent list item if currently in nested
		const list = findComposedAncestor(listItem, node => node.tagName === 'D2L-LIST');

		// this check needs to account for standard list-items as well as custom
		if (list.slot === 'nested' || (list.parentNode.tagName === 'SLOT' && list.parentNode.name === 'nested')) {
			const parentListItem = findComposedAncestor(list, node => node.role === 'row');
			return parentListItem;
		}

	}

	_isContainedInSameRootList(item, node) {
		const rootList = item?.getRootList?.(item);
		return isComposedAncestor(rootList, node);
	}

	_onKeydown(e) {
		if (!this.gridActive) return;
		let preventDefault = true;

		const node = getComposedActiveElement();
		const cell = findComposedAncestor(node, parent => parent.classList?.contains('d2l-cell'));
		if (!cell) return;

		const focusables = getFocusableDescendants(cell, { deep: true, predicate: elem => !isInteractiveDescendant(elem) });
		const focusInfo = {
			cellNum: parseInt(cell.getAttribute('data-cell-num')),
			index: focusables.findIndex(elem => elem === node)
		};

		switch (e.keyCode) {
			case keyCodes.RIGHT:
				if (this.dir === 'rtl') {
					this._focusPreviousWithinRow(focusInfo, focusables);
				} else {
					this._focusNextWithinRow(focusInfo, focusables);
				}
				break;
			case keyCodes.LEFT:
				if (this.dir === 'rtl') {
					this._focusNextWithinRow(focusInfo, focusables);
				} else {
					this._focusPreviousWithinRow(focusInfo, focusables);
				}
				break;
			case keyCodes.UP:
				// move to above row, focus same item within the cell
				this._focusNextRow(focusInfo, true);
				break;
			case keyCodes.DOWN:
				// move to below row, focus same item within the cell
				this._focusNextRow(focusInfo);
				break;
			case keyCodes.HOME:
				if (this.dir === 'rtl') {
					if (e.ctrlKey) {
						this._focusFirstRow();
					} else {
						// focus last cell
						this._focusLastCell();
					}
				} else {
					if (e.ctrlKey) {
						// focus first item of first row
						this._focusFirstRow();
					} else {
						// focus first cell
						this._focusFirstCell();
					}
				}
				break;
			case keyCodes.END:
				if (this.dir === 'rtl') {
					if (e.ctrlKey) {
						// focus first item of last row
						this._focusLastRow();
					} else {
						// focus first cell
						this._focusFirstCell();
					}
				} else {
					if (e.ctrlKey) {
						// focus last item of last row
						this._focusLastRow();
					} else {
						// focus last cell
						this._focusLastCell();
					}
				}
				break;
			case keyCodes.PAGEUP:
				// focus five rows up
				this._focusNextRow(focusInfo, true, 5);
				break;
			case keyCodes.PAGEDOWN:
				// focus five rows down
				this._focusNextRow(focusInfo, false, 5);
				break;
			default:
				preventDefault = false;
		}

		if (preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}
		return;
	}

}

customElements.define('d2l-list-item-generic-layout', ListItemGenericLayout);

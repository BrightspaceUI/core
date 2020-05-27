import { css, html, LitElement } from 'lit-element/lit-element.js';
import { findComposedAncestor, getNextAncestorSibling, getPreviousAncestorSibling, isComposedAncestor } from '../../helpers/dom.js';
import {
	getComposedActiveElement,
	getFirstFocusableDescendant,
	getLastFocusableDescendant,
	getNextFocusable,
	getPreviousFocusable,
	isFocusable } from '../../helpers/focus.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const keyCodes = {
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	LEFT: 37,
	PAGEUP: 33,
	PAGEDOWN: 34,
	SPACE: 32,
	RIGHT: 39,
	UP: 38
};

class ListItemGenericLayout extends RtlMixin(LitElement) {

	static get properties() {
		return {
			role: { type: String, reflect: true },
			gridActive: { type: Boolean, attribute: 'grid-active' }
		};
	}

	static get styles() {
		return css`
			:host {
				display: grid;
				grid-template-columns:
					[start outside-control-start] minmax(0, min-content)
					[control-start outside-control-end] minmax(0, min-content)
					[control-end content-start] auto
					[content-end actions-start] auto
					[end actions-end];
			}
			::slotted([slot="outside-control"]),
			::slotted([slot="control"]),
			::slotted([slot="content"]),
			::slotted([slot="actions"]) {
				grid-row: 1 / 2;
			}
			::slotted([slot="outside-control"]) {
				width: 40px;
				grid-column: outside-control-start / outside-control-end;
			}

			::slotted([slot="control"]) {
				width: 40px;
				grid-column: control-start / control-end;
			}

			::slotted([slot="content"]) {
				grid-column: content-start / content-end;
			}

			::slotted([slot="actions"]) {
				grid-column: actions-start / actions-end;
				z-index: 4;
			}

			::slotted([slot="outside-control-action"]),
			::slotted([slot="control-action"]),
			::slotted([slot="content-action"]) {
				grid-row: 1 / 2;
			}
			::slotted([slot="outside-control-action"]) {
				grid-column: start / end;
				z-index: 1;
			}
			::slotted([slot="control-action"]) {
				grid-column: control-start / end;
				z-index: 2;
			}
			::slotted([slot="content-action"]) {
				grid-column: content-start / end;
				z-index: 3;
			}
		`;
	}

	constructor() {
		super();
		this.role = 'gridrow';
		this.gridActive = true;

		this._preventFocus = {
			handleEvent(event) {
				event.preventDefault();
				// target content slot only for now - can add others later
				const slot = (event.path || event.composedPath()).find((node) =>
					node.nodeName === 'SLOT' && ['content'].includes(node.name)
				);
				const ancestorSibling = getNextAncestorSibling(slot);
				const next = getNextFocusable(ancestorSibling, true);
				// related target is often on the parent
				const related = getFirstFocusableDescendant(event.relatedTarget);
				if (!event.relatedTarget) {
					next.focus();
				} else {
					if (event.relatedTarget === next || related === next) {
						getPreviousFocusable(slot, true).focus(); // backward tab
					} else {
						next.focus(); // forward tab
					}
				}
			},
			capture: true
		};
		this._preventClick = {
			handleEvent(event) {
				event.preventDefault();
				return false;
			},
			capture: true
		};
	}

	firstUpdated() {
		this.addEventListener('keydown', this._handleKeydown.bind(this));
		this.addEventListener('focusin', this._setFocusInfo.bind(this));
	}

	render() {
		return html`
		<slot name="content-action" class="d2l-cell" cell-num="5"></slot>
		<slot name="outside-control-action" class="d2l-cell" cell-num="1"></slot>
		<slot name="outside-control" class="d2l-cell" cell-num="2"></slot>
		<slot name="control-action" class="d2l-cell" cell-num="3"></slot>
		<slot name="control" class="d2l-cell" cell-num="4"></slot>
		<slot name="actions" class="d2l-cell" cell-num="6"></slot>

		<slot name="content" @focus="${this._preventFocus}" @click="${this._preventClick}"></slot>
		`;
	}

	_getPrevSiblingInCell(node) {
		const cell = findComposedAncestor(node, (parent) => parent.classList && parent.classList.contains('d2l-cell'));
		if (cell.name === node.slot) return null;
		if (node.previousElementSibling) return node.previousElementSibling;

		const sibling = getPreviousAncestorSibling(node);
		return isComposedAncestor(cell, sibling) ? sibling : null;
	}

	_getNextSiblingInCell(node) {
		const cell = findComposedAncestor(node, (parent) => parent.classList && parent.classList.contains('d2l-cell'));
		if (cell.name === node.slot) return null;
		if (node.nextElementSibling) return node.nextElementSibling;

		const sibling = getNextAncestorSibling(node);
		return isComposedAncestor(cell, sibling) ? sibling : null;
	}

	_getThisCell() {
		return this.shadowRoot.querySelector(`.d2l-cell[cell-num="${this._cellNum}"]`);
	}

	_getFocusedItemPosition(node) {
		let position = 1;
		// walk the tree backwards until we hit the cell
		do {
			node = this._getPrevSiblingInCell(node);
			if (node) {
				const focusable = isFocusable(node, true) ? node : getLastFocusableDescendant(node);
				if (focusable) {
					++position;
					node = focusable;
				}
			}
		} while (node);
		return position;
	}

	_handleKeydown(event) {
		if (!this.gridActive) return;
		let node = null;
		switch (event.keyCode) {
			case keyCodes.RIGHT:
				node = getComposedActiveElement();
				if (this.dir === 'rtl') {
					if (!this._focusPreviousWithinCell(node)) {
						this._focusNextCell(this._cellNum - 1, false);
					}
				} else {
					if (!this._focusNextWithinCell(node)) {
						this._focusNextCell(this._cellNum + 1);
					}
				}
				break;
			case keyCodes.LEFT:
				node = getComposedActiveElement();
				if (this.dir === 'rtl') {
					if (!this._focusNextWithinCell(node)) {
						this._focusNextCell(this._cellNum + 1);
					}
				} else {
					if (!this._focusPreviousWithinCell(node)) {
						this._focusNextCell(this._cellNum - 1, false);
					}
				}
				break;
			case keyCodes.UP:
				// move to above row, focus same item within the cell
				this._focusNextRow(true);
				event.preventDefault();
				break;
			case keyCodes.DOWN:
				// move to below row, focus same item within the cell
				this._focusNextRow();
				event.preventDefault();
				break;
			case keyCodes.HOME:
				// focus first item
				this._focusNextCell(1);
				if (event.ctrlKey) {
					// focus first item of first row
					this._focusFirstRow();
				}
				break;
			case keyCodes.END:
				//focus last item
				if (event.ctrlKey) {
					// focus last item of last row
					this._focusLastRow();
				}
				break;
			case keyCodes.PAGEUP:
				// focus five rows up
				this._focusPreviousRow(5);
				break;
			case keyCodes.PAGEDOWN:
				// focus five rows down
				this._focusNextRow(5);
				break;
		}
	}

	_focusCellItem(num, itemNum) {
		const cell = this.shadowRoot.querySelector(`[cell-num="${num}"]`);
		if (!cell) return;
		const firstFocusable = getFirstFocusableDescendant(cell);
		if (!firstFocusable) return;
		if (itemNum === 1) {
			this._focusItem(firstFocusable, num, 1);
			return;
		}
		this._cellNum = num;
		if (!this._focusNextWithinCell(firstFocusable, itemNum)) {
			this._focusItem(firstFocusable, num, 1);
		}
	}

	_focusNextCell(num, forward = true) {
		let cell = null;
		let focusable = null;
		do {
			cell = this.shadowRoot.querySelector(`[cell-num="${num}"]`);
			if (cell) {
				focusable = forward ? getFirstFocusableDescendant(cell) : getLastFocusableDescendant(cell);
			}
			if (focusable) this._focusItem(focusable, num, forward ? 1 : this._getFocusedItemPosition(focusable));
			forward ? ++num : --num;
		} while (cell && !focusable);
		return focusable;
	}

	_focusNextWithinCell(node, num = 1) {
		if (!node || (node.assignedSlot && node.assignedSlot === this._getThisCell())) return null;
		let focusable = null;
		let siblingNum = 1;
		while (!focusable || siblingNum < num) {
			node = this._getNextSiblingInCell(node);
			if (!node) break;
			++siblingNum;
			focusable = isFocusable(node, true) ? node : getFirstFocusableDescendant(node);
		}

		if (focusable) this._focusItem(focusable, this._cellNum, this._getFocusedItemPosition(focusable));
		return focusable;
	}

	_focusPreviousWithinCell(node) {
		if (!node || node.assignedSlot === this._getThisCell()) return null;
		let focusable = null;
		while (!focusable) {
			node = this._getPrevSiblingInCell(node);
			if (!node) break;
			focusable = isFocusable(node, true) ? node : getLastFocusableDescendant(node);
		}
		if (focusable) this._focusItem(focusable, this._cellNum, this._getFocusedItemPosition(focusable));
		return focusable;
	}

	_focusItem(focusable, cellNum, cellFocusedItem) {
		this._cellNum = cellNum;
		this._cellFocusedItem = cellFocusedItem;
		this._focusInfoSet = true;
		focusable.focus();
		this._focusInfoSet = false;
	}

	_focusNextRow(previous = false) {
		const listItem = previous ? getPreviousAncestorSibling(this) : getNextAncestorSibling(this);
		if (!listItem || !listItem.shadowRoot) return;

		const row = listItem.shadowRoot.querySelector('[role="gridrow"]');
		if (!row) return;

		row._focusCellItem(this._cellNum, this._cellFocusedItem);
	}

	_setFocusInfo(event) {
		if (this._focusInfoSet) return; //prevent unnecessary work

		const slot = (event.path || event.composedPath()).find(node =>
			node.nodeName === 'SLOT' && node.classList.contains('d2l-cell'));
		this._cellNum = parseInt(slot.getAttribute('cell-num'));
		this._cellFocusedItem = this._getFocusedItemPosition(event.target);
	}
}

customElements.define('d2l-list-item-generic-layout', ListItemGenericLayout);

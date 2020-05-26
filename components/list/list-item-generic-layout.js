import { css, html, LitElement } from 'lit-element/lit-element.js';
import {
	getComposedActiveElement,
	getFirstFocusableDescendant,
	getLastFocusableDescendant,
	getNextFocusable,
	getPreviousFocusable,
	isFocusable } from '../../helpers/focus.js';
import { getNextAncestorSibling, getPreviousAncestorSibling } from '../../helpers/dom.js';

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

class ListItemGenericLayout extends LitElement {

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
		return node.previousElementSibling ||
			getPreviousAncestorSibling(node, () => true,
				// stop when we've reached the cell
				(node) => node.assignedSlot && node.assignedSlot.classList.contains('d2l-cell'));
	}

	_getNextSiblingInCell(node) {
		return node.nextElementSibling ||
			getNextAncestorSibling(node, () => true,
				// stop when we've reached the cell
				(node) => node.assignedSlot && node.assignedSlot.classList.contains('d2l-cell'));
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
		console.log('position', position);
		return position;
	}

	_handleKeydown(event) {
		if (!this.gridActive) return;
		let node = null;
		switch (event.keyCode) {
			case keyCodes.RIGHT:
				node = getComposedActiveElement();
				if (!this._focusNextWithinCell(node)) {
					this._focusNextCell(this._cellNum + 1);
				}
				break;
			case keyCodes.LEFT:
				node = getComposedActiveElement();
				if (!this._focusPreviousWithinCell(node)) {
					this._focusNextCell(this._cellNum - 1, false);
				}
				break;
			case keyCodes.UP:
				// move to above row, focus same item within the cell
				break;
			case keyCodes.DOWN:
				// move to below row, focus same item within the cell
				break;
			case keyCodes.HOME:
				// focus first item
				if (event.ctrlKey) {
					// focus first item of first row
				}
				break;
			case keyCodes.END:
				//focus last item
				if (event.ctrlKey) {
					// focus last item of last row
				}
				break;
			case keyCodes.PAGEUP:
				// focus five rows up
				break;
			case keyCodes.PAGEDOWN:
				// focus five rows down
				break;
		}
	}

	_focusNextCell(num, forward = true) {
		let cell;
		let focusable = null;
		console.log('next cell', forward);
		do {
			console.log('num', num);
			cell = this.shadowRoot.querySelector(`[cell-num="${num}"]`);
			if (cell) {
				focusable = forward ? getFirstFocusableDescendant(cell) : getLastFocusableDescendant(cell);
			}
			if (focusable) this._focusItem(focusable, num, 1);
			forward ? ++num : --num;
		} while (cell && !focusable);
		return focusable;
	}

	_focusNextWithinCell(node, num = 1) {
		if (!node || (node.assignedSlot && node.assignedSlot.classList.contains('d2l-cell'))) return null;
		let focusable = null;
		let siblingNum = 0;
		console.log('within cell', node);
		while (!focusable || siblingNum < num) {
			node = this._getNextSiblingInCell(node);
			console.log('next node', node);
			if (!node) break;
			++siblingNum;
			focusable = isFocusable(node, true) ? node : getFirstFocusableDescendant(node);
		}
		if (focusable) this._focusItem(focusable, this._cellNum, siblingNum);
		return focusable;
	}

	_focusPreviousWithinCell(node) {
		if (!node || (node.assignedSlot && node.assignedSlot.classList.contains('d2l-cell'))) return null;
		let focusable = null;
		let siblingNum = 0;
		console.log('prev within cell', node);
		while (!focusable) {
			node = this._getPrevSiblingInCell(node);
			console.log('prev node', node);
			if (!node) break;
			++siblingNum;
			focusable = isFocusable(node, true) ? node : getLastFocusableDescendant(node);
		}

		//todo: get sibling's position
		if (focusable) this._focusItem(focusable, this._cellNum, siblingNum);
		return focusable;
	}

	_focusItem(focusable, cellNum, cellFocusedItem) {
		this._cellNum = cellNum;
		this._cellFocusedItem = cellFocusedItem;
		this._focusInfoSet = true;
		focusable.focus();
		this._focusInfoSet = false;
	}

	_focusNextRow() {

	}

	_focusPreviousRow() {

	}

	_setFocusInfo(event) {
		if (this._focusInfoSet) return; //prevent unnecessary work
		const slot = (event.path || event.composedPath()).find(node =>
			node.nodeName === 'SLOT' && node.classList.contains('d2l-cell'));
		this._cellNum = parseInt(slot.getAttribute('cell-num'));
		//TODO: set the cellFocusedItem according to which siblings are focusable
		//this._cellFocusedItem = this._getFocusedItemPosition(event.target);
	}
}

customElements.define('d2l-list-item-generic-layout', ListItemGenericLayout);

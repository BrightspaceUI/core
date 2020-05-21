import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getNextAncestorSibling } from '../../helpers/dom.js';
import { getComposedActiveElement, getFirstFocusableDescendant, getNextFocusable, getPreviousFocusable, isFocusable } from '../../helpers/focus.js';

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

	_handleKeydown(event) {
		if (!this.gridActive) return;
		//const active = getComposedActiveElement();

		switch (event.keyCode) {
			case keyCodes.RIGHT:
				this._focusNext(this._cellNum + 1);
				break;

		}
	}

	_focusNextCell(num) {
		let cell;
		do {
			let focusable;
			cell = this.shadowRoot.querySelector(`[cell-num="${num}"]`);
			if (cell) focusable = getFirstFocusableDescendant(cell);
			if (focusable) this._focusItem(focusable, num, 1);
			++num;
		} while (cell);
	}

	_focusItem(focusable, cellNum, cellFocusedItem) {
		this._cellNum = cellNum;
		this._cellFocusedItem = cellFocusedItem;
		this._focusInfoSet = true;
		focusable.focus();
		this._focusInfoSet = false;
	}

	_setFocusInfo(event) {
		if (this._focusInfoSet) return; //prevent unnecessary work
		const slot = (event.path || event.composedPath()).find(node =>
			node.nodeName === 'SLOT' && node.classList.contains('d2l-cell'));
		this._cellNum = parseInt(slot.getAttribute('cell-num'));
		//TODO: set the cellFocusedItem according to which siblings are focusable
	}
}

function getNextFocusableSibling(node, includeHidden = true) {
	if (!node) return null;
	let focusable = null;
	while (!focusable && (node = node.nextElementSibling) !== null) {
		if (isFocusable(node, includeHidden)) {
			focusable = node;
		} else {
			focusable = getFirstFocusableDescendant(node);
		}
	}
	return focusable;
}

customElements.define('d2l-list-item-generic-layout', ListItemGenericLayout);

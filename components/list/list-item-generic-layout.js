import { css, html, LitElement } from 'lit-element/lit-element.js';
import { findComposedAncestor, getNextAncestorSibling } from '../../helpers/dom.js';
import { getFirstFocusableDescendant, getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';

class ListItemGenericLayout extends LitElement {

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
		this._preventFocus = {
			handleEvent(event) {
				event.preventDefault();
				// target content slot only for now - can add others later
				// TODO findComposedAncestor should be replaced with event.path || event.composedPath() when supported
				const slot = findComposedAncestor(event.target, (node) =>
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

	render() {
		return html`
		<slot name="content-action"></slot>
		<slot name="outside-control-action"></slot>
		<slot name="outside-control"></slot>
		<slot name="control-action"></slot>
		<slot name="control"></slot>
		<slot name="actions"></slot>

		<slot name="content" @focus="${this._preventFocus}" @click="${this._preventClick}"></slot>
		`;
	}
}

customElements.define('d2l-list-item-generic-layout', ListItemGenericLayout);

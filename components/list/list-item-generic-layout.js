import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getAllFocusableDescendants } from '../../helpers/focus.js';

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
				grid-column: outside-control-start / outside-control-end;
			}

			::slotted([slot="control"]) {
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

	connectedCallback() {
		super.connectedCallback();

		this._preventFocusFromNonActions();
	}

	disconnectedCallback() {
		this._removeListenersFromNonActions();

		super.disconnectedCallback();
	}

	render() {
		return html`
		<slot name="content-action"></slot>
		<slot name="outside-control-action"></slot>
		<slot name="control-action"></slot>
		<slot name="actions"></slot>

		<slot name="outside-control"></slot>
		<slot name="control"></slot>
		<slot name="content"></slot>
		`;
	}

	_getContentFocusables() {
		const slots = [
			'content',
			'control',
			'outside-control'
		];
		const focusables = [];
		for (const slot of slots) {
			const content = this.querySelector(`[slot="${slot}"]`);
			const descendants = content ? getAllFocusableDescendants(content) : [];
			focusables.push(...descendants);
		}
		return focusables;
	}

	_preventClick(event) {
		event.preventDefault();
		return false;
	}

	_preventFocusFromNonActions() {
		const focusables = this._getContentFocusables();
		for (const focusable of focusables) {
			// remove focus and click events from focusable items.
			// Items requiring focus MUST be placed within an action area
			focusable.setAttribute('tabindex', '-1');
			focusable.addEventListener('click', this._preventClick);
		}
	}

	_removeListenersFromNonActions() {
		const focusables = this._getContentFocusables();
		for (const focusable of focusables) {
			focusable.removeEventListener('click', this._preventClick);
		}
	}
}

customElements.define('d2l-list-item-generic-layout', ListItemGenericLayout);

import { css, html, LitElement } from 'lit-element/lit-element.js';

export class ListItemGeneric extends LitElement {

	static get styles() {
		return css`
			:host {
				display: grid;
				grid-template-columns:
					[start outside-control-start] 0
					[control-start outside-control-end] 40px
					[control-end content-start] auto
					[content-end actions-start] auto
					[end actions-end];
			}
			::slotted([slot="outside-control"]),
			::slotted([slot="control"]) ,
			::slotted([slot="content"]) ,
			::slotted([slot="actions"])  {
				grid-row: 1 / 2;
			}
			::slotted([slot="outside-control"]) {
				grid-column: outside-control-start / outside-control-end;
				margin-left: -40px
			}

			::slotted([slot="control"]) {
				grid-column: control-start / control-end;
			}

			::slotted([slot="content"]) {
				grid-column: content-start / content-end;
			}

			::slotted([slot="actions"])  {
				grid-column: actions-start / actions-end;
				z-index: 4;
			}

			::slotted([slot="outside-control-action"]),
			::slotted([slot="control-action"]),
			::slotted([slot="content-action"]) {
				grid-row: 1 / 2;
				cursor: pointer;
			}
			:host[disabled] ::slotted([slot="outside-control-action"]),
			:host[disabled] ::slotted([slot="control-action"]),
			:host[disabled] ::slotted([slot="content-action"]) {
				cursor: default;
			}
			::slotted[slot="outside-control-action"] {
				grid-column: start / end;
				z-index: 1;
				margin-left:-40px;
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

	render() {
		return html`
		<slot name="outside-control"></slot>
		<slot name="control"></slot>
		<slot name="content"></slot>
		<slot name="actions"></slot>

		<slot name="outside-control-action"></slot>
		<slot name="control-action"></slot>
		<slot name="content-action"></slot>
		`;
	}
}

customElements.define('d2l-list-item-generic', ListItemGeneric);

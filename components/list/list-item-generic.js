import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const defaultBreakpoints = [842, 636, 580, 0];

export class ListItemGeneric extends RtlMixin(LitElement) {

	static get properties() {
		return {
			breakpoints: { type: Array },
			href: { type: String },
			role: { type: String, reflect: true },
			_breakpoint: { type: Number }
		};
	}

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
			::slotted([slot="outside-control-area"]),
			::slotted([slot="control-area"]) ,
			::slotted([slot="content-area"]) ,
			::slotted([slot="actions-area"])  {
				grid-row: 1 / 2;
			}
			::slotted([slot="outside-control-area"]) {
				grid-column: outside-control-start / outside-control-end;
				margin-left: -40px
			}

			::slotted([slot="control-area"]) {
				grid-column: control-start / control-end;
			}

			::slotted([slot="content-area"]) {
				grid-column: content-start / content-end;
			}

			::slotted([slot="actions-area"])  {
				grid-column: actions-start / actions-end;
				z-index: 4;
			}

			::slotted([slot="outside-control-action-area"]),
			::slotted([slot="control-action-area"]),
			::slotted([slot="content-action-area"]) {
				grid-row: 1 / 2;
				cursor: pointer;
			}
			:host[disabled] ::slotted([slot="outside-control-action-area"]),
			:host[disabled] ::slotted([slot="control-action-area"]),
			:host[disabled] ::slotted([slot="content-action-area"]) {
				cursor: default;
			}
			::slotted[slot="outside-control-action-area"] {
				grid-column: start / end;
				z-index: 1;
				margin-left:-40px;
			}
			::slotted([slot="control-action-area"]) {
				grid-column: control-start / end;
				z-index: 2;
			}
			::slotted([slot="content-action-area"]) {
				grid-column: content-start / end;
				z-index: 3;
			}
		`;
	}

	constructor() {
		super();
		this._breakpoint = 0;
		this.breakpoints = defaultBreakpoints;
		this.role = 'listitem';
		this._contentId = getUniqueId();
	}

	render() {
		return html`
		<slot name="outside-control-area"></slot>
		<slot name="control-area"></slot>
		<slot name="content-area"></slot>
		<slot name="actions-area"></slot>

		<slot name="outside-control-action-area"></slot>
		<slot name="control-action-area"></slot>
		<slot name="content-action-area"></slot>
		`;
	}
}

customElements.define('d2l-list-item-generic', ListItemGeneric);

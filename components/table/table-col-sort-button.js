import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

/**
 *
 * Button for sorting a table column in ascending/descending order.
 *
 * @slot - Text of the sort button
 */
export class TableColSortButton extends LitElement {

	static get properties() {
		return {
			/**
			 * Whether the direction is descending
			 * @type {boolean}
			 */
			desc: {
				reflect: true,
				type: Boolean
			},
			/**
			 * When present, hides the asc/desc sort icon
			 * @type {boolean}
			 */
			nosort: {
				reflect: true,
				type: Boolean
			}
		};
	}

	static get styles() {
		return css`
			button {
				background-color: transparent;
				border: none;
				color: inherit;
				cursor: pointer;
				display: inline-block;
				font-family: inherit;
				font-size: inherit;
				letter-spacing: inherit;
				margin: 0;
				padding: 0;
				text-decoration: none;
			}
			button::-moz-focus-inner {
				border: 0;
			}
			button:disabled {
				opacity: 0.5;
			}
			button:hover,
			button:focus {
				outline-style: none;
				text-decoration: underline;
			}
		`;
	}

	constructor() {
		super();
		this.nosort = false;
		this.desc = false;
	}

	render() {
		const iconView = !this.nosort ?
			html`<d2l-icon icon="${this.desc ? 'tier1:arrow-toggle-down' : 'tier1:arrow-toggle-up'}"></d2l-icon>` :
			null;
		return html`<button type="button"><slot></slot>${iconView}</button>`;
	}

	focus() {
		const button = this.shadowRoot.querySelector('button');
		if (button) button.focus();
	}

}

customElements.define('d2l-table-col-sort-button', TableColSortButton);

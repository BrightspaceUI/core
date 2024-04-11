import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';

/**
 * Button for sorting a table column in ascending/descending order.
 * @slot - Text of the sort button
 */
export class TableColSortButton extends FocusMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Whether sort direction is descending
			 * @type {boolean}
			 */
			desc: {
				reflect: true,
				type: Boolean
			},
			/**
			 * Column is not currently sorted. Hides the ascending/descending sort icon.
			 * @type {boolean}
			 */
			nosort: {
				reflect: true,
				type: Boolean
			},
			/**
			 * @ignore
			 */
			hasSibling: {
				attribute: 'has-sibling',
				reflect: true,
				type: Boolean
			}
		};
	}

	static get styles() {
		return css`
			button {
				align-items: center;
				background-color: transparent;
				border: none;
				color: inherit;
				cursor: pointer;
				display: inline-flex;
				font-family: inherit;
				font-size: inherit;
				letter-spacing: inherit;
				margin: 0;
				padding: 0;
				text-decoration: none;
			}
			button:disabled {
				opacity: 0.5;
			}
			button:focus-visible,
			button:${unsafeCSS(getFocusPseudoClass())} {
				border-radius: 0.2rem;
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
				outline-style: none;
			}
			button::-moz-focus-inner {
				border: 0;
			}
			button:hover {
				background-color: var(--d2l-color-gypsum);
			}
			:host([has-sibling]) button {
				margin-block: -0.3rem -0.3rem;
				margin-inline: -0.3rem 0.3rem;
				padding: 0.3rem;
			}
			:host([has-sibling]) button:hover {
				border-radius: 0.2rem;
			}
			:host(:not([has-sibling])) button {
				border-radius: var(--d2l-sortable-button-border-radius);
				box-sizing: border-box;
				height: var(--d2l-sortable-button-height);
				line-height: 0.85rem;
				padding: var(--d2l-table-cell-padding);
				width: var(--d2l-sortable-button-width);
			}
			:host(:not([has-sibling])) button:focus-visible,
			:host(:not([has-sibling])) button:${unsafeCSS(getFocusPseudoClass())} {
				border-radius: var(--d2l-sortable-button-border-focus-radius);
				height: calc(100% - 8px);
				margin-inline-start: 4px; /* Used to offset the outer box shadow */
				padding-inline-start: calc(var(--d2l-table-cell-padding) - 4px);
				width: calc(100% - 8px);
			}
			:host(:not([has-sibling])) button:focus-visible:hover,
			:host(:not([has-sibling])) button:${unsafeCSS(getFocusPseudoClass())}:hover {
				border-radius: var(--d2l-sortable-button-border-focus-radius);
			}
			:host(:not([has-sibling])) d2l-icon {
				margin-inline-end: -12px;
				margin-inline-start: 12px;
			}
		`;
	}

	constructor() {
		super();
		this.nosort = false;
		this.desc = false;
		this.hasSibling = false;
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const iconView = !this.nosort ?
			html`<d2l-icon icon="${this.desc ? 'tier1:arrow-toggle-down' : 'tier1:arrow-toggle-up'}"></d2l-icon>` :
			null;

		return html`<button type="button"><slot></slot>${iconView}</button>`;
	}

}

customElements.define('d2l-table-col-sort-button', TableColSortButton);

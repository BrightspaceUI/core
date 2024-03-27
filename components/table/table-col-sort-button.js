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
			}
		};
	}

	static get styles() {
		return css`
			button {
				align-items: center;
				background-color: transparent;
				border: none;
				box-sizing: border-box;
				color: inherit;
				cursor: pointer;
				display: inline-flex;
				font-family: inherit;
				font-size: inherit;
				height: var(--d2l-sortable-button-height);
				letter-spacing: inherit;
				line-height: 0.9rem;
				margin: 0;
				padding: var(--d2l-table-cell-padding);
				text-decoration: none;
				width: var(--d2l-sortable-button-width);
			}
			button::-moz-focus-inner {
				border: 0;
			}
			button:disabled {
				opacity: 0.5;
			}
			button:focus-visible,
			button:${unsafeCSS(getFocusPseudoClass())} {
				border-radius: var(--d2l-sortable-button-border-focus-radius);
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
				height: calc(100% - 8px);
				margin-inline-start: 4px; /* Used to offset the outer box shadow */
				outline-style: none;
				padding-inline-start: calc(var(--d2l-table-cell-padding) - 4px);
				width: calc(100% - 8px);
			}
			button:focus-visible:hover,
			button:${unsafeCSS(getFocusPseudoClass())}:hover {
				border-radius: var(--d2l-sortable-button-border-focus-radius);
			}
			button:hover {
				background-color: var(--d2l-color-gypsum);
				border-radius: var(--d2l-sortable-button-border-radius);
			}
			d2l-icon {
				margin-inline-end: -12px;
				margin-inline-start: 12px;
			}
		`;
	}

	constructor() {
		super();
		this.nosort = false;
		this.desc = false;
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

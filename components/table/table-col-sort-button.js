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
			:host {
				--d2l-table-col-sort-button-additional-padding-inline-end: 0px; /* stylelint-disable-line length-zero-no-unit */
				--d2l-table-col-sort-button-margin-inline-end: var(--d2l-table-cell-col-sort-button-size-offset);
				--d2l-table-col-sort-button-width: calc(100% - 2 * var(--d2l-table-cell-col-sort-button-size-offset));
			}
			:host([nosort]) {
				--d2l-table-col-sort-button-additional-padding-inline-end: calc(0.6rem + 18px);
			}
			button {
				align-items: center;
				background-color: transparent;
				border: none;
				border-radius: 4px;
				color: inherit;
				cursor: pointer;
				display: inline-flex;
				font-family: inherit;
				font-size: inherit;
				letter-spacing: inherit;
				line-height: 0.9rem;
				margin: var(--d2l-table-cell-col-sort-button-size-offset);
				margin-inline-end: var(--d2l-table-col-sort-button-margin-inline-end);
				padding: calc(var(--d2l-table-cell-padding) - var(--d2l-table-cell-col-sort-button-size-offset));
				padding-inline-end: calc(var(--d2l-table-cell-padding) - var(--d2l-table-cell-col-sort-button-size-offset) + var(--d2l-table-col-sort-button-additional-padding-inline-end));
				text-decoration: none;
				width: var(--d2l-table-col-sort-button-width);
			}
			button::-moz-focus-inner {
				border: 0;
			}
			button:disabled {
				opacity: 0.5;
			}
			button:hover {
				background-color: var(--d2l-color-gypsum);
			}
			button:focus-visible,
			button:${unsafeCSS(getFocusPseudoClass())} {
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
				outline-style: none;
			}
			d2l-icon {
				margin-inline-start: 0.6rem;
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

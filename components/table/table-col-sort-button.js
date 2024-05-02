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
				--d2l-table-col-sort-button-border-width: 2px;
				--d2l-table-col-sort-button-border: var(--d2l-table-col-sort-button-border-width) solid transparent;
				--d2l-table-col-sort-button-border-radius: 0;
				--d2l-table-col-sort-button-box-shadow: none;
				--d2l-table-col-sort-button-padding-offset: var(--d2l-table-col-sort-button-border-width);
				--d2l-table-col-sort-button-padding: calc(var(--d2l-table-cell-padding) - var(--d2l-table-col-sort-button-padding-offset));
				--d2l-table-col-sort-button-size-offset: 0px; /* stylelint-disable-line length-zero-no-unit */ /* when type="light" button bumps in by 4px */
				--d2l-table-col-sort-button-height: calc(100% - 2 * var(--d2l-table-col-sort-button-size-offset));
				--d2l-table-col-sort-button-width: calc(100% - 2 * var(--d2l-table-col-sort-button-size-offset));
				--d2l-table-col-sort-button-bottom-left-radius: var(--d2l-table-col-sort-button-border-radius);
				--d2l-table-col-sort-button-bottom-right-radius: var(--d2l-table-col-sort-button-border-radius);
				--d2l-table-col-sort-button-top-left-radius: var(--d2l-table-col-sort-button-border-radius);
				--d2l-table-col-sort-button-top-right-radius: var(--d2l-table-col-sort-button-border-radius);
			}
			button {
				align-items: center;
				background-color: transparent;
				border: var(--d2l-table-col-sort-button-border);
				border-radius: var(--d2l-table-col-sort-button-border-radius);
				border-bottom-left-radius: var(--d2l-table-col-sort-button-bottom-left-radius);
				border-bottom-right-radius: var(--d2l-table-col-sort-button-bottom-right-radius);
				border-top-left-radius: var(--d2l-table-col-sort-button-top-left-radius);
				border-top-right-radius: var(--d2l-table-col-sort-button-top-right-radius);
				color: inherit;
				cursor: pointer;
				display: inline-flex;
				font-family: inherit;
				font-size: inherit;
				height: var(--d2l-table-col-sort-button-height);
				letter-spacing: inherit;
				margin-inline-start: var(--d2l-table-col-sort-button-size-offset);
				padding: var(--d2l-table-col-sort-button-padding);
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
				border-color: var(--d2l-color-celestine);
				box-shadow: var(--d2l-table-col-sort-button-box-shadow);
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

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
				border: 2px solid transparent;
				color: inherit;
				cursor: pointer;
				display: inline-flex;
				font-family: inherit;
				font-size: inherit;
				height: 100%;
				letter-spacing: inherit;
				margin-block: -2px;
				padding: calc(var(--d2l-table-cell-padding) - 2px);
				text-decoration: none;
				width: 100%;
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
				outline-style: none;
			}
			d2l-icon {
				margin-inline-start: 0.6rem;
			}

			:host([has-sibling]) button {
				height: unset;
				margin-block: unset;
				padding: 0.3rem;
				width: unset;
			}
			:host([has-sibling]) button:hover,
			:host([has-sibling]) button:focus-visible,
			:host([has-sibling]) button:${unsafeCSS(getFocusPseudoClass())}  {
				border-radius: 0.3rem;
			}
		`;
	}

	constructor() {
		super();
		this.hasSibling = false;
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

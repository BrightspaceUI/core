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
				gap: 0.6rem;
				height: var(--d2l-sortable-button-height);
				letter-spacing: inherit;
				margin: 0;
				padding: 0.75rem;
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
				box-shadow: 0 0 0 0.1rem #ffffff, 0 0 0 0.2rem var(--d2l-color-celestine);
				height: calc(100% - 0.4rem);
				margin-inline-start: 0.2rem;
				outline-style: none;
				padding-inline-start: 0.55rem; /* Left focus padding = Total padding - margin: 0.75rem - 0.2rem */
				width: calc(100% - 0.4rem);
			}
			button:focus-visible:hover,
			button:${unsafeCSS(getFocusPseudoClass())}:hover {
				border-radius: var(--d2l-sortable-button-border-focus-radius);
			}
			button:hover {
				background-color: var(--d2l-color-gypsum);
				border-radius: var(--d2l-sortable-button-border-radius);
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

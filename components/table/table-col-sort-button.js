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
			 * Type of table style to apply. The "light" style has fewer borders and tighter padding.
			 * @type {'default'|'light'}
			 */
			type: {
				reflect: true,
				type: String
			},
		};
	}

	static get styles() {
		return css`
			:host([desc]) .d2l-sortable-button-icon {
				padding: 0;
			}
			:host(:not([desc])) .d2l-sortable-button-icon {
				padding: 0;
			}
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
				gap: 0.4rem;
				letter-spacing: inherit;
				margin: 0;
				padding-inline-start: 1rem;
				height: 100%;
				text-decoration: none;
				width: 100%;
			}
			button::-moz-focus-inner {
				border: 0;
			}
			button:disabled {
				opacity: 0.5;
			}
			button:focus-visible,
			button:${unsafeCSS(getFocusPseudoClass())} {
				border-radius: var(--d2l-sortable-button-border-radius);
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
				outline-style: none;
				padding-inline-start: 0.8rem;
				width: 96%;
			}
			.d2l-sortable-button-dropdown:focus-within {
				padding-inline-start: 0.2rem;
				height: var(--d2l-table-cell-height);
			}
			d2l-dropdown {
				width: 100%;
				height: calc(var(--d2l-table-cell-height) + 0.3rem);
				padding: 0;
			}
			d2l-dropdown:hover {
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

	_handleSlotChange(e) {
		const content = e.target.assignedNodes({ flatten: true });
	}

	render() {
		const iconView = !this.nosort ?
			html`<d2l-icon class="d2l-sortable-button-icon" icon="${this.desc ? 'tier1:arrow-toggle-down' : 'tier1:arrow-toggle-up'}"></d2l-icon>` :
			null;

		return  html`
			<d2l-dropdown class="d2l-sortable-button-dropdown">
				<button class="d2l-dropdown-opener" type="button"><slot></slot>${iconView}</button>
				<d2l-dropdown-menu id="dropdown">
					<d2l-menu>
						<slot name="items" @slotchange="${this._handleSlotChange}"></slot>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`;
	}

}

customElements.define('d2l-table-col-sort-button', TableColSortButton);

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
			_hasItems: { type: Boolean, reflect: true, attribute: '_has-item' }
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
				letter-spacing: inherit;
				height: 100%;
				margin: 0;
				padding: var(--d2l-table-cell-padding);
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
				text-decoration: underline;
			}
			button:focus-visible,
			button:${unsafeCSS(getFocusPseudoClass())} {
				border-radius: 0.2rem;
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
				outline-style: none;
			}
		`;
	}

	constructor() {
		super();
		this.nosort = false;
		this.desc = false;
		this._hasItems = false;
	}

	static get focusElementSelector() {
		return 'button';
	}

	_handleSlotChange(e) {
		const content = e.target.assignedNodes({ flatten: true });
		this._hasItems = content?.length > 0;
	}

	render() {
		const iconView = !this.nosort ?
			html`<d2l-icon icon="${this.desc ? 'tier1:arrow-toggle-down' : 'tier1:arrow-toggle-up'}"></d2l-icon>` :
			null;

		const defaultButton = html`<button type="button"><slot></slot>${iconView}</button>`;
		const itemDropdownButton = html`
			<d2l-dropdown>
				<button class="d2l-dropdown-opener" type="button"><slot></slot>${iconView}</button>
				<d2l-dropdown-menu id="dropdown">
					<d2l-menu label="Items">
						<slot name="items" @slotchange="${this._handleSlotChange}"></slot>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`;
		return this._hasItems ? itemDropdownButton : defaultButton;
	}

}

customElements.define('d2l-table-col-sort-button', TableColSortButton);
